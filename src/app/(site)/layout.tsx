"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import PageLoader from "@/components/app/PageLoader";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import { siteAuthSkipped, useSiteAuth } from "@/context/SiteAuthContext";
import { useAuth } from "@/lib/AuthContext";

function isPublicSitePath(pathname: string | null) {
  if (!pathname) return false;

  return (
    pathname === "/" ||
    pathname === "/ve-chung-toi" ||
    pathname === "/lien-he" ||
    pathname === "/dich-vu" ||
    pathname === "/news" ||
    pathname === "/shop" ||
    pathname.startsWith("/news/") ||
    pathname.startsWith("/shop/") ||
    pathname.startsWith("/product/")
  );
}

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready } = useSiteAuth();
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } =
    useAuth();
  const isPublicPath = isPublicSitePath(pathname);

  useEffect(() => {
    if (!isPublicPath && authError?.type === "auth_required") {
      navigateToLogin();
    }
  }, [authError, isPublicPath, navigateToLogin]);

  useEffect(() => {
    if (isPublicPath || !ready || siteAuthSkipped() || user) return;
    const nextPath = pathname || "/";
    router.replace(`/login?from=${encodeURIComponent(nextPath)}`);
  }, [isPublicPath, pathname, ready, router, user]);

  if (isLoadingAuth || isLoadingPublicSettings || !ready) {
    return <PageLoader />;
  }

  if (!isPublicPath && authError?.type === "user_not_registered") {
    return <UserNotRegisteredError />;
  }

  if (!isPublicPath && authError?.type === "auth_required") {
    return null;
  }

  if (isPublicPath || siteAuthSkipped() || user) {
    return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
  }

  return <PageLoader />;
}
