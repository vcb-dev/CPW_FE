import {
  Building,
  BriefcaseBusiness,
  House,
  Newspaper,
  Phone,
  type LucideIcon,
} from "lucide-react";

// Danh sách mục điều hướng dùng chung cho nav trên header (desktop) và thanh tab dưới đáy (mobile).
export const NAV_ITEMS: ReadonlyArray<{
  href: string;
  key: "home" | "about" | "careers" | "news" | "contact";
  icon: LucideIcon;
}> = [
  { href: "/", key: "home", icon: House },
  { href: "/about", key: "about", icon: Building },
  { href: "/careers", key: "careers", icon: BriefcaseBusiness },
  { href: "/news", key: "news", icon: Newspaper },
  { href: "/contact", key: "contact", icon: Phone },
];

export function isActive(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}
