import type { Metadata } from "next";
import { Suspense } from "react";
import PageLoader from "@/components/app/PageLoader";
import NewsArticlePage from "@/views/NewsArticlePage";
import { articles, getArticleBySlug } from "@/lib/newsData";
import {
  buildPageMetadata,
  getArticleJsonLd,
  getBreadcrumbJsonLd,
} from "@/lib/seo";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return buildPageMetadata({
      title: "Bài Viết Không Tồn Tại",
      description: "Bài viết bạn tìm không tồn tại trên HD Dental.",
      path: `/news/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/news/${article.slug}`,
    image: article.image,
    type: "article",
    keywords: [article.tag, "tin tức nha khoa", article.title],
  });
}

export default async function NewsArticleRoute({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  const articleJsonLd = article ? getArticleJsonLd(article) : null;
  const breadcrumbJsonLd = article
    ? getBreadcrumbJsonLd([
        { name: "Trang chủ", path: "/" },
        { name: "Tin tức", path: "/news" },
        { name: article.title, path: `/news/${article.slug}` },
      ])
    : null;

  return (
    <>
      {articleJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      ) : null}
      {breadcrumbJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      ) : null}
      <Suspense fallback={<PageLoader />}>
        <NewsArticlePage />
      </Suspense>
    </>
  );
}
