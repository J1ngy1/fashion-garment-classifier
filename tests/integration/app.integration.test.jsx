import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../../app/src/App";

describe("App integration", () => {
  it("filters the grid by garment type", async () => {
    const user = userEvent.setup();
    render(<App />);

    const garmentTypeSelect = screen.getByLabelText(/garment type/i);
    await user.selectOptions(garmentTypeSelect, "Dress");

    expect(screen.getByText(/1 result\(s\)/i)).toBeInTheDocument();
  });
});
