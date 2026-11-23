"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, isActive } from "./site-nav";

// Thanh tab cố định dưới đáy, thay cho nút hamburger trên mobile (dưới 880px, cùng mốc với nav trên header).
// Chiều cao 64px + vùng an toàn iPhone; layout chừa đúng khoảng này qua biến --mobile-tabbar-space.
export function MobileTabBar() {
  const t = useTranslations("Header");
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("primaryNav")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--vcb-line-strong)] bg-[var(--vcb-panel)] pb-[env(safe-area-inset-bottom)] shadow-[0_-20px_60px_-44px_rgba(0,0,0,.55)] min-[880px]:hidden"
    >
      <ul className="mx-auto grid h-16 max-w-[640px] grid-cols-5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="min-w-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-full flex-col items-center justify-center gap-1 px-1 transition-colors",
                  active
                    ? "text-[color:var(--vcb-gold)] before:absolute before:inset-x-4 before:top-0 before:h-0.5 before:rounded-full before:bg-[var(--vcb-gold)]"
                    : "text-muted-foreground active:text-foreground"
                )}
              >
                <Icon size={22} strokeWidth={active ? 2.25 : 1.75} aria-hidden />
                <span className="w-full truncate text-center text-[0.6875rem] font-medium leading-tight">
                  {t(`nav.${item.key}`)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
