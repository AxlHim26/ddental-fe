import type { Metadata } from "next";
import { Suspense } from "react";
import PageLoader from "@/components/app/PageLoader";
import { buildPageMetadata } from "@/lib/seo";
import ServicesPage from "@/views/ServicesPage";

export const metadata: Metadata = buildPageMetadata({
  title: "Dịch Vụ Nha Khoa",
  description:
    "Dịch vụ thiết kế phòng khám, cung cấp thiết bị, đào tạo kỹ thuật, bảo trì và tư vấn giải pháp nha khoa từ HD Dental.",
  path: "/dich-vu",
});

export default function ServicesRoute() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ServicesPage />
    </Suspense>
  );
}
