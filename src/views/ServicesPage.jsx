"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Phone,
  CheckCircle,
  ChevronDown,
  Palette,
  Monitor,
  TrendingUp,
  GraduationCap,
  Star,
  Award,
  Users,
  Package,
} from "lucide-react";
import Navbar from "../components/hd-dental/Navbar";
import Footer from "../components/hd-dental/Footer";
import { COMPANY_PHONE, companyTelHref } from "@/lib/seo";

import dynamic from "next/dynamic";
const ClinicScene = dynamic(
  () => import("../components/Clinic3D/ClinicScene"),
  { ssr: false },
);

/* ──────────────── EASING & VARIANTS ──────────────── */
const E = [0.22, 1, 0.36, 1];

/* ──────────────── COUNTER HOOK ──────────────── */
function useCounter(target, duration = 1.8, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ──────────────── ANIMATED NUMBER ──────────────── */
function AnimatedNumber({ value, suffix = "", prefix = "", className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const num = useCounter(value, 1.8, inView);
  return (
    <span ref={ref} className={className}>
      {prefix}
      {num.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ──────────────── SCROLL REVEAL WRAPPERS ──────────────── */
function Reveal({ children, y = 50, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: E }}
    >
      {children}
    </motion.div>
  );
}

function RevealX({ children, x = -60, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: E }}
    >
      {children}
    </motion.div>
  );
}

function ScaleIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: E }}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────── CLIP REVEAL IMAGE ──────────────── */
function ClipRevealImage({ src, alt, className = "", delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      animate={inView ? { clipPath: "inset(0 0% 0 0)" } : {}}
      transition={{ duration: 0.9, delay, ease: E }}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════ */
export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white font-body text-gray-900 overflow-x-hidden">
      <Navbar />
      <HeroBanner />
      <StatsBar />
      <ServiceClinicDesign />
      <ClinicScene />
      <ServiceEquipment />
      <ServiceMarketing />
      <ServiceTraining />
      <WhyChooseUs />
      <CTABanner />
      <ServicesFooterSection />
      <Footer />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════ */
function HeroBanner() {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden bg-gray-950 pt-20">
      {/* BG image */}
      <div className="absolute inset-0">
        <img
          src="https://media.base44.com/images/public/69cff7a985a4c7940dcab568/310517f13_generated_3f413930.png"
          alt=""
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-950/40 to-gray-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 to-transparent" />
      </div>

      {/* Floating red circles deco */}
      <motion.div
        className="absolute top-32 right-20 w-72 h-72 rounded-full border border-primary/15 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-44 right-32 w-44 h-44 rounded-full border border-primary/10 pointer-events-none"
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 w-full pb-24">
        <div className="max-w-2xl">
          <Reveal delay={0.1}>
            <div className="inline-flex items-center gap-2 border border-primary/40 text-primary text-xs font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Dịch vụ toàn diện
            </div>
          </Reveal>

          <div className="overflow-hidden mb-3">
            <motion.h1
              className="font-heading font-black text-6xl lg:text-7xl xl:text-8xl text-white leading-none"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: E }}
            >
              DỊCH VỤ
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-3">
            <motion.h1
              className="font-heading font-black text-6xl lg:text-7xl xl:text-8xl text-primary leading-none"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.32, ease: E }}
            >
              HD DENTAL
            </motion.h1>
          </div>

          <Reveal delay={0.5}>
            <p className="font-body text-gray-400 text-lg leading-relaxed mt-6 mb-10 max-w-lg">
              Hệ sinh thái dịch vụ nha khoa toàn diện — từ thiết kế không gian,
              trang bị công nghệ đến xây dựng thương hiệu và phát triển nhân
              lực.
            </p>
          </Reveal>

          <Reveal delay={0.6}>
            <div className="flex flex-wrap gap-4">
              <a
                href={companyTelHref()}
                className="inline-flex items-center gap-2.5 bg-primary text-white font-body font-bold text-sm px-8 py-4 rounded-full hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 hover:-translate-y-1 group"
              >
                ĐĂNG KÝ TƯ VẤN NGAY
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#service-design"
                className="inline-flex items-center gap-2 text-white/50 hover:text-white font-body text-sm transition-colors"
              >
                Khám phá dịch vụ
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      {/* SERVICES watermark */}
      <div className="absolute bottom-0 right-0 pointer-events-none overflow-hidden">
        <motion.p
          className="font-heading font-black text-[10rem] lg:text-[16rem] leading-none text-white/[0.03] whitespace-nowrap"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: E }}
        >
          DỊCH VỤ
        </motion.p>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   STATS BAR
