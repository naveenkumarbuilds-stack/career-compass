-- CareerCompass Phase 1: profiles
DO $$ BEGIN
  CREATE TYPE public.preferred_language AS ENUM ('en','kn');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE public.study_stage AS ENUM ('after_10th','after_12th');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL CHECK (char_length(btrim(full_name)) BETWEEN 1 AND 100),
  preferred_language public.preferred_language NOT NULL DEFAULT 'en',
  stage public.study_stage NOT NULL,
  guardian_permission_ack boolean NOT NULL DEFAULT false,
  guardian_permission_ack_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
REVOKE ALL ON public.profiles FROM anon;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Own profile select" ON public.profiles;
DROP POLICY IF EXISTS "Own profile insert" ON public.profiles;
DROP POLICY IF EXISTS "Own profile update" ON public.profiles;
CREATE POLICY "Own profile select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Users may only update name/language/stage
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (full_name, preferred_language, stage) ON public.profiles TO authenticated;

CREATE OR REPLACE FUNCTION public.touch_profiles_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END $$;
DROP TRIGGER IF EXISTS profiles_touch ON public.profiles;
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.touch_profiles_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_name text := btrim(coalesce(NEW.raw_user_meta_data->>'full_name',''));
  v_lang text := NEW.raw_user_meta_data->>'preferred_language';
  v_stage text := NEW.raw_user_meta_data->>'stage';
  v_ack boolean := coalesce((NEW.raw_user_meta_data->>'guardian_permission_ack') = 'true', false);
BEGIN
  IF char_length(v_name) < 1 THEN v_name := split_part(coalesce(NEW.email,'Student'),'@',1); END IF;
  v_name := left(v_name, 100);
  IF v_lang IS NULL OR v_lang NOT IN ('en','kn') THEN v_lang := 'en'; END IF;
  IF v_stage IS NULL OR v_stage NOT IN ('after_10th','after_12th') THEN v_stage := 'after_10th'; END IF;
  INSERT INTO public.profiles (id, full_name, preferred_language, stage, guardian_permission_ack, guardian_permission_ack_at)
  VALUES (NEW.id, v_name, v_lang::public.preferred_language, v_stage::public.study_stage, v_ack, CASE WHEN v_ack THEN now() END)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();