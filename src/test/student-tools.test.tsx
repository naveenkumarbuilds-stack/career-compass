import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, params }: any) => (
    <a href={params ? to.replace("$slug", params.slug) : to}>{children}</a>
  ),
}));
import { SaveCareerButton } from "@/components/site/SaveCareerButton";
import { PersonalRoadmaps } from "@/components/site/StudentPlanning";
beforeEach(() => localStorage.clear());
afterEach(cleanup);
describe("Career saving and roadmaps", () => {
  it("saves and removes a career from browser bookmarks", () => {
    render(<SaveCareerButton slug="software-developer" />);
    fireEvent.click(screen.getByRole("button", { name: "Save career" }));
    expect(JSON.parse(localStorage.getItem("careercompass_saved")!)).toContain(
      "software-developer",
    );
    fireEvent.click(screen.getByRole("button", { name: "Saved — remove" }));
    expect(JSON.parse(localStorage.getItem("careercompass_saved")!)).toEqual([]);
  });
  it("searches careers and exposes the selected PDF download", () => {
    render(<PersonalRoadmaps />);
    fireEvent.change(screen.getByLabelText("Search career roadmaps"), {
      target: { value: "software" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));
    expect(
      screen.queryByRole("option", { name: "Fitter — Mechanical Trade" }),
    ).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Career to plan"), {
      target: { value: "software-developer" },
    });
    expect(screen.getByRole("link", { name: "↓ Download roadmap PDF" })).toHaveAttribute(
      "href",
      "/roadmaps/software-developer.pdf",
    );
    expect(screen.getByRole("link", { name: "↓ Download roadmap PDF" })).toHaveAttribute(
      "download",
    );
  });
});
