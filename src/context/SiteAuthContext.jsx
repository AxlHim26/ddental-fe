"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  clearSession,
  loginUser,
  readSession,
  registerUser,
  writeSession,
} from "@/lib/siteAuthStorage";

const SiteAuthContext = createContext(null);

export function siteAuthSkipped() {
  return process.env.NEXT_PUBLIC_SKIP_SITE_AUTH === "true";
}

export function SiteAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (siteAuthSkipped()) {
      setUser({ email: "dev@local", name: "Dev" });
      setReady(true);
      return;
    }
    setUser(readSession());
    setReady(true);
  }, []);

  const login = useCallback((email, password) => {
    const res = loginUser({ email, password });
    if (!res.ok) return res;
    writeSession(res.user);
    setUser(res.user);
    return { ok: true };
  }, []);

  /** Chỉ tạo tài khoản trong storage — không ghi phiên; user phải đăng nhập sau. */
  const register = useCallback((name, email, password) => {
    const res = registerUser({ name, email, password });
    if (!res.ok) return res;
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    window.location.href = "/";
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, register, logout, skipped: siteAuthSkipped() }),
    [user, ready, login, register, logout]
  );

  return <SiteAuthContext.Provider value={value}>{children}</SiteAuthContext.Provider>;
}

export function useSiteAuth() {
  const ctx = useContext(SiteAuthContext);
  if (!ctx) throw new Error("useSiteAuth must be used within SiteAuthProvider");
  return ctx;
}
