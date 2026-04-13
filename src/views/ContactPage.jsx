"use client";

import React, { useState } from "react";
import Navbar from "@/components/hd-dental/Navbar";
import Footer from "@/components/hd-dental/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Building2,
  CircleCheckBig,
} from "lucide-react";
import {
  COMPANY_ADDRESS,
  COMPANY_EMAIL,
  COMPANY_PHONE,
  companyTelHref,
} from "@/lib/seo";

const MAP_EMBED_QUERY = encodeURIComponent(
  `HD Dental, ${COMPANY_ADDRESS}, Vietnam`
);

const HERO_IMAGE =
  "https://media.base44.com/images/public/69cff7a985a4c7940dcab568/310517f13_generated_3f413930.png";

function formatPhoneDisplay(tel) {
  const d = tel.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("0")) {
    return `${d.slice(0, 4)} ${d.slice(4, 8)} ${d.slice(8)}`;
  }
  if (d.length === 10) {
    return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
  }
  return tel;
}

export default function ContactPage() {
  const [pending, setPending] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setPending(true);
    const form = e.currentTarget;
    window.setTimeout(() => {
      setPending(false);
      form.reset();
      toast({
        className: "border-primary/25 bg-background shadow-2xl shadow-primary/10",
        title: (
          <span className="flex items-center gap-2 text-primary">
            <CircleCheckBig className="h-4 w-4" />
            Thông báo
          </span>
        ),
        description: (
          <span className="whitespace-pre-line text-left leading-relaxed">
            {`Đã tiếp nhận thông tin
Bộ phận chăm sóc khách hàng sẽ sớm liên hệ với bạn
Xin vui lòng chờ trong giây lát`}
          </span>
        ),
      });
    }, 400);
  };

  const phoneDisplay = formatPhoneDisplay(COMPANY_PHONE);

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      <main className="pt-20 sm:pt-24">
        {/* Hero */}
        <section className="relative overflow-hidden bg-foreground">
          <div className="grid md:grid-cols-2 min-h-[280px] md:min-h-[320px] lg:min-h-[380px]">
            <div className="relative flex flex-col justify-center px-8 py-12 lg:px-16 lg:py-16 bg-gradient-to-br from-primary via-primary to-primary/85">
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 20%, white 0%, transparent 45%)",
                }}
              />
              <div className="relative z-10 max-w-xl">
                <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-tight">
                  Liên hệ
                </h1>
                <p className="mt-4 text-white/95 text-sm sm:text-base leading-relaxed">
                  Chào mừng bạn đến với công ty chúng tôi.
                  <br />
                  Liên hệ ngay để được hỗ trợ nhanh chóng và chuyên nghiệp.
                </p>
              </div>
            </div>
            <div className="relative min-h-[200px] md:min-h-0">
              <img
                src={HERO_IMAGE}
                alt="Đội ngũ HD Dental"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent md:from-primary/60" />
            </div>
          </div>
        </section>

        {/* Main */}
        <section className="bg-muted/40 py-14 lg:py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              {/* Thông tin + bản đồ */}
              <div className="rounded-2xl bg-background border border-border shadow-md shadow-foreground/5 p-6 sm:p-8">
                <h2 className="font-heading font-bold text-xl text-foreground">
                  Thông tin liên hệ
                </h2>
                <ul className="mt-6 space-y-4">
                  <li className="flex gap-3">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      {COMPANY_ADDRESS}
                    </span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <Phone className="w-5 h-5 text-primary shrink-0" />
                    <a
                      href={companyTelHref()}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {phoneDisplay}
                    </a>
                  </li>
                  <li className="flex gap-3 items-center">
                    <Mail className="w-5 h-5 text-primary shrink-0" />
                    <a
                      href={`mailto:${COMPANY_EMAIL}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors break-all"
                    >
                      {COMPANY_EMAIL}
                    </a>
                  </li>
                  <li className="flex gap-3">
                    <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      8:00 – 19:00 (Thứ 2 – Chủ nhật)
                    </span>
                  </li>
                </ul>

                <div className="mt-8 rounded-xl overflow-hidden border border-border aspect-[16/10] bg-muted">
                  <iframe
                    title="Bản đồ HD Dental"
                    src={`https://maps.google.com/maps?q=${MAP_EMBED_QUERY}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <ul className="mt-6 space-y-3 pt-6 border-t border-border">
                  <li className="flex gap-3">
                    <Building2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      {COMPANY_ADDRESS}
                    </span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <Phone className="w-5 h-5 text-primary shrink-0" />
                    <a
                      href={companyTelHref()}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {phoneDisplay}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Form + hotline */}
              <div className="flex flex-col gap-8">
                <div className="rounded-2xl bg-background border border-border shadow-md shadow-foreground/5 p-6 sm:p-8">
                  <h2 className="font-heading font-bold text-xl text-foreground">
                    Liên hệ với chúng tôi
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Điền form bên dưới, đội ngũ tư vấn sẽ phản hồi qua email hoặc
                    điện thoại theo thông tin bạn cung cấp.
                  </p>

                  <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Họ và tên</Label>
                      <Input
                        id="contact-name"
                        name="name"
                        required
                        autoComplete="name"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Email</Label>
                      <Input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="ban@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone">Số điện thoại</Label>
                      <Input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="0236 xxx xxx"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-message">Nội dung</Label>
                      <Textarea
                        id="contact-message"
                        name="message"
                        required
                        rows={4}
                        placeholder="Nhu cầu tư vấn, sản phẩm quan tâm..."
                        className="resize-y min-h-[120px]"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full rounded-xl h-11 font-semibold"
                      disabled={pending}
                    >
                      {pending ? "Đang gửi…" : "Gửi ngay"}
                    </Button>
                  </form>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-primary via-primary to-red-950 p-5 sm:p-6 text-white shadow-lg shadow-primary/25 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <Phone className="w-6 h-6" aria-hidden />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-white/90">
                      Hotline hỗ trợ ngay
                    </p>
                    <a
                      href={companyTelHref()}
                      className="mt-1 block font-heading font-bold text-xl sm:text-2xl tracking-tight hover:text-white/90 transition-colors"
                    >
                      {phoneDisplay}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
