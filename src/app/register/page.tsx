import type { Metadata } from "next";
import { Suspense } from "react";
import PageLoader from "@/components/app/PageLoader";
import { buildPageMetadata } from "@/lib/seo";
import RegisterPage from "@/views/RegisterPage";

export const metadata: Metadata = buildPageMetadata({
  title: "Đăng Ký",
  description: "Trang đăng ký tài khoản HD Dental.",
  path: "/register",
  noIndex: true,
});

export default function RegisterRoute() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RegisterPage />
    </Suspense>
  );
}
