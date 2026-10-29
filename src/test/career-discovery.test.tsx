import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: any) => ({ ...config, useSearch: () => ({}) }),
  Link: ({ children, to, params, ...rest }: any) => (
    <a href={params ? to.replace("$slug", params.slug) : to} {...rest}>
      {children}
    </a>
  ),
}));
import { Careers } from "@/routes/careers/index";
afterEach(cleanup);
describe("Career discovery", () => {
  it("combines stage and text filters and resets them", () => {
    render(<Careers />);
    fireEvent.change(screen.getByLabelText("Education stage"), { target: { value: "after_10th" } });
    expect(screen.queryByRole("heading", { name: "Software Developer" })).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Search careers"), { target: { value: "fitter" } });
    expect(screen.getByRole("status")).toHaveTextContent("1 careers found");
    fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));
    expect(screen.getByRole("heading", { name: "Software Developer" })).toBeInTheDocument();
  });
  it("limits comparison to three and lets students clear it", () => {
    render(<Careers />);
    const boxes = screen.getAllByRole("checkbox");
    for (const box of boxes.slice(0, 3)) fireEvent.click(box);
    expect(boxes[3]).toBeDisabled();
    expect(screen.getByRole("table")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear comparison" }));
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(boxes[3]).not.toBeDisabled();
  });
});
