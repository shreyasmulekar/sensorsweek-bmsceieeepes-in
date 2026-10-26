import { expect, it } from "vitest";
import { SPONSORS, SPONSOR_LOGOS } from "@/lib/site";
it("includes Insights IAS alongside Mystic Grace", () => {
  expect(SPONSORS).toEqual(["Mystic Grace", "Insights IAS"]);
  expect(SPONSOR_LOGOS["Insights IAS"]).toBeTruthy();
  expect(SPONSOR_LOGOS["Mystic Grace"]).toBeUndefined();
});
