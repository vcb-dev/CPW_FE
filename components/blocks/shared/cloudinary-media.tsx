"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import type { ImageProps } from "next/image";
import { CloudinaryImage } from "./cloudinary-image";
import { cloudinaryVideoPosterUrl, cloudinaryVideoUrl } from "@/lib/images/cloudinary-loader";
import { isCloudinaryVideoUrl } from "@/lib/images/is-video-url";
import { cn } from "@/lib/utils";

interface CloudinaryMediaProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  variant: "loop" | "player";
  /** Chỉ áp dụng cho nhánh ảnh — forward xuống next/image (ví dụ hero-block cần preload/fetchPriority). */
  imageProps?: Partial<Omit<ImageProps, "src" | "alt" | "fill" | "sizes" | "className" | "loader">>;
  /** Video vòng lặp tràn màn hình (hero): trên điện thoại lấy bản cắt dọc 9:16 thay vì video ngang. */
  portraitOnMobile?: boolean;
  /** Giây bắt đầu của bản điện thoại (bỏ cảnh đầu cắt dọc xấu); poster cũng lấy khung tại giây này. */
  mobileStart?: number;
}

// Khớp max-md của Tailwind: dưới 768px coi là điện thoại.
const MOBILE_MEDIA = "(max-width: 767px)";

const VIDEO_CLASS = "absolute inset-0 h-full w-full object-cover";

export function CloudinaryMedia({
  src,
  alt,
  sizes,
  className,
  variant,
  imageProps,
  portraitOnMobile,
  mobileStart,
}: CloudinaryMediaProps) {
  if (!isCloudinaryVideoUrl(src)) {
    return <CloudinaryImage src={src} alt={alt} fill sizes={sizes} className={className} {...imageProps} />;
  }
  return variant === "loop" ? (
    <LoopVideo
      src={src}
      alt={alt}
      className={className}
      portraitOnMobile={portraitOnMobile}
      mobileStart={mobileStart}
    />
  ) : (
    <video
      src={cloudinaryVideoUrl(src)}
      controls
      playsInline
      preload="metadata"
      aria-label={alt}
      className={cn(VIDEO_CLASS, className)}
    />
  );
}

function LoopVideo({
  src,
  alt,
  className,
  portraitOnMobile,
  mobileStart,
}: {
  src: string;
  alt: string;
  className?: string;
  portraitOnMobile?: boolean;
  mobileStart?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.play().catch(() => {});
  }, []);

  // Chỉ điện thoại (< 768px) đổi khác; máy tính giữ y nguyên như trước (Hoàng chốt 2026-11-23): cùng URL video gốc,
  // không poster. Trình duyệt lấy <source> đầu tiên có media khớp, nên điện thoại nhận bản nhỏ (hoặc cắt dọc).
  // Ảnh tĩnh cho điện thoại đặt làm nền CSS của thẻ video (thuộc tính poster không chia theo màn hình được): hiện khi
  // video chưa tải xong hoặc không được tự phát, bị khung hình video che khi video chạy.
  const mobilePoster = cloudinaryVideoPosterUrl(src, 1280, mobileStart);
  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      aria-label={alt}
      className={cn(
        VIDEO_CLASS,
        mobilePoster && "max-md:bg-cover max-md:bg-center max-md:[background-image:var(--mobile-poster)]",
        className,
      )}
      style={mobilePoster ? ({ "--mobile-poster": `url("${mobilePoster}")` } as CSSProperties) : undefined}
    >
      <source
        media={MOBILE_MEDIA}
        src={cloudinaryVideoUrl(src, {
          width: portraitOnMobile ? 720 : 1280,
          portrait: portraitOnMobile,
          start: mobileStart,
        })}
      />
      <source src={cloudinaryVideoUrl(src)} />
    </video>
  );
}
