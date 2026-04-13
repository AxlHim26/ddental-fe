import type { Metadata } from "next";
import { Suspense } from "react";
import PageLoader from "@/components/app/PageLoader";
import { buildPageMetadata } from "@/lib/seo";
import CartPage from "@/views/CartPage";

export const metadata: Metadata = buildPageMetadata({
  title: "Giỏ Hàng",
  description: "Trang giỏ hàng HD Dental.",
  path: "/gio-hang",
  noIndex: true,
});

export default function CartRoute() {
  return (
    <Suspense fallback={<PageLoader />}>
      <CartPage />
    </Suspense>
  );
}
