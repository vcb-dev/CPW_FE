import { BLOCK_H2, BLOCK_LEAD } from "@/lib/blocks/rhythm";
import { cn } from "@/lib/utils";
import { RichTitle } from "./rich-title";

// Tiêu đề + câu dẫn của khối mới (nhịp theo lib/blocks/rhythm.ts). Khối nào cần giới hạn bề rộng tiêu đề
// (card-grid, timeline, project-strip, network) truyền `titleClassName`.
export function BlockHead({
  title,
  text,
  titleClassName,
  className,
}: {
  title: string;
  text?: string;
  titleClassName?: string;
  className?: string;
}) {
  // Mobile (< 768px): tiêu đề và câu dẫn căn giữa (Hoàng chốt 2026-11-23); nội dung bên dưới khối vẫn căn trái.
  return (
    <div className={cn("max-md:text-center", className)}>
      <h2 className={cn(BLOCK_H2, "max-md:mx-auto", titleClassName)}>
        <RichTitle text={title} />
      </h2>
      {text && <p className={cn(BLOCK_LEAD, "max-md:mx-auto")}>{text}</p>}
    </div>
  );
}
