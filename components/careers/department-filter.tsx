import { Link } from "@/i18n/navigation";
import { DEPARTMENT_ORDER, type DepartmentKey } from "@/lib/jobs/constants";
import { cn } from "@/lib/utils";

export function DepartmentFilter({
  active,
  label,
  labels,
}: {
  active?: DepartmentKey;
  label: string;
  labels: Record<DepartmentKey | "all", string>;
}) {
  const chip = (isActive: boolean) =>
    cn(
      "rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
      isActive
        ? "border-transparent bg-foreground text-background"
        : "border-border bg-background hover:bg-muted",
    );
  return (
    // Mobile (< 768px): hàng nút lọc căn giữa theo tiêu đề phía trên (Hoàng chốt 2026-11-23).
    <nav aria-label={label} className="flex flex-wrap gap-2 max-md:justify-center">
      <Link href="/careers" aria-current={!active ? "page" : undefined} className={chip(!active)}>
        {labels.all}
      </Link>
      {DEPARTMENT_ORDER.map((key) => (
        <Link
          key={key}
          href={`/careers?department=${key}`}
          aria-current={active === key ? "page" : undefined}
          className={chip(active === key)}
        >
          {labels[key]}
        </Link>
      ))}
    </nav>
  );
}
