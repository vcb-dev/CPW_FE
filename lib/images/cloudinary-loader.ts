const CLOUDINARY_HOST = "res.cloudinary.com";
const MARKER = "/image/upload/";

// Loader cho next/image: thêm f_auto,q_auto,w_<width> vào URL Cloudinary.
// Biến đổi của mình được đặt SAU các biến đổi có sẵn (trước phần version v123) để width cuối cùng thắng.
// URL không phải Cloudinary, không phải https, hoặc không phải URL thì trả nguyên.
export function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return src;
  }
  if (url.protocol !== "https:" || url.hostname !== CLOUDINARY_HOST) return src;

  const at = url.pathname.indexOf(MARKER);
  if (at === -1) return src;

  const head = url.pathname.slice(0, at + MARKER.length);
  const segments = url.pathname.slice(at + MARKER.length).split("/");
  const versionAt = segments.findIndex((segment) => /^v\d+$/.test(segment));
  segments.splice(versionAt === -1 ? 0 : versionAt, 0, `f_auto,q_${quality ?? "auto"},w_${width}`);
  url.pathname = head + segments.join("/");
  return url.toString();
}

const VIDEO_MARKER = "/video/upload/";

// Chèn một đoạn biến đổi vào URL video Cloudinary (trước phần version, như loader ảnh). `ext` đổi đuôi file
// (".jpg" = Cloudinary trả một khung hình tĩnh của video). URL không phải video Cloudinary thì trả null.
function transformVideo(src: string, transformation: string, ext?: string): string | null {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.hostname !== CLOUDINARY_HOST) return null;

  const at = url.pathname.indexOf(VIDEO_MARKER);
  if (at === -1) return null;

  const head = url.pathname.slice(0, at + VIDEO_MARKER.length);
  const segments = url.pathname.slice(at + VIDEO_MARKER.length).split("/");
  const versionAt = segments.findIndex((segment) => /^v\d+$/.test(segment));
  segments.splice(versionAt === -1 ? 0 : versionAt, 0, transformation);
  if (ext) {
    const last = segments.length - 1;
    segments[last] = segments[last].replace(/\.[^./]+$/, "") + ext;
  }
  url.pathname = head + segments.join("/");
  return url.toString();
}

// Không truyền gì = URL như trước giờ (chỉ f_auto,q_auto, dùng cho máy tính). Bản điện thoại truyền `width` vì video
// gốc admin tải lên có thể là 4K; `portrait` cắt sẵn khung dọc 9:16 ở giữa (đúng phần một khối tràn màn hình như hero vẫn
// hiện trên điện thoại), nét hơn và nhẹ hơn video ngang cùng dung lượng; `start` (giây) bỏ đoạn đầu video.
export function cloudinaryVideoUrl(
  src: string,
  { width, portrait, start }: { width?: number; portrait?: boolean; start?: number } = {},
): string {
  const parts = ["f_auto", "q_auto"];
  if (portrait) parts.push("c_fill", "ar_9:16");
  if (start) parts.push(`so_${start}`);
  if (width) parts.push(`w_${width}`);
  return transformVideo(src, parts.join(",")) ?? src;
}

// Ảnh tĩnh = khung hình tại giây `start` (mặc định khung đầu) cho bản điện thoại: hiện ngay khi video chưa tải xong,
// hoặc khi trình duyệt không cho tự phát (iPhone ở chế độ Nguồn điện thấp, prefers-reduced-motion). Không phải video
// Cloudinary thì không có.
export function cloudinaryVideoPosterUrl(src: string, width: number, start = 0): string | undefined {
  return transformVideo(src, `so_${start},q_auto,w_${width}`, ".jpg") ?? undefined;
}
