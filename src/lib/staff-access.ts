export const DEFAULT_STAFF_PIN = "2019";

export function normalizeStaffPin(pin: string) {
  return pin.replace(/\D/g, "");
}

export function canAccessStaffMode(inputPin: string, configuredPin = DEFAULT_STAFF_PIN) {
  return normalizeStaffPin(inputPin) === normalizeStaffPin(configuredPin);
}
