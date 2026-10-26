import { expect, it } from "vitest";
import { SPONSORS, SPONSOR_LOGOS } from "@/lib/site";
it("lists Mystic Grace, Insights IAS and Lush Knots", () => {
  expect(SPONSORS).toEqual(["Mystic Grace", "Insights IAS", "Lush Knots"]);
});
it("shows a logo for every sponsor", () => {
  for (const name of SPONSORS) {
    expect(SPONSOR_LOGOS[name], `missing logo for ${name}`).toBeTruthy();
  }
});
