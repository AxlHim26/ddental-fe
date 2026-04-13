import type { Metadata } from "next";
import { Suspense } from "react";
import PageLoader from "@/components/app/PageLoader";
import ProductDetail from "@/views/ProductDetail";
import { categories, products } from "@/lib/productData";
import {
  buildPageMetadata,
  getBreadcrumbJsonLd,
  getProductJsonLd,
} from "@/lib/seo";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((item) => item.id === id);

  if (!product) {
    return buildPageMetadata({
      title: "Sản Phẩm Không Tồn Tại",
      description: "Sản phẩm bạn tìm không tồn tại trên HD Dental.",
      path: `/product/${id}`,
      noIndex: true,
    });
  }

  const category = categories[product.category as keyof typeof categories];

  return buildPageMetadata({
    title: product.name,
    description: product.description,
    path: `/product/${product.id}`,
    image: product.images?.[0] || product.image,
    keywords: [product.name, product.brand, category?.name || "thiết bị nha khoa"],
  });
}

export default async function ProductDetailRoute({ params }: Props) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);
  const category = product
    ? categories[product.category as keyof typeof categories]
    : null;

  const productJsonLd = product ? getProductJsonLd(product) : null;
  const breadcrumbJsonLd =
    product && category
      ? getBreadcrumbJsonLd([
          { name: "Trang chủ", path: "/" },
          { name: "Sản phẩm", path: "/shop" },
          { name: category.name, path: `/shop/${category.slug}` },
          { name: product.name, path: `/product/${product.id}` },
        ])
      : null;

  return (
    <>
      {productJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      ) : null}
      {breadcrumbJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      ) : null}
      <Suspense fallback={<PageLoader />}>
        <ProductDetail />
      </Suspense>
    </>
  );
}
