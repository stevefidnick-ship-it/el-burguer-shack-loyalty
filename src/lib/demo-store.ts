"use client";

import {
  addComboPunch,
  createCustomer,
  redeemFreeCombo,
  type Customer,
  type CustomerInput,
} from "./loyalty";

const STORAGE_KEY = "el-burguer-shack-customers";

const starterCustomers: Customer[] = [
  { ...createCustomer({ firstName: "Sofia", phone: "5551234567" }), punches: 5 },
  {
    ...createCustomer({ firstName: "Diego", phone: "5557771212" }),
    punches: 9,
    rewardReady: true,
    statusLabel: "Free combo ready",
  },
];

function readCustomers(): Customer[] {
  if (typeof window === "undefined") return starterCustomers;

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(starterCustomers));
    return starterCustomers;
  }

  try {
    return JSON.parse(saved) as Customer[];
  } catch {
    return starterCustomers;
  }
}

function writeCustomers(customers: Customer[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
}

export function normalizeLookup(query: string) {
  return query.trim().replace(/\D/g, "");
}

export function upsertCustomer(input: CustomerInput): Customer {
  const customers = readCustomers();
  const normalizedPhone = input.phone.replace(/\D/g, "");
  const existing = customers.find((customer) => customer.phone === normalizedPhone);

  if (existing) return existing;

  const customer = createCustomer(input);
  writeCustomers([customer, ...customers]);
  return customer;
}

export function findCustomer(query: string): Customer | null {
  return findCustomerInList(readCustomers(), query);
}

export function findCustomerInList(customers: Customer[], query: string): Customer | null {
  const cleanQuery = normalizeLookup(query);
  return (
    customers.find(
      (customer) =>
        customer.phone.includes(cleanQuery) ||
        customer.qrToken.toLowerCase() === query.trim().toLowerCase(),
    ) ?? null
  );
}

export function saveCustomer(customer: Customer): Customer {
  const customers = readCustomers();
  const nextCustomers = customers.some((item) => item.id === customer.id)
    ? customers.map((item) => (item.id === customer.id ? customer : item))
    : [customer, ...customers];

  writeCustomers(nextCustomers);
  return customer;
}

export function addPunchForCustomer(customer: Customer): Customer {
  return saveCustomer(addComboPunch(customer));
}

export function redeemRewardForCustomer(customer: Customer): Customer {
  return saveCustomer(redeemFreeCombo(customer));
}

export function getDemoCustomer(): Customer {
  return readCustomers()[0];
}
