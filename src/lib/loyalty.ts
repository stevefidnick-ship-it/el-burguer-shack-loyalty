/**
 * Loyalty Engine for "The Shack" - Hazte Local
 *
 * Customer-facing: Sellos 💫 (collectible stamps, vintage passport aesthetic)
 * Internal: Hidden point system (scalable, flexible)
 *
 * Conversion:
 * - Combo meal = 100 points = 1 Sello
 * - Burger = 60 points
 * - Fries = 30 points
 * - Drink = 20 points
 * - 10 Sellos (1000 points) = Burgers Gratis reward
 */

export type Customer = {
  id: string;
  firstName: string;
  phone: string;
  qrToken: string;
  
  // Visible to customer
  waves: number;              // Customer-facing: 0-10 Sellos (stamps)
  waveStreakDays: number;     // Consecutive visit days
  
  // Hidden internal system
  points: number;             // Internal: 0-1000 points
  pointsLifetime: number;     // Total points ever earned
  
  // Reward & redemption
  rewardReady: boolean;       // 10 Sellos earned
  redemptions: number;        // Total free combos redeemed
  
  // Member engagement
  memberSince: string;        // ISO date of first visit
  lastVisit: string;          // ISO date of last visit
  totalVisits: number;        // Cumulative visit count
  birthdayMonth?: number;     // 1-12, optional
  
  // Status
  statusLabel: string;
  updatedAt: string;
};

export type CustomerInput = {
  firstName: string;
  phone: string;
  birthdayMonth?: number;
};

// Constants
const MAX_WAVES = 10;
const POINTS_PER_WAVE = 100;
const MAX_POINTS = MAX_WAVES * POINTS_PER_WAVE; // 1000

// Item point values
export const ITEM_POINTS = {
  combo: 100,     // 1 Wave
  burger: 60,
  fries: 30,
  drink: 20,
} as const;

const normalizePhone = (phone: string) => phone.replace(/\D/g, "");

/**
 * Create a new customer record
 */
export function createCustomer(input: CustomerInput): Customer {
  const phone = normalizePhone(input.phone);
  const seed = `${input.firstName.trim().toLowerCase()}-${phone || "guest"}`;
  const now = new Date().toISOString();

  return {
    id: seed,
    firstName: input.firstName.trim() || "Amigo",
    phone,
    qrToken: `ebs-${seed}`,
    
    waves: 0,
    waveStreakDays: 0,
    points: 0,
    pointsLifetime: 0,
    
    rewardReady: false,
    redemptions: 0,
    
    memberSince: now,
    lastVisit: now,
    totalVisits: 0,
    birthdayMonth: input.birthdayMonth,
    
    statusLabel: "Collecting Waves",
    updatedAt: now,
  };
}

/**
 * Add points to a customer and update Waves
 * Typically called when a combo is purchased
 */
export function addPoints(customer: Customer, pointsToAdd: number): Customer {
  if (customer.rewardReady) {
    // Don't accumulate points while reward is pending
    return withStatus(customer);
  }

  const newPoints = Math.min(customer.points + pointsToAdd, MAX_POINTS);
  const newWaves = Math.floor(newPoints / POINTS_PER_WAVE);
  const rewardReady = newWaves >= MAX_WAVES;

  return withStatus({
    ...customer,
    points: newPoints,
    pointsLifetime: customer.pointsLifetime + pointsToAdd,
    waves: newWaves,
    rewardReady,
    lastVisit: new Date().toISOString(),
    totalVisits: customer.totalVisits + 1,
  });
}

/**
 * Add a combo punch (legacy interface, maps to 100 points)
 * Kept for backward compatibility with existing staff flow
 */
export function addComboPunch(customer: Customer): Customer {
  return addPoints(customer, ITEM_POINTS.combo);
}

/**
 * Redeem a free combo reward
 * Resets points/waves to 0 and increments redemption count
 */
export function redeemFreeCombo(customer: Customer): Customer {
  if (!customer.rewardReady) {
    return withStatus(customer);
  }

  return withStatus({
    ...customer,
    points: 0,
    waves: 0,
    rewardReady: false,
    redemptions: customer.redemptions + 1,
    lastVisit: new Date().toISOString(),
    totalVisits: customer.totalVisits + 1,
  });
}

/**
 * Get visual representation of punch slots (for legacy UI)
 * Returns array of 10 slots showing filled/empty state
 */
export function getWaveSlots(customer: Pick<Customer, "waves">) {
  return Array.from({ length: MAX_WAVES }, (_, index) => ({
    id: index + 1,
    filled: index < customer.waves,
  }));
}

/**
 * Calculate remaining Waves needed for reward
 */
export function getWavesRemaining(customer: Pick<Customer, "waves">) {
  return Math.max(0, MAX_WAVES - customer.waves);
}

/**
 * Get progress percentage (0-100)
 */
export function getProgressPercent(customer: Pick<Customer, "waves">) {
  return Math.round((customer.waves / MAX_WAVES) * 100);
}

/**
 * Format member tenure (e.g., "Member since January 2026")
 */
export function formatMemberSince(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleString("es-MX", { month: "long" });
  const year = date.getFullYear();
  return `Miembro desde ${month} ${year}`;
}

/**
 * Update status label based on customer state
 */
export function withStatus(customer: Customer): Customer {
  let statusLabel = "Collecting Waves";
  
  if (customer.rewardReady) {
    statusLabel = "Free combo ready! 🎉";
  } else if (customer.waves === MAX_WAVES - 1) {
    statusLabel = "1 Wave away from free combo!";
  } else if (customer.waves > 0) {
    statusLabel = `${getWavesRemaining(customer)} Waves to go`;
  }

  return {
    ...customer,
    statusLabel,
    updatedAt: new Date().toISOString(),
  };
}

export { MAX_WAVES, MAX_POINTS, POINTS_PER_WAVE };
