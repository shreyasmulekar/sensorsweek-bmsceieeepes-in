import { expect, it } from "vitest";
import { SPONSORS, SPONSOR_LOGOS } from "@/lib/site";
it("lists Mystic Grace, Insights IAS and Lush Knots", () => {
  expect(SPONSORS).toEqual(["Mystic Grace", "Insights IAS", "Lush Knots"]);
});
it("has a logo for Insights IAS and Lush Knots, none for Mystic Grace", () => {
  expect(SPONSOR_LOGOS["Insights IAS"]).toBeTruthy();
  expect(SPONSOR_LOGOS["Lush Knots"]).toBeTruthy();
  expect(SPONSOR_LOGOS["Mystic Grace"]).toBeUndefined();
});
