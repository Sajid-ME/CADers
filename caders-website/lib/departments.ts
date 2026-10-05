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