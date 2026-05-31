import { describe, expect, it } from "vitest";
import { addComboPunch, createCustomer, redeemFreeCombo } from "./loyalty";
import { findCustomerInList } from "./demo-store";

describe("loyalty punch flow", () => {
  it("marks the reward ready after the ninth combo punch", () => {
    let customer = createCustomer({
      firstName: "Luna",
      phone: "5551234567",
    });

    for (let index = 0; index < 9; index += 1) {
      customer = addComboPunch(customer);
    }

    expect(customer.punches).toBe(9);
    expect(customer.rewardReady).toBe(true);
    expect(customer.statusLabel).toBe("Free combo ready");
  });

  it("does not add more punches while a free combo is waiting", () => {
    const customer = {
      ...createCustomer({ firstName: "Mateo", phone: "5558881212" }),
      punches: 9,
      rewardReady: true,
    };

    const result = addComboPunch(customer);

    expect(result.punches).toBe(9);
    expect(result.rewardReady).toBe(true);
  });

  it("redeems a ready reward and starts the next card", () => {
    const customer = {
      ...createCustomer({ firstName: "Sol", phone: "5557779999" }),
      punches: 9,
      rewardReady: true,
    };

    const result = redeemFreeCombo(customer);

    expect(result.punches).toBe(0);
    expect(result.rewardReady).toBe(false);
    expect(result.redemptions).toBe(1);
    expect(result.statusLabel).toBe("Collecting punches");
  });

  it("recovers a customer by phone number even if formatting changes", () => {
    const customer = createCustomer({
      firstName: "Luna",
      phone: "(555) 123-4567",
    });

    expect(findCustomerInList([customer], "555.123.4567")?.firstName).toBe("Luna");
  });
});
