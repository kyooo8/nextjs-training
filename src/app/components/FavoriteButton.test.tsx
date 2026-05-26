import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FavoriteButton from "./FavoriteButton";

describe("FavoriteButton", () => {
  it("初期表示はお気に入りに追加", () => {
    render(<FavoriteButton />);
    expect(
      screen.getByRole("button", { name: /お気に入りに追加/ }),
    ).toBeInTheDocument();
  });

  it("クリックするとお気に入り済みに切り替わる", async () => {
    const user = userEvent.setup();
    render(<FavoriteButton />);

    await user.click(screen.getByRole("button"));

    expect(
      screen.getByRole("button", { name: /お気に入り済み/ }),
    ).toBeInTheDocument();
  });
});
