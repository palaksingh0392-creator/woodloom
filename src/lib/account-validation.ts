export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function formatPhoneInput(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const digits = trimmed.replace(/\D/g, "");
  const hasExplicitCountryCode = /^\+?91(?:[\s-]|$)/.test(trimmed);
  const withoutCountry = hasExplicitCountryCode
    ? digits.slice(0, 2) === "91"
      ? digits.slice(2)
      : digits
    : digits.length > 10 && digits.startsWith("91")
      ? digits.slice(2)
      : digits;
  const limited = withoutCountry.slice(0, 10);

  if (!limited) {
    return hasExplicitCountryCode ? "+91 " : "";
  }

  if (limited.length <= 5) {
    return `+91 ${limited}`;
  }

  return `+91 ${limited.slice(0, 5)} ${limited.slice(5)}`;
}

export function formatIndianPhone(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (!/^[+\d\s-]+$/.test(trimmed)) {
    return "";
  }

  const digits = trimmed.replace(/\D/g, "");
  const hasCountryCode = digits.startsWith("91") && digits.length === 12;
  const withoutCountry = hasCountryCode ? digits.slice(2) : digits;

  if (withoutCountry.length !== 10) {
    return "";
  }

  if (trimmed.includes("+") && !trimmed.startsWith("+91")) {
    return "";
  }

  if (digits.length === 12 && !digits.startsWith("91")) {
    return "";
  }

  return `+91${withoutCountry}`;
}

export function normalizePhone(value: string) {
  return formatIndianPhone(value) || "";
}

export function isValidPhone(value: string) {
  return Boolean(formatIndianPhone(value));
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidLoginIdentifier(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return false;
  }

  return isValidEmail(trimmed) || isValidPhone(trimmed) || isValidPhone(`+91 ${trimmed}`);
}

export function isStrongPassword(value: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
}
