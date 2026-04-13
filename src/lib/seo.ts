import type { Metadata } from "next";
import { SITE_NAME } from "@/config/branding";

export { SITE_NAME };

const FALLBACK_SITE_URL = "http://localhost:3000";

export const SITE_DESCRIPTION =
  "HD Dental cung cấp thiết bị nha khoa, giải pháp thiết kế phòng khám, bảo trì và tư vấn vận hành cho phòng khám nha khoa tại Việt Nam.";

export const SITE_KEYWORDS = [
  "HD Dental",
  "thiết bị nha khoa",
  "ghế nha khoa",
  "đèn trám",
  "thiết bị chẩn đoán hình ảnh",
  "vật tư nha khoa",
  "thiết kế phòng khám nha khoa",
  "bảo trì thiết bị nha khoa",
  "tin tức nha khoa",
];

/** Hiển thị (có khoảng trắng); `tel:` dùng `COMPANY_PHONE.replace(/\D/g, "")` */
export const COMPANY_PHONE = "0236 3609 444";
export const COMPANY_EMAIL = "hddental@gmail.com";
export const COMPANY_ADDRESS =
  "370 Nguyễn Tri Phương, Vĩnh Trung, Hải Châu, Đà Nẵng";
export function companyTelHref(): string {
  return `tel:${COMPANY_PHONE.replace(/\D/g, "")}`;
}

function normalizeUrl(rawUrl?: string | null) {
  const value = rawUrl?.trim();
  if (!value) return null;

  const withProtocol = /^https?:\/\//.test(value) ? value : `https://${value}`;

  try {
    return new URL(withProtocol).toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

function resolveSiteUrl() {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeUrl(candidate);
    if (normalized) return normalized;
  }

  return FALLBACK_SITE_URL;
}

export const SITE_URL = resolveSiteUrl();
export const SITE_METADATA_BASE = new URL(`${SITE_URL}/`);
export const GOOGLE_SITE_VERIFICATION =
  process.env.GOOGLE_SITE_VERIFICATION?.trim() || "";

function uniq(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function toAbsoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, SITE_METADATA_BASE).toString();
}

type PageMetadataOptions = {
  title?: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
};

export function buildPageMetadata({
  title,
  description,
  path,
  image = "/images/logo.png",
  keywords = [],
  noIndex = false,
  type = "website",
}: PageMetadataOptions): Metadata {
  const metadataTitle = title || SITE_NAME;
  const socialTitle =
    metadataTitle === SITE_NAME ? SITE_NAME : `${metadataTitle} | ${SITE_NAME}`;
  const metadataKeywords = uniq([...SITE_KEYWORDS, ...keywords]);

  return {
    title: metadataTitle,
    description,
    keywords: metadataKeywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: socialTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "vi_VN",
      type,
      images: [
        {
          url: toAbsoluteUrl(image),
          width: 1200,
          height: 630,
          alt: socialTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [toAbsoluteUrl(image)],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export function getOrganizationJsonLd() {
  const phoneDigits = COMPANY_PHONE.replace(/\D/g, "");
  const telephone =
    phoneDigits.startsWith("0") && phoneDigits.length >= 9
      ? `+84${phoneDigits.slice(1)}`
      : `+84${phoneDigits}`;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: toAbsoluteUrl("/images/logo.png"),
    email: COMPANY_EMAIL,
    telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "370 Nguyen Tri Phuong, Vinh Trung",
      addressLocality: "Hai Chau, Da Nang",
      addressCountry: "VN",
    },
  };
}

export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "vi-VN",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/shop?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

type BreadcrumbItem = {
  name: string;
  path: string;
};

export function getBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}

type ArticleLike = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
};

export function getArticleJsonLd(article: ArticleLike) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: [toAbsoluteUrl(article.image)],
    datePublished: article.date,
    dateModified: article.date,
    mainEntityOfPage: toAbsoluteUrl(`/news/${article.slug}`),
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: toAbsoluteUrl("/images/logo.png"),
      },
    },
  };
}

type ProductLike = {
  id: string;
  name: string;
  description: string;
  brand: string;
  image: string;
  images?: string[];
  price: number;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
};

export function getProductJsonLd(product: ProductLike) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.id,
    image: uniq([product.image, ...(product.images || [])]).map((image) =>
      toAbsoluteUrl(image)
    ),
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      url: toAbsoluteUrl(`/product/${product.id}`),
      priceCurrency: "VND",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
    aggregateRating:
      product.rating && product.reviews
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviews,
          }
        : undefined,
  };
}
