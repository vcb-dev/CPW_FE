import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";
import { RichTitle } from "./rich-title";

// `flush` bỏ khoảng cách phía dưới (dùng khi đặt cạnh nút điều khiển).
export function SectionHead({
  eyebrow,
  title,
  text,
  flush,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  text?: string;
  flush?: boolean;
  className?: string;
}) {
  // Mobile (< 768px): căn giữa như BlockHead (Hoàng chốt 2026-11-23).
  return (
    <div className={cn("max-w-3xl max-md:mx-auto max-md:text-center", flush ? "" : "mb-8", className)}>
      {eyebrow && <Eyebrow className="mb-4 max-md:justify-center">{eyebrow}</Eyebrow>}
      <h2 className="text-3xl font-bold leading-[1.12] md:text-5xl">
        {typeof title === "string" ? <RichTitle text={title} /> : title}
      </h2>
      {text && (
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{text}</p>
      )}
    </div>
  );
}
