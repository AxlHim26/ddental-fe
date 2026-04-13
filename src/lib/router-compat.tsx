"use client";

import React, { useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import {
  useParams as useNextParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

type ToObject = {
  pathname?: string;
  hash?: string;
  search?: string;
};

type To = string | ToObject;

type NavigateOptions = {
  replace?: boolean;
  state?: Record<string, unknown>;
};

type LinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  to: To;
  replace?: boolean;
  scroll?: boolean;
};

type NavLinkProps = Omit<LinkProps, "className"> & {
  end?: boolean;
  className?:
    | string
    | ((args: { isActive: boolean; isPending: boolean }) => string);
};

type SearchParamsLike = {
  forEach(
    callback: (value: string, key: string, parent: URLSearchParams) => void
  ): void;
  toString(): string;
};

const STATE_PREFIX = "__state_";

function encodeState(state?: Record<string, unknown>) {
  const params = new URLSearchParams();

  if (!state) return params;

  Object.entries(state).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    params.set(`${STATE_PREFIX}${key}`, String(value));
  });

  return params;
}

function normalizeHref(to: To, state?: Record<string, unknown>) {
  if (typeof to === "string") {
    if (!state) return to;
    const url = new URL(to, "http://localhost");
    const stateParams = encodeState(state);
    stateParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
    return `${url.pathname}${url.search}${url.hash}`;
  }

  const pathname = to.pathname || "/";
  const search =
    typeof to.search === "string"
      ? to.search.replace(/^\?/, "")
      : "";
  const params = new URLSearchParams(search);
  encodeState(state).forEach((value, key) => {
    params.set(key, value);
  });
  const query = params.toString();
  const hash = to.hash ? `#${to.hash.replace(/^#/, "")}` : "";
  return `${pathname}${query ? `?${query}` : ""}${hash}`;
}

function decodeState(searchParams: SearchParamsLike) {
  const state: Record<string, string | boolean> = {};

  searchParams.forEach((value, key) => {
    if (!key.startsWith(STATE_PREFIX)) return;
    const decodedKey = key.slice(STATE_PREFIX.length);
    if (value === "true") {
      state[decodedKey] = true;
      return;
    }
    if (value === "false") {
      state[decodedKey] = false;
      return;
    }
    state[decodedKey] = value;
  });

  return state;
}

function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:)/.test(href);
}

export function Link({
  to,
  replace,
  scroll,
  children,
  ...rest
}: LinkProps) {
  const href = normalizeHref(to);

  if (isExternalHref(href)) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} replace={replace} scroll={scroll} {...rest}>
      {children}
    </NextLink>
  );
}

export function NavLink({
  to,
  end = false,
  className,
  ...rest
}: NavLinkProps) {
  const pathname = usePathname() || "/";
  const href = normalizeHref(to);
  const hrefPath = href.split("#")[0]?.split("?")[0] || "/";
  const isActive = end
    ? pathname === hrefPath
    : pathname === hrefPath || pathname.startsWith(`${hrefPath}/`);

  const resolvedClassName =
    typeof className === "function"
      ? className({ isActive, isPending: false })
      : className;

  return <Link to={href} className={resolvedClassName} {...rest} />;
}

export function useNavigate() {
  const router = useRouter();

  return (to: To | number, options?: NavigateOptions) => {
    if (typeof to === "number") {
      if (to < 0) {
        router.back();
        return;
      }
      router.forward();
      return;
    }

    const href = normalizeHref(to, options?.state);

    if (options?.replace) {
      router.replace(href);
      return;
    }

    router.push(href);
  };
}

export function useLocation() {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const resolvedSearchParams = searchParams ?? new URLSearchParams();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const syncHash = () => {
      setHash(window.location.hash);
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname, resolvedSearchParams]);

  const search = resolvedSearchParams.toString();
  const state = useMemo(
    () => decodeState(resolvedSearchParams),
    [resolvedSearchParams]
  );

  return {
    pathname,
    hash,
    search: search ? `?${search}` : "",
    state,
  };
}

export function useParams<T extends Record<string, string | string[]>>() {
  return useNextParams<T>();
}

export function Navigate({
  to,
  replace = false,
}: {
  to: To;
  replace?: boolean;
}) {
  const router = useRouter();
  const href = normalizeHref(to);

  useEffect(() => {
    if (replace) {
      router.replace(href);
      return;
    }
    router.push(href);
  }, [href, replace, router]);

  return null;
}

export function BrowserRouter({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

export function Routes({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

export function Route() {
  return null;
}

export function Outlet() {
  return null;
}
