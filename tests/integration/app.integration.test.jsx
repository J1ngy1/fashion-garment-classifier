import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { act, createElement } from "../../app/node_modules/react/index.js";
import { createRoot } from "../../app/node_modules/react-dom/client.js";
import App from "../../app/src/App";

describe("App integration", () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => {
      root.render(createElement(App));
    });
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("filters the grid by garment type", () => {
    const garmentTypeSelect = container.querySelector("#garmentTypeFilter");

    expect(garmentTypeSelect).not.toBeNull();

    act(() => {
      garmentTypeSelect.value = "Dress";
      garmentTypeSelect.dispatchEvent(new Event("change", { bubbles: true }));
    });

    expect(container.textContent).toContain("1 result(s)");
  });

  it("supports location and time filters together", () => {
    const continentSelect = container.querySelector("#continentFilter");
    const seasonSelect = container.querySelector("#seasonCapturedFilter");
    const yearSelect = container.querySelector("#yearFilter");

    expect(continentSelect).not.toBeNull();
    expect(seasonSelect).not.toBeNull();
    expect(yearSelect).not.toBeNull();

    act(() => {
      continentSelect.value = "Asia";
      continentSelect.dispatchEvent(new Event("change", { bubbles: true }));
    });

    act(() => {
      seasonSelect.value = "Summer";
      seasonSelect.dispatchEvent(new Event("change", { bubbles: true }));
    });

    act(() => {
      yearSelect.value = "2024";
      yearSelect.dispatchEvent(new Event("change", { bubbles: true }));
    });

    expect(container.textContent).toContain("1 result(s)");
    expect(container.textContent).toContain("Bangkok");
  });
});