══════════════════════════════════════════════════════ */
function StatsBar() {
  const stats = [
    { value: 5000, suffix: "+", label: "Khách hàng tin tưởng", icon: Users },
    { value: 200, suffix: "+", label: "Sản phẩm chính hãng", icon: Package },
    { value: 14, suffix: "+", label: "Năm kinh nghiệm", icon: Award },
    { value: 98, suffix: "%", label: "Khách hàng hài lòng", icon: Star },
  ];

  return (
    <section className="bg-primary py-0">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal
                key={s.label}
                delay={i * 0.1}
                className={`px-8 py-8 flex items-center gap-4 ${i < stats.length - 1 ? "border-r border-white/20" : ""} ${i >= 2 ? "border-t lg:border-t-0 border-white/20" : ""}`}
              >
                <Icon className="w-8 h-8 text-white/40 flex-shrink-0" />
                <div>
                  <p className="font-heading font-black text-3xl text-white leading-none">
                    <AnimatedNumber value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="font-body text-white/70 text-xs mt-1">
                    {s.label}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SERVICE 01 – THIẾT KẾ PHÒNG KHÁM
══════════════════════════════════════════════════════ */
function ServiceClinicDesign() {
  const features = [
    "Tư vấn quy hoạch mặt bằng 2D/3D",
    "Thiết kế nội thất & hệ thống ánh sáng",
    "Thi công & giám sát hoàn thiện",
    "Bảo hành công trình 24 tháng",
  ];
  return (
    <section id="service-design" className="relative overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-[480px]">
        {/* LEFT: video */}
        <div className="relative overflow-hidden min-h-[280px] bg-black">
          <video
            src="/videos/final.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
          {/* Number badge floating */}
          <motion.div
            className="absolute top-8 left-8 z-10"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
          >
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/50">
              <span className="font-heading font-black text-white text-xl">
                01
              </span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: content */}
        <div className="flex flex-col justify-center px-10 lg:px-16 py-20 bg-white">
          <RevealX x={60}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <span className="font-body text-xs text-primary font-bold uppercase tracking-[0.25em]">
                Thiết kế phòng khám
              </span>
            </div>
            <h2 className="font-heading font-black text-4xl lg:text-5xl text-gray-900 leading-tight mb-2">
              THIẾT KẾ
            </h2>
            <h2 className="font-heading font-black text-4xl lg:text-5xl text-primary leading-tight mb-5">
              PHÒNG KHÁM
            </h2>
            <div className="w-12 h-1 bg-primary rounded-full mb-6" />
            <p className="font-body font-semibold text-gray-800 text-base mb-3 leading-snug">
              Sự am hiểu, chuyên sâu của đội ngũ chuyên gia tại HD Dental
            </p>
            <p className="font-body text-gray-500 text-sm leading-relaxed mb-8">
              Cùng HD Dental lên ý tưởng theo mong muốn. Mang lại cho phòng khám
              không gian sang trọng, tiện nghi — nơi bệnh nhân cảm thấy an tâm
              và tin tưởng tuyệt đối.
            </p>
            <ul className="space-y-3 mb-9">
              {features.map((f, i) => (
                <motion.li
                  key={f}
                  className="flex items-center gap-3 font-body text-sm text-gray-600"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                >
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-primary" />
                  </div>
                  {f}
                </motion.li>
              ))}
            </ul>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-primary text-white font-body font-bold text-sm px-7 py-3.5 rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5 group w-fit"
            >
              XEM SẢN PHẨM{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </RevealX>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SERVICE 02 – THIẾT BỊ
══════════════════════════════════════════════════════ */
function ServiceEquipment() {
  const packages = [
    { name: "Gói thiết bị cơ bản", desc: "Dành cho phòng khám mới thành lập" },
    {
      name: "Gói thiết bị cao cấp",
      desc: "Chuẩn quốc tế, thương hiệu hàng đầu",
    },
    { name: "Gói bảo trì & nâng cấp", desc: "Dịch vụ hậu mãi trọn gói" },
  ];
  return (
    <section id="service-equipment" className="bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <RevealX x={-70}>
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-body text-xs text-primary font-bold uppercase tracking-[0.25em] block">
                    Thiết bị
                  </span>
                  <span className="font-heading font-black text-3xl text-white/10 leading-none">
                    02
                  </span>
                </div>
              </div>
              <h2 className="font-heading font-black text-4xl lg:text-5xl text-white leading-tight mb-2">
                CUNG CẤP GÓI
              </h2>
              <h2 className="font-heading font-black text-4xl lg:text-5xl text-primary leading-tight mb-6">
                SẢN PHẨM & THIẾT BỊ
              </h2>
              <div className="w-12 h-1 bg-primary rounded-full mb-7" />
              <p className="font-body text-gray-400 text-sm leading-relaxed mb-10">
                Phân phối độc quyền các thương hiệu nha khoa hàng đầu thế giới.
                HD Dental cam kết thiết bị chính hãng, bảo hành dài hạn và kỹ
                thuật viên túc trực.
              </p>
              <div className="space-y-4 mb-10">
                {packages.map((p, i) => (
                  <motion.div
                    key={p.name}
                    className="flex items-start gap-4 p-4 rounded-xl border border-white/8 hover:border-primary/40 hover:bg-white/5 transition-all cursor-default group"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0 group-hover:scale-150 transition-transform" />
                    <div>
                      <p className="font-body font-bold text-white text-sm">
                        {p.name}
                      </p>
                      <p className="font-body text-gray-500 text-xs mt-0.5">
                        {p.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-primary text-white font-body font-bold text-sm px-7 py-3.5 rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 hover:-translate-y-0.5 group w-fit"
              >
                XEM SẢN PHẨM{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </RevealX>

          {/* RIGHT: Image with tilt on hover */}
          <RevealX x={70} delay={0.15}>
            <motion.div
              className="relative"
              whileHover={{ rotateY: -4, rotateX: 2 }}
              transition={{ duration: 0.4 }}
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/60 ring-1 ring-white/10">
                <img
                  src="https://media.base44.com/images/public/69cff7a985a4c7940dcab568/a9e78f522_generated_image.png"
                  alt="Thiết bị nha khoa"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
              {/* Floating badge */}
              <motion.div
                className="absolute -bottom-5 -left-5 bg-primary rounded-2xl px-6 py-4 shadow-xl shadow-primary/40"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <p className="font-heading font-black text-white text-2xl">
                  <AnimatedNumber value={200} suffix="+" />
                </p>
                <p className="font-body text-white/80 text-xs">Sản phẩm</p>
              </motion.div>
              <motion.div
                className="absolute -top-5 -right-5 bg-white rounded-2xl px-6 py-4 shadow-xl"
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <p className="font-heading font-black text-primary text-2xl">
                  <AnimatedNumber value={50} suffix="+" />
                </p>
                <p className="font-body text-gray-500 text-xs">Thương hiệu</p>
              </motion.div>
              {/* Number */}
              <div className="absolute top-5 right-5 w-12 h-12 rounded-xl bg-black/50 backdrop-blur flex items-center justify-center">
                <span className="font-heading font-black text-white">02</span>
              </div>
            </motion.div>
          </RevealX>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SERVICE 03 – MARKETING
══════════════════════════════════════════════════════ */
function ServiceMarketing() {
  const pkgs = [
    {
      label: "Gói Marketing Cơ Bản",
      img: "/images/packages/mar cơ bản.png",
    },
    {
      label: "Gói Marketing Toàn Diện",
      img: "/images/packages/mar toàn diện.png",
    },
    {
      label: "Gói Marketing Cao Cấp",
      img: "/images/packages/mar cao cấp.png",
    },
  ];

  const [hoveredPkg, setHoveredPkg] = useState(null);

  const activeImg =
    hoveredPkg !== null
      ? pkgs[hoveredPkg].img
      : "https://media.base44.com/images/public/69cff7a985a4c7940dcab568/9d44d492a_generated_28f20030.png";

  return (
    <section
      id="service-marketing"
      className="bg-gray-50 overflow-hidden py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        {/* Top label */}
        <Reveal className="flex items-center gap-4 mb-14">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <span className="font-body text-xs text-primary font-bold uppercase tracking-[0.3em]">
              Tiếp thị — 03
            </span>
            <div className="w-full h-px bg-gray-200 mt-1.5" />
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* LEFT col */}
          <div className="lg:col-span-3">
            <RevealX x={-60}>
              <h2 className="font-heading font-black text-5xl lg:text-6xl text-gray-900 leading-none mb-2">
                TIẾP THỊ
              </h2>
              <h2 className="font-heading font-black text-5xl lg:text-6xl text-primary leading-none mb-8">
                NHA KHOA
              </h2>
              <div className="w-16 h-1.5 bg-primary rounded-full mb-7" />
              <p className="font-body text-gray-500 text-base leading-relaxed mb-10 max-w-lg">
                Xây dựng thương hiệu phòng khám bài bản — từ bộ nhận diện,
                website, mạng xã hội đến chiến dịch quảng cáo hiệu quả. HD
                Dental đồng hành trọn vẹn trên hành trình phát triển thương hiệu
                của bạn.
              </p>
            </RevealX>

            <div className="grid sm:grid-cols-3 gap-4 mb-10 items-stretch">
              {pkgs.map((p, i) => (
                <ScaleIn
                  key={p.label}
                  delay={0.1 + i * 0.12}
                  className="h-full"
                >
                  <div
                    className={`group relative overflow-hidden bg-white rounded-2xl border p-5 transition-all cursor-default h-full ${
                      hoveredPkg === i
                        ? "border-primary shadow-lg shadow-primary/10"
                        : "border-gray-200 hover:border-primary hover:shadow-lg hover:shadow-primary/10"
                    }`}
                    onMouseEnter={() => setHoveredPkg(i)}
                    onMouseLeave={() => setHoveredPkg(null)}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 transition-colors ${hoveredPkg === i ? "bg-primary/15" : "bg-primary/8 group-hover:bg-primary/15"}`}
                    >
                      <span className="font-heading font-black text-primary text-xs">
                        0{i + 1}
                      </span>
                    </div>
                    <p className="font-body font-bold text-sm text-gray-800 leading-snug">
                      {p.label}
                    </p>
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-primary"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.15, duration: 0.6 }}
                    />
                  </div>
                </ScaleIn>
              ))}
            </div>

            <Reveal delay={0.3}>
              <a
                href={companyTelHref()}
                className="inline-flex items-center gap-2 bg-primary text-white font-body font-bold text-sm px-7 py-3.5 rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5 group w-fit"
              >
                LIÊN HỆ TƯ VẤN{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Reveal>
          </div>

          {/* RIGHT col: image changes on hover */}
          <div className="lg:col-span-2">
            <RevealX x={60} delay={0.1}>
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-xl shadow-gray-200 ring-1 ring-gray-100">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImg}
                      src={activeImg}
                      alt="Marketing nha khoa"
                      className="w-full h-[480px] object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </AnimatePresence>
                </div>
                <div className="absolute top-5 right-5 w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
                  <span className="font-heading font-black text-white">03</span>
                </div>
                <motion.div
                  className="absolute -bottom-5 left-5 bg-gray-900 text-white rounded-2xl px-5 py-4 shadow-xl"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <p className="font-heading font-black text-xl text-primary">
                    <AnimatedNumber value={3} suffix="x" />
                  </p>
                  <p className="font-body text-gray-400 text-xs">
                    Tăng trưởng trung bình
                  </p>
                </motion.div>
              </div>
            </RevealX>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   SERVICE 04 – ĐÀO TẠO
══════════════════════════════════════════════════════ */
function ServiceTraining() {
  const items = [
    "Đào tạo sử dụng thiết bị nha khoa",
    // "Dịch vụ tuyển dụng & đào tạo nhân sự",
    // "HD Academy — Chứng chỉ quốc tế",
    "Hội thảo & workshop thường kỳ",
  ];
  return (
    <section id="service-training" className="overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-[680px]">
        {/* LEFT dark panel */}
        <div className="flex flex-col justify-center px-10 lg:px-16 py-24 bg-gray-950 order-2 lg:order-1">
          <RevealX x={-60}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-body text-xs text-primary font-bold uppercase tracking-[0.25em] block">
                  Đào tạo — 04
                </span>
              </div>
            </div>
            <h2 className="font-heading font-black text-4xl lg:text-5xl text-white leading-tight mb-2">
              ĐÀO TẠO VÀ
            </h2>
            <h2 className="font-heading font-black text-4xl lg:text-5xl text-primary leading-tight mb-6">
              HỖ TRỢ NHÂN SỰ
            </h2>
            <div className="w-12 h-1 bg-primary rounded-full mb-7" />
            <p className="font-body text-gray-400 text-sm leading-relaxed mb-10">
              HD Academy — trung tâm đào tạo nha khoa với đội ngũ giảng viên
              trong và ngoài nước. Chương trình chuẩn quốc tế, giúp nha sĩ phát
              triển toàn diện và bền vững.
            </p>
            <ul className="space-y-4 mb-10">
              {items.map((item, i) => (
                <motion.li
                  key={item}
                  className="flex items-center gap-4 font-body text-sm text-gray-300"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.45 }}
                >
                  <span className="font-heading font-black text-primary text-xs w-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="w-px h-4 bg-white/15" />
                  {item}
                </motion.li>
              ))}
            </ul>
            <a
              href={companyTelHref()}
              className="inline-flex items-center gap-2 bg-primary text-white font-body font-bold text-sm px-7 py-3.5 rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 hover:-translate-y-0.5 group w-fit"
            >
              LIÊN HỆ TƯ VẤN{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </RevealX>
        </div>

        {/* RIGHT image */}
        <div className="relative min-h-[400px] order-1 lg:order-2">
          <ClipRevealImage
            src="https://media.base44.com/images/public/69cff7a985a4c7940dcab568/8174e0e9a_generated_image.png"
            alt="Đào tạo nhân sự"
            className="absolute inset-0 w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-950/30" />
          <motion.div
            className="absolute top-8 right-8 z-10"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, type: "spring" }}
          >
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/50">
              <span className="font-heading font-black text-white text-xl">
                04
              </span>
            </div>
          </motion.div>
          {/* Stats */}
          <div className="absolute bottom-8 left-8 right-8 grid grid-cols-3 gap-3 z-10">
            {[
              { v: 120, s: "+", l: "Khóa học" },
              { v: 3000, s: "+", l: "Học viên" },
              { v: 40, s: "+", l: "Giảng viên" },
            ].map((s, i) => (
              <ScaleIn key={s.l} delay={0.3 + i * 0.1}>
                <div className="bg-black/60 backdrop-blur-md rounded-xl px-3 py-3 text-center border border-white/10">
                  <p className="font-heading font-black text-white text-lg">
                    <AnimatedNumber value={s.v} suffix={s.s} />
                  </p>
                  <p className="font-body text-white/50 text-[10px]">{s.l}</p>
                </div>
              </ScaleIn>
            ))}
          </div>
        </div>
      </div>

      {/* 3 value pillars */}
      <div className="grid grid-cols-3 bg-primary">
        {["UY TÍN", "CHẤT LƯỢNG", "CHUYÊN NGHIỆP"].map((v, i) => (
          <motion.div
            key={v}
            className={`py-7 text-center font-heading font-black text-xl lg:text-2xl text-white tracking-wider ${i < 2 ? "border-r border-white/20" : ""} hover:bg-white/10 transition-colors cursor-default`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
          >
            {v}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   WHY CHOOSE US — Bento grid layout
══════════════════════════════════════════════════════ */
function WhyChooseUs() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <Reveal className="mb-14">
          <span className="font-body text-xs text-primary font-bold uppercase tracking-[0.3em] mb-3 block">
            Lý do chọn chúng tôi
          </span>
          <h2 className="font-heading font-black text-4xl lg:text-5xl text-gray-900 leading-tight">
            Tại sao chọn <span className="text-primary">HD Dental?</span>
          </h2>
        </Reveal>

        {/* Bento grid */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Large card – image + stat */}
          <ScaleIn className="lg:col-span-1 lg:row-span-2">
            <div className="relative rounded-3xl overflow-hidden h-full min-h-[400px] group">
              <img
                src="https://media.base44.com/images/public/69cff7a985a4c7940dcab568/3aab62510_generated_image.png"
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-heading font-black text-5xl text-white mb-1">
                  <AnimatedNumber value={14} suffix="+" />
                </p>
                <p className="font-body text-white/70 text-sm">
                  Năm kinh nghiệm trong ngành nha khoa
                </p>
              </div>
            </div>
          </ScaleIn>

          {/* Text card 1 */}
          <Reveal delay={0.1} className="lg:col-span-2">
            <div className="bg-gray-50 rounded-3xl p-8 h-full border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all">
              <span className="font-body text-xs text-primary font-bold uppercase tracking-[0.2em] mb-3 block">
                Thiết bị
              </span>
              <h3 className="font-heading font-black text-2xl text-gray-900 mb-4 leading-tight">
                THIẾT BỊ PHÒNG KHÁM
                <br />
                <span className="text-primary">CHUẨN QUỐC TẾ</span>
              </h3>
              <p className="font-body text-gray-500 text-sm leading-relaxed">
                Sở hữu hệ thống trang thiết bị nha khoa nhập khẩu chính hãng từ
                các nền y tế hàng đầu thế giới. Mỗi công nghệ đều được tuyển
                chọn kỹ lưỡng, đảm bảo quy trình điều trị chuẩn xác và an toàn.
              </p>
            </div>
          </Reveal>

          {/* Image card */}
          <ScaleIn delay={0.15}>
            <div className="relative rounded-3xl overflow-hidden h-[240px] group">
              <img
                src="https://media.base44.com/images/public/69cff7a985a4c7940dcab568/6db23f10e_generated_image.png"
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-primary/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-heading font-black text-white text-4xl opacity-30">
                  ISO
                </p>
              </div>
            </div>
          </ScaleIn>

          {/* Text card 2 */}
          <Reveal delay={0.2}>
            <div className="bg-primary rounded-3xl p-8 h-full hover:bg-primary/90 transition-colors">
              <span className="font-body text-xs text-white/60 font-bold uppercase tracking-[0.2em] mb-3 block">
                Chuyên gia
              </span>
              <h3 className="font-heading font-black text-2xl text-white mb-4 leading-tight">
                ĐỘI NGŨ TƯ VẤN
                <br />
                GIÀU KINH NGHIỆM
              </h3>
              <p className="font-body text-white/75 text-sm leading-relaxed">
                Với bề dày kinh nghiệm thực chiến, đội ngũ chuyên gia cam kết
                mang lại lộ trình phát triển đột phá. Không chỉ định hướng —
                chúng tôi đồng hành thực thi.
              </p>
            </div>
          </Reveal>

          {/* Stats mini cards row */}
          <Reveal delay={0.25} className="lg:col-span-3">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { v: 5000, s: "+", l: "Khách hàng tin tưởng" },
                { v: 200, s: "+", l: "Phòng khám đã thiết kế" },
                { v: 15, s: "+", l: "Tỉnh thành phủ sóng" },
                { v: 98, s: "%", l: "Tỷ lệ hài lòng" },
              ].map((s, i) => (
                <motion.div
                  key={s.l}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <p className="font-heading font-black text-3xl text-primary mb-1">
                    <AnimatedNumber value={s.v} suffix={s.s} />
                  </p>
                  <p className="font-body text-gray-500 text-xs">{s.l}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   CTA BANNER
══════════════════════════════════════════════════════ */
function CTABanner() {
  return (
    <section className="bg-primary py-20 lg:py-24 overflow-hidden relative">
      {/* Deco */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-10 -right-10 w-64 h-64 rounded-full border-2 border-white/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-14 left-20 w-48 h-48 rounded-full border border-white/10"
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <Reveal className="max-w-3xl mx-auto px-8 text-center relative z-10">
        <p className="font-body text-white/70 text-xs font-bold uppercase tracking-[0.3em] mb-4">
          Bắt đầu ngay hôm nay
        </p>
        <h2 className="font-heading font-black text-4xl lg:text-5xl text-white leading-tight mb-6">
          Sẵn sàng nâng tầm
          <br />
          phòng khám của bạn?
        </h2>
        <p className="font-body text-white/70 text-base mb-10">
          Liên hệ ngay để được tư vấn miễn phí và nhận báo giá phù hợp với nhu
          cầu.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={companyTelHref()}
            className="inline-flex items-center gap-2.5 bg-white text-primary font-body font-bold text-sm px-8 py-4 rounded-full hover:bg-gray-100 transition-all shadow-xl hover:-translate-y-1 group"
          >
            <Phone className="w-4 h-4" />
            {COMPANY_PHONE}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <Link
            to="/"
            className="inline-flex items-center gap-2 border-2 border-white/40 text-white font-body font-bold text-sm px-8 py-4 rounded-full hover:border-white hover:bg-white/10 transition-all"
          >
            Về trang chủ
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   FOOTER SECTION (TÌM HIỂU THÊM)
══════════════════════════════════════════════════════ */
const posts = [
  {
    title: "Top 5 xu hướng thiết kế phòng khám 2024",
    date: "15 Tháng 3, 2024",
    img: "https://media.base44.com/images/public/69cff7a985a4c7940dcab568/f114a4731_generated_image.png",
    slug: "ra-mat-ghe-nha-khoa-2026",
  },
  {
    title: "Tại sao ghế nha khoa chất lượng tạo nên sự khác biệt?",
    date: "02 Tháng 3, 2024",
    img: "https://media.base44.com/images/public/69cff7a985a4c7940dcab568/a9e78f522_generated_image.png",
    slug: "mo-rong-thi-truong-dong-nam-a",
  },
  {
    title: "HD Academy khai giảng khoá đào tạo mùa xuân 2024",
    date: "20 Tháng 2, 2024",
    img: "https://media.base44.com/images/public/69cff7a985a4c7940dcab568/8174e0e9a_generated_image.png",
    slug: "hop-tac-dao-tao-hd-academy",
  },
];

function ServicesFooterSection() {
  return (
    <section className="bg-gray-50 py-20 lg:py-28 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <Reveal className="mb-10">
          <h2 className="font-heading font-black text-3xl text-gray-900 mb-5">
            TÌM HIỂU THÊM
          </h2>
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/news"
              className="bg-primary text-white font-heading font-bold text-sm px-7 py-3 rounded-lg hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:-translate-y-0.5"
            >
              TIN TỨC
            </Link>
            <Link
              to="/shop"
              className="bg-primary text-white font-heading font-bold text-sm px-7 py-3 rounded-lg hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:-translate-y-0.5"
            >
              SẢN PHẨM
            </Link>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <p className="font-heading font-bold text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-5">
              BÀI VIẾT NỔI BẬT
            </p>
            <div className="space-y-3">
              {posts.map((p, i) => (
                <Link key={i} to={`/news/${p.slug}`}>
                  <motion.div
                    className="flex gap-4 bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <img
                      src={p.img}
                      alt=""
                      className="w-20 h-20 object-cover flex-shrink-0"
                    />
                    <div className="flex-1 p-4 flex flex-col justify-center">
                      <p className="font-body text-[10px] text-gray-400 mb-1">
                        {p.date}
                      </p>
                      <p className="font-body font-semibold text-sm text-gray-800 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {p.title}
                      </p>
                    </div>
                    <div className="flex items-center pr-4">
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="font-heading font-bold text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-5">
              SẢN PHẨM BÁN CHẠY
            </p>
            <div className="space-y-3">
              {[
                {
                  name: "Ghế Nha Khoa Grace X2",
                  price: "45 triệu ₫",
                  img: "https://media.base44.com/images/public/69cff7a985a4c7940dcab568/eb08102c5_generated_image.png",
                  id: "ghe-grace-x2",
                },
                {
                  name: "Đèn Trám LED VALO Grand",
                  price: "12.5 triệu ₫",
                  img: "https://media.base44.com/images/public/69cff7a985a4c7940dcab568/1c27eca0e_generated_image.png",
                  id: "den-valo-grand",
                },
                {
                  name: "Máy X-Quang VATECH PaX-i3D",
                  price: "320 triệu ₫",
                  img: "https://media.base44.com/images/public/69cff7a985a4c7940dcab568/b584e5efc_generated_image.png",
                  id: "xray-pax-i3d",
                },
              ].map((p, i) => (
                <Link key={i} to={`/product/${p.id}`}>
                  <motion.div
                    className="flex gap-4 bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <img
                      src={p.img}
                      alt=""
                      className="w-20 h-20 object-cover flex-shrink-0 bg-gray-50"
                    />
                    <div className="flex-1 p-4 flex flex-col justify-center">
                      <p className="font-body font-semibold text-sm text-gray-800 group-hover:text-primary transition-colors leading-snug mb-1">
                        {p.name}
                      </p>
                      <p className="font-heading font-bold text-primary text-sm">
                        {p.price}
                      </p>
                    </div>
                    <div className="flex items-center pr-4">
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
