import { getJobs, type PublicJob } from "@/lib/api/jobs";
import type { Locale } from "@/lib/i18n/config";

// Hồ sơ ứng tuyển luôn gửi `position` là tên tiếng Việt: admin gom hồ sơ theo đúng chuỗi này (spec 2026-11-23 D4).
// Trả slug → tên tiếng Việt; ở `/en` lấy từ một lần gọi getJobs("vi"), thiếu slug hoặc gọi lỗi thì dùng tên đang hiện.
export async function getApplyTitles(
  lang: Locale,
  jobs: PublicJob[]
): Promise<Record<string, string>> {
  const shown = Object.fromEntries(jobs.map((job) => [job.slug, job.title]));
  if (lang === "vi" || jobs.length === 0) return shown;

  const vi = await getJobs("vi");
  if (vi.status !== "ok") return shown;
  const viTitles = new Map(vi.data.map((job) => [job.slug, job.title]));
  return Object.fromEntries(jobs.map((job) => [job.slug, viTitles.get(job.slug) ?? job.title]));
}
