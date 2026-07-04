export interface ArcUser {
  id: string;
  name: string;
  email: string;
}

const STORAGE_KEY = "arc-user";
const COOKIE_NAME = "arc-uid";

export function getUser(): ArcUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ArcUser) : null;
  } catch {
    return null;
  }
}

export function saveUser(user: ArcUser): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  document.cookie = `${COOKIE_NAME}=${user.id};path=/;max-age=${60 * 60 * 24 * 7};SameSite=Lax`;
}

export function clearUser(): void {
  localStorage.removeItem(STORAGE_KEY);
  document.cookie = `${COOKIE_NAME}=;path=/;max-age=0`;
}

export async function uuidFromEmail(email: string): Promise<string> {
  const normalized = email.trim().toLowerCase();
  const msgBuffer = new TextEncoder().encode("arc-v1:" + normalized);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const bytes = new Uint8Array(hashBuffer);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  return [hex.slice(0,8), hex.slice(8,12), hex.slice(12,16), hex.slice(16,20), hex.slice(20,32)].join("-");
}