"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSiteAuth } from "@/context/SiteAuthContext";
import AuthHeroBackground from "@/components/hd-dental/AuthHeroBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const { register, user, ready, skipped } = useSiteAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (user || skipped) navigate("/", { replace: true });
  }, [ready, user, skipped, navigate]);

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
    if (!name.trim() || !email.trim() || !password) {
      setError("Vui lòng điền đủ các trường.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu tối thiểu 6 ký tự.");
      return;
    }
    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setLoading(true);
    try {
      const res = register(name, email, password);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      navigate("/login", {
        replace: true,
        state: { registered: true, email: email.trim() },
      });
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
          <h1 className="font-heading font-bold text-2xl text-white drop-shadow-sm">Đăng ký</h1>
          <p className="font-body text-sm text-white/75 mt-2">Tạo tài khoản để truy cập website.</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-background rounded-2xl border border-border shadow-xl p-8 space-y-5"
        >
          {error && (
            <p className="text-sm text-destructive font-body bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
          )}
          <div className="space-y-2">
            <Label htmlFor="reg-name">Họ và tên</Label>
            <Input
              id="reg-name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-email">Địa chỉ email</Label>
            <Input
              id="reg-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tenban@email.com"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-password">Mật khẩu</Label>
            <Input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-confirm">Xác nhận mật khẩu</Label>
            <Input
              id="reg-confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              className="h-11"
            />
          </div>
          <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
            {loading ? "Đang xử lý…" : "Đăng ký"}
          </Button>
          <p className="text-center font-body text-xs text-muted-foreground leading-relaxed">
            Dữ liệu lưu trên trình duyệt của bạn (demo). Không dùng mật khẩu thật quan trọng.
          </p>
          <p className="text-center font-body text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
