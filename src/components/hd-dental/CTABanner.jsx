import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";
import { Reveal } from "@/lib/animations";
import { COMPANY_PHONE, companyTelHref } from "@/lib/seo";

export default function CTABanner() {
  return (
    <section className="bg-primary py-20 lg:py-24 overflow-hidden relative">
      {/* Decorative circles */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute -top-10 -right-10 w-64 h-64 rounded-full border-2 border-white/10"
          animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
        <motion.div className="absolute -bottom-14 left-20 w-48 h-48 rounded-full border border-white/10"
          animate={{ rotate: -360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} />
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-white/5"
          animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
      </div>

      <Reveal className="max-w-3xl mx-auto px-8 text-center relative z-10">
        <p className="font-body text-white/60 text-xs font-bold uppercase tracking-[0.3em] mb-5">
          Bắt đầu ngay hôm nay
        </p>
        <h2 className="font-heading font-black text-4xl lg:text-5xl text-white leading-tight mb-6">
          Sẵn sàng nâng tầm<br />phòng khám của bạn?
        </h2>
        <p className="font-body text-white/65 text-base mb-10 max-w-xl mx-auto">
          Liên hệ ngay để được tư vấn miễn phí và nhận báo giá phù hợp với nhu cầu.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href={companyTelHref()}
            className="inline-flex items-center gap-2.5 bg-white text-primary font-body font-bold text-sm px-8 py-4 rounded-full hover:bg-gray-100 transition-all shadow-xl hover:-translate-y-1 group">
            <Phone className="w-4 h-4" />
            {COMPANY_PHONE}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <Link to="/dich-vu"
            className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-body font-bold text-sm px-8 py-4 rounded-full hover:border-white hover:bg-white/10 transition-all">
            Xem dịch vụ
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
