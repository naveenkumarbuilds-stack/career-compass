import { fireEvent, render, screen, cleanup, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
const { reset } = vi.hoisted(() => ({ reset: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: { auth: { resetPasswordForEmail: reset } },
}));
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: any) => config,
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));
import { Route } from "@/routes/forgot-password";
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
describe("Account recovery", () => {
  it("requests recovery using the local reset page and gives a private confirmation", async () => {
    reset.mockResolvedValue({ error: null });
    const Page = Route.options?.component || (Route as any).component;
    render(<Page />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "student@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Send recovery link" }));
    await waitFor(() =>
      expect(reset).toHaveBeenCalledWith("student@example.com", {
        redirectTo: `${window.location.origin}/reset-password`,
      }),
    );
    expect(await screen.findByRole("status")).toHaveTextContent("If an account exists");
  });
  it("allows retry when the recovery service fails", async () => {
    reset.mockRejectedValue(new Error("offline"));
    const Page = (Route as any).component;
    render(<Page />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "student@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Send recovery link" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Connection failed");
    expect(screen.getByRole("button", { name: "Send recovery link" })).toBeEnabled();
  });
});
