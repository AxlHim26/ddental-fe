import type { Metadata } from "next";
import { Suspense } from "react";
import PageLoader from "@/components/app/PageLoader";
import { articles } from "@/lib/newsData";
import { buildPageMetadata } from "@/lib/seo";
import NewsPage from "@/views/NewsPage";

export const metadata: Metadata = buildPageMetadata({
  title: "Tin Tức Nha Khoa",
  description:
    "Cập nhật tin tức nha khoa, sản phẩm mới, sự kiện và các bài viết chuyên môn từ HD Dental.",
  path: "/news",
  image: articles[0]?.image,
  keywords: ["tin tức nha khoa", "bài viết nha khoa", "HD Dental news"],
});

export default function NewsRoute() {
  return (
    <Suspense fallback={<PageLoader />}>
      <NewsPage />
    </Suspense>
  );
}
