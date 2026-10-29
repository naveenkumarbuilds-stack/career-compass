import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { isLang, useI18n } from "@/i18n";
import type { Database } from "@/integrations/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type AuthCtx = {
  session: Session | null;
  ready: boolean;
  profile: Profile | null;
  profileError: boolean;
  refreshProfile: () => Promise<void>;
  setProfile: (p: Profile) => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setLang } = useI18n();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [profile, setProfileState] = useState<Profile | null>(null);
  const [profileError, setProfileError] = useState(false);

  const loadProfile = useCallback(
    async (uid: string | undefined) => {
      if (!uid) {
        setProfileState(null);
        return;
      }
      const { data, error } = await supabase.from("profiles").select("*").eq("id", uid).maybeSingle();
      setProfileError(!!error);
      setProfileState(data ?? null);
      if (data && isLang(data.preferred_language)) setLang(data.preferred_language);
    },
    [setLang],
  );

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setTimeout(() => void loadProfile(s?.user.id), 0);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
      void loadProfile(data.session?.user.id);
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  return (
    <Ctx.Provider
      value={{
        session,
        ready,
        profile,
        profileError,
        refreshProfile: () => loadProfile(session?.user.id),
        setProfile: setProfileState,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}
