import type { Metadata } from "next";
import { Suspense } from "react";
import PageLoader from "@/components/app/PageLoader";
import ShopCategory from "@/views/ShopCategory";
import { categories } from "@/lib/productData";
import { buildPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return Object.values(categories).map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categories[slug as keyof typeof categories];

  if (!category) {
    return buildPageMetadata({
      title: "Danh Mục Không Tồn Tại",
      description: "Danh mục sản phẩm bạn tìm không tồn tại trên HD Dental.",
      path: `/shop/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: category.name,
    description: category.description,
    path: `/shop/${category.slug}`,
    image: category.banner,
    keywords: [category.name, "danh mục nha khoa", "HD Dental", "thiết bị nha khoa"],
  });
}

export default function ShopCategoryRoute() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ShopCategory />
    </Suspense>
  );
}
