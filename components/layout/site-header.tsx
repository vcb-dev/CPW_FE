"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { locales } from "@/lib/i18n/config";
import { useTheme } from "@/lib/theme/use-theme";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, isActive } from "./site-nav";

const LOGO_MARK_URL = "/logo-mark.png";
const LOGO_WORDMARK_URL = "/logo-wordmark.png";

const toolButton =
  "flex h-11 w-11 items-center justify-center rounded-[11px] border border-[color:var(--vcb-line-strong)] bg-[var(--vcb-panel)] text-foreground transition-colors";

// Dưới 880px nav chính nằm ở thanh tab dưới đáy (MobileTabBar), header chỉ còn logo, ngôn ngữ và theme.
export function SiteHeader() {
  const t = useTranslations("Header");
  const lang = useLocale();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 w-full border-b border-[color:var(--vcb-line-strong)] bg-[var(--vcb-panel)] shadow-[0_20px_70px_-44px_rgba(0,0,0,.55),inset_0_1px_0_rgba(255,255,255,.12)] transition-shadow duration-300",
        isScrolled && "shadow-md"
      )}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 -bottom-px h-px bg-[linear-gradient(90deg,transparent,var(--vcb-gold),var(--tech-cyan),transparent)] opacity-55"
      />

      <div
        className={cn(
          "mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-2 transition-[min-height] duration-300 min-[880px]:px-6",
          isScrolled
            ? "min-h-[64px] min-[880px]:min-h-[76px]"
            : "min-h-[72px] min-[880px]:min-h-[88px]"
        )}
      >
        {/* Logo ngang: bông hoa + chữ, cắt từ public/logo.png (ảnh vuông, chữ nằm dưới hoa nên thu nhỏ thì chữ chỉ còn ~5px).
            880–1099px chỉ hiện hoa vì nav 5 mục cần chỗ; dưới 360px thu nhỏ để không tràn ngang cạnh cụm ngôn ngữ/theme. */}
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 max-[360px]:gap-2 min-[1100px]:gap-3"
        >
          <Image
            src={LOGO_MARK_URL}
            alt={t("logoAlt")}
            width={256}
            height={256}
            preload
            className={cn(
              "h-10 w-auto shrink-0 transition-[height] duration-300 max-[360px]:h-9",
              isScrolled ? "min-[880px]:h-11" : "min-[880px]:h-12"
            )}
          />
          <Image
            src={LOGO_WORDMARK_URL}
            alt=""
            aria-hidden
            width={640}
            height={96}
            preload
            className="h-[15px] w-auto max-[360px]:h-3 min-[880px]:hidden min-[1100px]:block min-[1100px]:h-[18px]"
          />
        </Link>

        <nav
          aria-label={t("primaryNav")}
          className="hidden items-center gap-1 min-[880px]:flex min-[1100px]:gap-2"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative px-3 py-2 text-[0.9375rem] font-medium tracking-[0.01em] transition-colors min-[1100px]:px-4 min-[1100px]:text-[1.0625rem]",
                  active
                    ? "text-[color:var(--vcb-gold)] after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-[var(--vcb-gold)] min-[1100px]:after:inset-x-4"
                    : "text-foreground hover:text-[color:var(--vcb-gold)]"
                )}
              >
                {t(`nav.${item.key}`)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <nav
            aria-label={t("language")}
            className="flex h-[46px] items-center overflow-hidden rounded-[11px] border border-[color:var(--vcb-line-strong)] bg-[var(--vcb-panel)] text-[0.9375rem] font-medium"
          >
            {locales.map((code) => (
              <Link
                key={code}
                href={pathname}
                locale={code}
                hrefLang={code}
                lang={code}
                aria-current={code === lang ? "true" : undefined}
                className={cn(
                  "flex h-full items-center px-3 uppercase transition-colors",
                  code === lang
                    ? "bg-[var(--vcb-gold-soft)] text-[color:var(--vcb-gold)]"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {code}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() =>
              setTheme(theme === "light" ? "dark" : "light")
            }
            aria-label={t("themeToggle")}
            title={t("themeToggle")}
            className={toolButton}
          >
            {/* Đổi icon bằng CSS theo data-theme để không lệch giữa server và client. */}
            <Sun size={20} className="[html[data-theme=light]_&]:hidden" />
            <Moon
              size={20}
              className="hidden [html[data-theme=light]_&]:block"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
