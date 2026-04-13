"use client";

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSiteAuth } from "@/context/SiteAuthContext";
import AuthHeroBackground from "@/components/hd-dental/AuthHeroBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { login, user, ready, skipped } = useSiteAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(() => location.state?.email || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const justRegistered = Boolean(location.state?.registered);
  const nextPath =
    location.state?.from ||
    new URLSearchParams(location.search).get("from") ||
    "/";

  useEffect(() => {
    if (!ready) return;
    if (user || skipped) navigate(nextPath, { replace: true });
  }, [nextPath, ready, user, skipped, navigate]);

  if (!ready) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <AuthHeroBackground />
        <div className="relative z-10 w-8 h-8 border-4 border-white/25 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Vui lòng nhập đủ thông tin.");
      return;
    }
    setLoading(true);
    try {
      const res = login(email, password);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      navigate(nextPath, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <AuthHeroBackground />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <img
              src="/images/logo.png"
              alt="Logo HD Dental"
              className="h-16 md:h-20 lg:h-24 w-auto object-contain origin-center scale-125 md:scale-150 transition-transform"
            />
          </div>
          <h1 className="font-heading font-bold text-2xl text-white drop-shadow-sm">Đăng nhập</h1>
          <p className="font-body text-sm text-white/75 mt-2">Vui lòng đăng nhập để vào website.</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-background rounded-2xl border border-border shadow-xl p-8 space-y-5"
        >
          {justRegistered && (
            <p className="text-sm text-emerald-800 font-body bg-emerald-50 border border-emerald-200/80 rounded-lg px-3 py-2">
              Đăng ký thành công. Vui lòng đăng nhập để vào trang sản phẩm.
            </p>
          )}
          {error && (
            <p className="text-sm text-destructive font-body bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
          )}
          <div className="space-y-2">
            <Label htmlFor="login-email">Địa chỉ email</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tenban@email.com"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Mật khẩu</Label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11"
            />
          </div>
          <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
            {loading ? "Đang xử lý…" : "Đăng nhập"}
          </Button>
          <p className="text-center font-body text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Đăng ký
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
