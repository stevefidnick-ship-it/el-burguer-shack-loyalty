export type Customer = {
  id: string;
  firstName: string;
  phone: string;
  qrToken: string;
  punches: number;
  rewardReady: boolean;
  redemptions: number;
  statusLabel: string;
  updatedAt: string;
};

export type CustomerInput = {
  firstName: string;
  phone: string;
};

const MAX_PUNCHES = 9;

const normalizePhone = (phone: string) => phone.replace(/\D/g, "");

export function createCustomer(input: CustomerInput): Customer {
  const phone = normalizePhone(input.phone);
  const seed = `${input.firstName.trim().toLowerCase()}-${phone || "guest"}`;

  return {
    id: seed,
    firstName: input.firstName.trim() || "Amigo",
    phone,
    qrToken: `ebs-${seed}`,
    punches: 0,
    rewardReady: false,
    redemptions: 0,
    statusLabel: "Collecting punches",
    updatedAt: new Date().toISOString(),
  };
}

export function addComboPunch(customer: Customer): Customer {
  if (customer.rewardReady || customer.punches >= MAX_PUNCHES) {
    return withStatus({ ...customer, punches: MAX_PUNCHES, rewardReady: true });
  }

  const punches = Math.min(customer.punches + 1, MAX_PUNCHES);

  return withStatus({
    ...customer,
    punches,
    rewardReady: punches === MAX_PUNCHES,
  });
}

export function redeemFreeCombo(customer: Customer): Customer {
  if (!customer.rewardReady) {
    return withStatus(customer);
  }

  return withStatus({
    ...customer,
    punches: 0,
    rewardReady: false,
    redemptions: customer.redemptions + 1,
  });
}

export function getPunchSlots(customer: Pick<Customer, "punches">) {
  return Array.from({ length: MAX_PUNCHES }, (_, index) => ({
    id: index + 1,
    filled: index < customer.punches,
  }));
}

export function withStatus(customer: Customer): Customer {
  return {
    ...customer,
    statusLabel: customer.rewardReady ? "Free combo ready" : "Collecting punches",
    updatedAt: new Date().toISOString(),
  };
}

export { MAX_PUNCHES };
