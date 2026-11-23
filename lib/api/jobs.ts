import { apiGet } from "./client";
import type { ApiResult } from "./result";
import { CACHE_TAGS } from "./tags";
import type { Locale } from "../i18n/config";

// Hình dạng GET /jobs/public?lang=vi|en (cpw_be/src/jobs/dto/public-job.dto.ts): chỉ trả việc có status "Đang tuyển".
// `title`/`description` đã được backend giải theo `lang` (en thiếu bản dịch thì về tiếng Việt, theo từng field).
// `description`, `createdAt` là optional như trong PublicJobDto (mô tả trống thì backend bỏ field).
export interface PublicJob {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  status: string;
  description?: string;
  createdAt?: string;
}

type RawPublicJob = PublicJob & {
  titleEn?: string;
  descriptionEn?: string;
};

function isJob(value: unknown): value is RawPublicJob {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.slug === "string" &&
    typeof v.title === "string" &&
    typeof v.department === "string" &&
    typeof v.location === "string" &&
    typeof v.type === "string"
  );
}

// Khi backend chưa giải sẵn ngôn ngữ (vẫn trả kèm titleEn/descriptionEn từ document gốc), tự chọn theo `lang`.
// Khi backend đã giải sẵn (không còn titleEn/descriptionEn trong response), giữ nguyên `title` và `description`.
function resolveJob(doc: RawPublicJob, lang: Locale): PublicJob {
  const isEn = lang === "en";
  const titleEn = typeof doc.titleEn === "string" ? doc.titleEn.trim() : "";
  const descEn = typeof doc.descriptionEn === "string" ? doc.descriptionEn.trim() : "";
  const descVi = typeof doc.description === "string" ? doc.description.trim() : "";
  const description = (isEn && descEn ? descEn : descVi) || undefined;

  return {
    slug: doc.slug,
    title: isEn && titleEn ? titleEn : doc.title,
    department: doc.department,
    location: doc.location,
    type: doc.type,
    status: doc.status,
    ...(description ? { description } : {}),
    ...(doc.createdAt ? { createdAt: doc.createdAt } : {}),
  };
}

export async function getJobs(lang: Locale): Promise<ApiResult<PublicJob[]>> {
  const result = await apiGet<unknown>(`/jobs/public?lang=${lang}`, {
    tags: [CACHE_TAGS.jobs],
  });
  if (result.status === "error") return result;
  if (result.status === "not-found") return { status: "ok", data: [] };
  if (!Array.isArray(result.data)) return { status: "error" };
  return {
    status: "ok",
    data: result.data.filter(isJob).map((job) => resolveJob(job, lang)),
  };
}

export async function getJobBySlug(
  slug: string,
  lang: Locale
): Promise<ApiResult<PublicJob>> {
  const result = await apiGet<unknown>(
    `/jobs/public/${encodeURIComponent(slug)}?lang=${lang}`,
    {
      tags: [CACHE_TAGS.jobs],
    }
  );
  if (result.status !== "ok") return result;
  return isJob(result.data)
    ? { status: "ok", data: resolveJob(result.data, lang) }
    : { status: "error" };
}
