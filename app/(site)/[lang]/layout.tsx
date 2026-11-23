import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import "../../globals.css";
import { htmlClassName } from "@/lib/fonts";
import { THEME_INIT_SCRIPT } from "@/lib/theme/init-script";
import { hasLocale, locales } from "@/lib/i18n/config";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/seo/json-ld";
import { SITE_URL } from "@/lib/seo/site-url";
import { getSiteSettings } from "@/lib/api/site-settings";
import { brandName } from "@/lib/site/contact-info";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { LenisProvider } from "@/components/layout/lenis-provider";
import { Toaster } from "@/components/ui/sonner";

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

// Không đặt dynamicParams = false ở layout này: Next gộp dynamicParams của mọi segment trên đường đi (chỉ cần một
// segment false là cả route false), nên news/[slug] và careers/[slug] (generateStaticParams trả []) sẽ 404 hết trên
// bản build, dù trang tự đặt true. Ngôn ngữ lạ đã bị chặn bằng notFound() bên dưới và trong i18n/request.ts.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getTranslations({ locale: lang, namespace: "Meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("siteName"), template: `%s | ${t("siteName")}` },
    description: t("siteDescription"),
  };
}

export default async function SiteLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const messages = await getMessages();
  const common = await getTranslations("Common");
  const meta = await getTranslations("Meta");
  const settings = await getSiteSettings();
  const brand = brandName(settings, meta("siteName"));

  return (
    <html lang={lang} className={htmlClassName} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      {/* --mobile-tabbar-space = chiều cao MobileTabBar (64px + vùng an toàn iPhone) dưới 880px, 0 từ 880px:
          chừa chỗ để thanh tab không che footer, và đẩy toast lên trên thanh tab. */}
      <body className="flex flex-col font-body pb-[var(--mobile-tabbar-space)] [--mobile-tabbar-space:calc(4rem_+_env(safe-area-inset-bottom))] min-[880px]:[--mobile-tabbar-space:0px]">
        <JsonLd data={organizationJsonLd(SITE_URL, brand, settings)} />
        <JsonLd data={webSiteJsonLd(SITE_URL, brand)} />
        {/* Chỉ gửi xuống client các nhóm chữ mà client component dùng. */}
        <NextIntlClientProvider messages={{ Header: messages.Header, Carousel: messages.Carousel, Errors: messages.Errors }}>
          <LenisProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground"
            >
              {common("skipToContent")}
            </a>
            <SiteHeader />
            {/* padding-top = chiều cao header lúc chưa cuộn (72px mobile, 88px từ 880px) */}
            <main id="main" tabIndex={-1} className="flex-1 pt-[72px] min-[880px]:pt-[88px]">{children}</main>
            <SiteFooter />
            <MobileTabBar />
            {/* Giữ khoảng mặc định của sonner (24px, mobile 16px) và cộng thêm chỗ của thanh tab. */}
            <Toaster
              offset={{ bottom: "calc(24px + var(--mobile-tabbar-space, 0px))" }}
              mobileOffset={{ bottom: "calc(16px + var(--mobile-tabbar-space, 0px))" }}
            />
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
