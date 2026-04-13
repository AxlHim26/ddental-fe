import type { Metadata } from "next";
import { Suspense } from "react";
import PageLoader from "@/components/app/PageLoader";
import { buildPageMetadata } from "@/lib/seo";
import AboutPage from "@/views/AboutPage";

export const metadata: Metadata = buildPageMetadata({
  title: "Về Chúng Tôi",
  description:
    "Tìm hiểu về HD Dental, đội ngũ đồng hành và định hướng cung cấp giải pháp nha khoa cho phòng khám tại Việt Nam.",
  path: "/ve-chung-toi",
});

export default function AboutRoute() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AboutPage />
    </Suspense>
  );
}
