import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import RulesScreen from "./RulesScreen";

describe("RulesScreen", () => {
  it('should render the heading "Regler"', () => {
    render(<RulesScreen onContinue={() => {}} />);
    expect(screen.getByRole("heading", { name: "Regler" })).toBeInTheDocument();
  });

  it("should display information about how to win the game", () => {
    render(<RulesScreen onContinue={() => {}} />);
    expect(screen.getByText(/Hur man vinner/)).toBeInTheDocument();
    expect(screen.getByText(/vinner spelet/)).toBeInTheDocument();
  });

  it("should display information about how to earn gold coins", () => {
    render(<RulesScreen onContinue={() => {}} />);
    expect(screen.getByText(/Hur man tjänar guldmynt/)).toBeInTheDocument();
    expect(screen.getByText(/svarar rätt på din fråga/)).toBeInTheDocument();
  });

  it("should display information about random question order", () => {
    render(<RulesScreen onContinue={() => {}} />);
    expect(screen.getByText(/Frågeordning/)).toBeInTheDocument();
    expect(screen.getByText(/slumpmässigt/)).toBeInTheDocument();
  });

  it("should have a button to continue to player registration", () => {
    render(<RulesScreen onContinue={() => {}} />);
    expect(
      screen.getByRole("button", { name: /Ok, jag är med!/ })
    ).toBeInTheDocument();
  });

  it("should call onContinue when the button is clicked", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    render(<RulesScreen onContinue={onContinue} />);

    const button = screen.getByRole("button", { name: /Ok, jag är med!/ });
    await user.click(button);

    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});
