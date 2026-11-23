// Địa chỉ gốc của site, dùng cho canonical, hreflang, sitemap. NEXT_PUBLIC_SITE_URL đặt ở môi trường build.
// Thiếu thì dừng, không đoán địa chỉ. Không có dấu "/" cuối.
// Phải giữ nguyên dạng process.env.NEXT_PUBLIC_SITE_URL: Next chỉ nhúng được dạng này vào bundle trình duyệt.
function resolveSiteUrl(raw: string | undefined): string {
  const trimmed = raw?.trim();
  if (!trimmed) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SITE_URL");
  }
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  let parsed: URL;
  try {
    parsed = new URL(withProtocol);
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL must be a valid URL (got "${trimmed}")`,
    );
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL must be http(s) (got "${trimmed}")`,
    );
  }
  return parsed.origin;
}

export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
