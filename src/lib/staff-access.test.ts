import { describe, expect, it } from "vitest";
import { canAccessStaffMode, normalizeStaffPin } from "./staff-access";

describe("staff access", () => {
  it("accepts the configured staff pin after trimming spaces", () => {
    expect(canAccessStaffMode(" 2019 ", "2019")).toBe(true);
  });

  it("rejects the wrong staff pin", () => {
    expect(canAccessStaffMode("1234", "2019")).toBe(false);
  });

  it("keeps only digits in a staff pin", () => {
    expect(normalizeStaffPin("20-19")).toBe("2019");
  });
});
