import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { StartScreen } from "../StartScreen";

describe("StartScreen", () => {
  it("renders the main heading", () => {
    render(<StartScreen setPhase={vi.fn()} initializeGame={vi.fn()} />);
    const heading = screen.getByRole("heading", { name: /Geo-Guess/i });
    expect(heading).toBeInTheDocument();
  });

  it("renders the play buttons", () => {
    render(<StartScreen setPhase={vi.fn()} initializeGame={vi.fn()} />);
    const soloButton = screen.getByRole("button", { name: /Solo Play/i });
    const teamButton = screen.getByRole("button", { name: /Team Play/i });
    const quickStartButton = screen.getByRole("button", {
      name: /Quick Start/i,
    });

    expect(soloButton).toBeInTheDocument();
    expect(teamButton).toBeInTheDocument();
    expect(quickStartButton).toBeInTheDocument();
  });
});
