import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import type { ReactNode } from "react";
import { I18nProvider } from "@/i18n";
import en from "@/i18n/en";
import { Signup } from "@/routes/signup";
import { ProfilePage } from "@/routes/_authenticated/profile";

const mocks = vi.hoisted(() => ({ signup: vi.fn(), single: vi.fn(), update: vi.fn(), signout: vi.fn(), navigate: vi.fn(), setProfile: vi.fn(), session: null as unknown, profile: null as unknown }));
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: unknown) => ({ options, useSearch: () => ({}) }),
  useNavigate: () => mocks.navigate,
  Link: ({ children }: {children: ReactNode}) => <a>{children}</a>,
}));
vi.mock("@/lib/auth", () => ({ useAuth: () => ({session:mocks.session, ready:true, profile:mocks.profile, profileError:false, setProfile:mocks.setProfile, refreshProfile:vi.fn()}) }));
vi.mock("@/integrations/supabase/client", () => ({isSupabaseConfigured:true, supabase:{auth:{signUp:mocks.signup,signOut:mocks.signout},from:()=>({update:mocks.update})}}));
vi.mock("sonner", () => ({toast:{success:vi.fn(),error:vi.fn()}}));

beforeEach(() => {
  cleanup(); localStorage.clear(); vi.clearAllMocks();
  mocks.session=null; mocks.profile=null;
  mocks.update.mockReturnValue({eq:()=>({select:()=>({single:mocks.single})})});
});

function signupForm() {
  render(<I18nProvider><Signup /></I18nProvider>);
  fireEvent.change(screen.getByLabelText(en.auth.nameLabel),{target:{value:"Student"}});
  fireEvent.change(screen.getByLabelText(en.auth.emailLabel),{target:{value:"student@example.invalid"}});
  fireEvent.change(screen.getByLabelText(en.auth.passwordLabel),{target:{value:"sample-password-123"}});
  fireEvent.click(screen.getByLabelText(en.stage.after_10th));
  fireEvent.click(screen.getByLabelText(en.auth.guardianLabel));
  fireEvent.click(screen.getByRole("button",{name:en.auth.signupButton}));
}

describe("signup confirmation UI with mocked Supabase",()=>{
  it("sends minimal metadata and shows check-email without assuming a session",async()=>{
    mocks.signup.mockResolvedValue({data:{user:{identities:[{}]},session:null},error:null});
    signupForm();
    await screen.findByRole("heading",{name:en.auth.checkEmailTitle});
    const request=mocks.signup.mock.calls[0]?.[0];
    expect(request.options.data).toEqual({full_name:"Student",preferred_language:"en",stage:"after_10th",guardian_permission_ack:true});
    expect(request.options.data).not.toHaveProperty("password");
    expect(mocks.navigate).not.toHaveBeenCalled();
  });
  it("handles a rejected network request and re-enables submit",async()=>{
    mocks.signup.mockRejectedValue(new Error("network")); signupForm();
    await screen.findByText(en.errors.network);
    expect(screen.getByRole("button",{name:en.auth.signupButton})).toBeEnabled();
  });
});

describe("profile UI with mocked Supabase",()=>{
  beforeEach(()=>{
    mocks.session={user:{id:"student-id",email:"student@example.invalid"}};
    mocks.profile={id:"student-id",full_name:"Student",preferred_language:"en",stage:"after_10th"};
  });
  it("saves only editable profile fields and reflects the returned record",async()=>{
    mocks.single.mockResolvedValue({data:{...(mocks.profile as object),full_name:"New Name"},error:null});
    render(<I18nProvider><ProfilePage /></I18nProvider>);
    fireEvent.change(screen.getByLabelText(en.auth.nameLabel),{target:{value:"New Name"}});
    fireEvent.click(screen.getByRole("button",{name:en.profile.save}));
    await waitFor(()=>expect(mocks.setProfile).toHaveBeenCalled());
    expect(mocks.update).toHaveBeenCalledWith({full_name:"New Name",preferred_language:"en",stage:"after_10th"});
    expect(screen.getByLabelText(en.auth.emailLabel)).toBeDisabled();
  });
  it("does not claim logout succeeded when the provider rejects it",async()=>{
    mocks.signout.mockResolvedValue({error:{message:"network"}});
    render(<I18nProvider><ProfilePage /></I18nProvider>);
    fireEvent.click(screen.getByRole("button",{name:en.profile.logout}));
    await waitFor(()=>expect(mocks.signout).toHaveBeenCalled());
    expect(mocks.navigate).not.toHaveBeenCalled();
  });
});
