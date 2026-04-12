import type { Metadata, Viewport } from "next";
import "@/index.css";
import {
  GOOGLE_SITE_VERIFICATION,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_METADATA_BASE,
  SITE_NAME,
  getOrganizationJsonLd,
  getWebsiteJsonLd,
  toAbsoluteUrl,
} from "@/lib/seo";
import Providers from "./providers";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  metadataBase: SITE_METADATA_BASE,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: toAbsoluteUrl("/images/logo.png"),
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [toAbsoluteUrl("/images/logo.png")],
  },
  verification: {
    google: GOOGLE_SITE_VERIFICATION || undefined,
  },
  category: "medical",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e01a22",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = getOrganizationJsonLd();
  const websiteJsonLd = getWebsiteJsonLd();

  return (
    <html lang="vi">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        <Providers>{children}</Providers>
        <ChatWidget />
      </body>
    </html>
  );
}
