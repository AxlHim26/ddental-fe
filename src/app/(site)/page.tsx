import type { Metadata } from "next";
import { Suspense } from "react";
import PageLoader from "@/components/app/PageLoader";
import { buildPageMetadata, SITE_DESCRIPTION } from "@/lib/seo";
import Home from "@/views/Home";

export const metadata: Metadata = buildPageMetadata({
  title: "Thiết Bị Nha Khoa và Giải Pháp Phòng Khám",
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function HomeRoute() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Home />
    </Suspense>
  );
}
