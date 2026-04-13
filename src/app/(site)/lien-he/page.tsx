import type { Metadata } from "next";
import { Suspense } from "react";
import PageLoader from "@/components/app/PageLoader";
import { buildPageMetadata } from "@/lib/seo";
import ContactPage from "@/views/ContactPage";

export const metadata: Metadata = buildPageMetadata({
  title: "Liên Hệ",
  description:
    "Liên hệ HD Dental — địa chỉ, hotline, email và form gửi yêu cầu tư vấn thiết bị nha khoa.",
  path: "/lien-he",
});

export default function ContactRoute() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ContactPage />
    </Suspense>
  );
}
