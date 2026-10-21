export const USERNAME_DOMAIN = "@caders.kuet";

export const DEPARTMENTS = [
  { code: "ME", name: "Mechanical Engineering" },
  { code: "CSE", name: "Computer Science and Engineering" },
  { code: "EEE", name: "Electrical and Electronic Engineering" },
  { code: "CE", name: "Civil Engineering" },
  { code: "ECE", name: "Electronics and Communication Engineering" },
  { code: "IEM", name: "Industrial Engineering and Management" },
  { code: "BECM", name: "Building Engineering and Construction Management" },
  { code: "MSE", name: "Materials Science and Engineering" },
  { code: "BME", name: "Biomedical Engineering" },
  { code: "TE", name: "Textile Engineering" },
  { code: "LE", name: "Leather Engineering" },
  { code: "ARCH", name: "Architecture" },
  { code: "URP", name: "Urban and Regional Planning" },
] as const;

export type DepartmentCode = (typeof DEPARTMENTS)[number]["code"];

/**
 * Derives a username base from a full name by taking the last word
 * ("MK Sajid" → "sajid").
 */
export function deriveSurname(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  const last = parts[parts.length - 1] || "user";
  return last.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Takes the last 3 digits of the roll, left-padded with zeros. */
export function deriveRollSuffix(roll: string) {
  const digits = roll.replace(/\D/g, "");
  if (!digits) return "000";
  return digits.slice(-3).padStart(3, "0");
}

/** Builds the base username, e.g. "sajidme021". */
export function buildUsernameBase(
  surnameBase: string,
  deptCode: string,
  roll: string
) {
  return `${surnameBase.toLowerCase()}${deptCode.toLowerCase()}${deriveRollSuffix(
    roll
  )}`;
}

/**
 * Normalizes any free-form department string (from Google Forms, CSV imports, etc.)
 * into an official KUET department code (e.g., "Mechanical Engineering" -> "ME").
 */
export function normalizeDepartmentCode(rawDept: string): string {
  const cleaned = (rawDept || "").trim();
  if (!cleaned) return "";

  // 1. Direct code match (ME, CSE, etc.)
  const directMatch = DEPARTMENTS.find(
    (d) => d.code.toLowerCase() === cleaned.toLowerCase()
  );
  if (directMatch) return directMatch.code;

  // 2. Full department name or substring match
  const lower = cleaned.toLowerCase();
  for (const dept of DEPARTMENTS) {
    if (
      dept.name.toLowerCase() === lower ||
      lower.includes(dept.name.toLowerCase()) ||
      dept.name.toLowerCase().includes(lower)
    ) {
      return dept.code;
    }
  }

  // 3. Keyword / abbreviation checks
  if (/\b(mech|me)\b/i.test(cleaned) || lower.includes("mechanical")) return "ME";
  if (/\b(cse|cs)\b/i.test(cleaned) || lower.includes("computer")) return "CSE";
  if (/\b(ece)\b/i.test(cleaned) || (lower.includes("electronic") && lower.includes("comm"))) return "ECE";
  if (/\b(eee|ee)\b/i.test(cleaned) || lower.includes("electrical")) return "EEE";
  if (/\b(ce|civil)\b/i.test(cleaned) || lower.includes("civil")) return "CE";
  if (/\b(iem|industrial)\b/i.test(cleaned) || lower.includes("industrial")) return "IEM";
  if (/\b(becm|building)\b/i.test(cleaned) || lower.includes("building")) return "BECM";
  if (/\b(mse|materials)\b/i.test(cleaned) || lower.includes("material")) return "MSE";
  if (/\b(bme|biomedical)\b/i.test(cleaned) || lower.includes("biomedical")) return "BME";
  if (/\b(te|textile)\b/i.test(cleaned) || lower.includes("textile")) return "TE";
  if (/\b(le|leather)\b/i.test(cleaned) || lower.includes("leather")) return "LE";
  if (/\b(arch|architecture)\b/i.test(cleaned) || lower.includes("architecture")) return "ARCH";
  if (/\b(urp|urban|planning)\b/i.test(cleaned) || lower.includes("urban")) return "URP";

  // Fallback: clean to uppercase alphabetic characters (up to 5 chars)
  const fallback = cleaned.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 5);
  return fallback || "GEN";
}
