import type { Metadata } from "next";
import { Suspense } from "react";
import PageLoader from "@/components/app/PageLoader";
import { categories } from "@/lib/productData";
import { buildPageMetadata } from "@/lib/seo";
import ShopCategory from "@/views/ShopCategory";

export const metadata: Metadata = buildPageMetadata({
  title: "Thiết Bị Nha Khoa",
  description:
    "Danh mục thiết bị nha khoa HD Dental gồm ghế nha khoa, đèn trám, thiết bị chẩn đoán hình ảnh và nhiều sản phẩm cho phòng khám.",
  path: "/shop",
  image: categories["ghe-nha-khoa"]?.banner,
  keywords: ["danh mục thiết bị nha khoa", "mua thiết bị nha khoa"],
});

export default function ShopRoute() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ShopCategory />
    </Suspense>
  );
}
