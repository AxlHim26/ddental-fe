import type { Metadata } from "next";
import { Suspense } from "react";
import PageLoader from "@/components/app/PageLoader";
import { buildPageMetadata } from "@/lib/seo";
import LoginPage from "@/views/LoginPage";

export const metadata: Metadata = buildPageMetadata({
  title: "Đăng Nhập",
  description: "Trang đăng nhập tài khoản HD Dental.",
  path: "/login",
  noIndex: true,
});

export default function LoginRoute() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LoginPage />
    </Suspense>
  );
}
