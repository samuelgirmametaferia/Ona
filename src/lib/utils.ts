import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function blurEmail(email: string | null): string {
  if (!email) return "—";
  const [local, domain] = email.split("@");
  if (!domain) return "••••@••••.•••";
  const masked = local.slice(0, 2) + "•••@" + domain.slice(0, 2) + "•••";
  return masked;
}

export function blurPhone(phone: string | null): string {
  if (!phone) return "—";
  return phone.slice(0, 3) + "•••••••";
}
