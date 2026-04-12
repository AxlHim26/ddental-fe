"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Calendar } from "lucide-react";
import Navbar from "@/components/hd-dental/Navbar";
import {
  articles,
  getHeroArticles,
  getEditorialArticles,
} from "@/lib/newsData";
import Footer from "@/components/hd-dental/Footer";

/* ─── auto-advance every 3 seconds ─── */
const SLIDE_MS = 3000;

/* ─── animation presets ─── */
const springSoft = { type: "spring", stiffness: 120, damping: 22 };
const easeOut = [0.16, 1, 0.3, 1];

/* ─── stagger text block ─── */
const textBlock = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};
const textItem = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: easeOut },
  },
};

/* ─── lower-section article card ─── */
const gridCard = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

/* ════════════════════════════════════════════════
   PROGRESS BAR  – fills over SLIDE_MS ms
══════════════════════════════════════════════════ */
function ProgressBar({ progress }) {
  return (
    <div className="h-[3px] w-full bg-white/10 overflow-hidden relative">
      <motion.div
        className="h-full bg-primary absolute left-0 top-0"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════
   PAGE COMPONENT
══════════════════════════════════════════════════ */
export default function NewsPage() {
  const heroList = getHeroArticles(); // up to 4 featured articles
  // use a large initial offset so we don't go below 0 when going Previous
  const [slideCount, setSlideCount] = useState(1000 * heroList.length);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const activeIdx = slideCount % heroList.length;
  const active = heroList[activeIdx] ?? heroList[0];
  const editorial = getEditorialArticles();

  const goNext = useCallback(() => {
    setSlideCount((c) => c + 1);
    setProgress(0);
  }, []);

  const goPrev = useCallback(() => {
    setSlideCount((c) => c - 1);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (paused || heroList.length < 2) return undefined;

    let start = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(elapsed / SLIDE_MS, 1));
    }, 40);

    const timer = setInterval(() => {
      goNext();
      start = Date.now();
      setProgress(0);
    }, SLIDE_MS);

    return () => {
      clearInterval(timer);
      clearInterval(progressInterval);
    };
  }, [paused, goNext, heroList.length]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-body">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════
          GLOBE-EXPRESS-STYLE HERO  — full-viewport cinematic
      ═══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ height: "100vh", minHeight: 640 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* ── Full-screen background image ── */}
        <AnimatePresence mode="sync">
          <motion.div
            key={active.slug + "-bg"}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <img
              src={active.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* ── Gradient overlays (lightened per request) ── */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 xl:via-black/20 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 z-[1]" />

        {/* ── Subtle red ambient on the right ── */}
        <div
          className="absolute top-1/4 right-1/3 w-[500px] h-[500px] rounded-full pointer-events-none z-[1]"
          style={{
            background:
              "radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 70%)",
          }}
        />

        {/* ══════════════════════════════════════════
            INNER LAYOUT  (Navbar height offset: pt-20)
        ══════════════════════════════════════════ */}
        <div className="relative z-[5] h-full flex flex-col justify-between pt-[72px] pb-0">
          {/* TOP ROW — left text + right cards  */}
          <div className="flex-1 flex items-center mt-20 sm:mt-28 xl:mt-32">
            <div className="w-full max-w-[1720px] mx-auto px-8 sm:px-12 lg:px-16 xl:px-24 flex items-center justify-between gap-12 lg:gap-20 xl:gap-32">
              {/* ─── LEFT: text content ─── */}
              {/* Made text box wider (max-w-[760px]) and taller (h-[540px]) to prevent overlapping and excessive wrapping */}
              <div className="flex-1 min-w-0 max-w-[640px] xl:max-w-[760px] h-[400px] sm:h-[460px] xl:h-[540px] relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.slug + "-text"}
                    variants={textBlock}
                    initial="hidden"
                    animate="show"
                    exit={{
                      opacity: 0,
                      x: -20,
                      filter: "blur(6px)",
                      transition: { duration: 0.22 },
                    }}
                    className="absolute inset-0 flex flex-col"
                  >
                    {/* Location / category label */}
                    <motion.div
                      variants={textItem}
                      className="flex items-center gap-3 mb-5"
                    >
                      <div className="w-8 h-[2px] bg-primary flex-shrink-0" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/70">
                        {active.tag} · HD Dental
                      </span>
                    </motion.div>

                    {/* BIG headline — Globe Express style */}
                    <motion.h1
                      variants={textItem}
                      className="font-black uppercase leading-[0.95] text-white mb-6"
                      style={{
                        fontSize: "clamp(2.4rem, 4.8vw, 4.8rem)",
                        textShadow: "0 4px 40px rgba(0,0,0,0.6)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {active.title}
                    </motion.h1>

                    {/* Excerpt */}
                    <motion.p
                      variants={textItem}
                      className="text-white/60 leading-relaxed max-w-[420px] text-sm sm:text-base mb-8 line-clamp-3"
                    >
                      {active.excerpt}
                    </motion.p>

                    {/* CTA row (Always glued to bottom, NO y-axis movement so it won't jump) */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, filter: "blur(8px)" },
                        show: {
                          opacity: 1,
                          filter: "blur(0px)",
                          transition: { duration: 0.5, ease: easeOut },
                        },
                      }}
                      className="absolute bottom-0 left-0 flex items-center gap-5 w-full"
                    >
                      <Link
                        to={`/news/${active.slug}`}
                        className="group relative inline-flex items-center gap-3 overflow-hidden border border-primary bg-primary/90 hover:bg-primary px-7 py-3 text-[12px] font-bold uppercase tracking-widest text-white transition-colors duration-200"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                        }}
                      >
                        Khám phá ngay
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>

                      <span className="flex items-center gap-2 text-white/40 text-xs font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(active.date)}
                      </span>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ─── RIGHT: portrait cards — equal size, slide R→L, infinite loop ─── */}
              <div
                className="hidden lg:block flex-shrink-0 self-end pb-12 overflow-hidden relative ml-auto"
                style={{ width: 680, height: 268 }}
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{ x: -(slideCount * (160 + 16)) }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 28,
                    mass: 0.9,
                  }}
                >
                  {Array.from({ length: 8 }).map((_, idx) => {
                    // Render 2 cards before active, and 5 cards after
                    const absoluteIndex = slideCount - 2 + idx;
                    const dataIdx =
                      ((absoluteIndex % heroList.length) + heroList.length) %
                      heroList.length;
                    const item = heroList[dataIdx];
                    const isActive = absoluteIndex === slideCount;

                    return (
                      <motion.button
                        key={absoluteIndex}
                        type="button"
                        aria-label={item.title}
                        aria-pressed={isActive}
                        onClick={() => {
                          setSlideCount(absoluteIndex);
                          setPaused(true);
                          setTimeout(() => setPaused(false), 6000);
                        }}
                        animate={{
                          filter: isActive
                            ? "brightness(1) saturate(1)"
                            : "brightness(0.55) saturate(0.7)",
                        }}
                        whileHover={{
                          y: -8,
                          filter: "brightness(0.9) saturate(1)",
                          transition: springSoft,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 28,
                        }}
                        className="absolute top-0 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer"
                        style={{
                          left: absoluteIndex * (160 + 16),
                          width: 160,
                          height: 220,
                          boxShadow: isActive
                            ? "0 24px 50px -10px rgba(0,0,0,0.7), 0 0 0 2px rgba(220,38,38,0.6)"
                            : "0 12px 32px -8px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)",
                        }}
                      >
                        {/* Card image */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Active border ring */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-2xl border-2 border-primary/70"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}

                        {/* Card label */}
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-primary/90 mb-1">
                            {item.tag}
                          </p>
                          <p className="text-white font-bold text-[11px] leading-tight line-clamp-2">
                            {item.title}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════
              BOTTOM BAR  — arrows · progress · counter
          ══════════════════════════════════════════ */}
          <div className="relative z-[6]">
            {/* Progress bar — full width */}
            <ProgressBar progress={progress} />

            <div className="flex items-center justify-between px-8 sm:px-12 lg:px-16 xl:px-20 py-4 bg-black/30 backdrop-blur-sm">
              {/* Arrow buttons — Globe Express style */}
              <div className="flex items-center gap-3">
                <button
                  onClick={goPrev}
                  className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center text-white/70 hover:border-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                  aria-label="Bài trước"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={goNext}
                  className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center text-white/70 hover:border-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                  aria-label="Bài tiếp theo"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Dot indicators */}
                <div className="flex items-center gap-2 ml-3">
                  {heroList.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        // when they click a dot, find the nearest absolute index that matches this modulo
                        const diff = i - (slideCount % heroList.length);
                        // if diff is, say, +2, increment by 2
                        setSlideCount(slideCount + diff);
                        setPaused(true);
                        setTimeout(() => setPaused(false), 6000);
                      }}
                      className="transition-all duration-300 rounded-full"
                      style={{
                        width: i === activeIdx ? 28 : 8,
                        height: 8,
                        background:
                          i === activeIdx
                            ? "hsl(var(--primary))"
                            : "rgba(255,255,255,0.3)",
                        boxShadow:
                          i === activeIdx
                            ? "0 0 8px rgba(220,38,38,0.5)"
                            : "none",
                      }}
                      aria-label={`Bài ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Slide counter — Globe Express "03" style */}
              <div className="flex items-center gap-3">
                <span className="text-white/30 text-xs uppercase tracking-[0.3em] font-medium hidden sm:block">
                  HD Dental News
                </span>
                <div
                  className="text-white font-black tabular-nums"
                  style={{
                    fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                    lineHeight: 1,
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activeIdx}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3, ease: easeOut }}
                      className="block"
                    >
                      {String(activeIdx + 1).padStart(2, "0")}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span className="text-white/25 text-sm font-bold">
                  / {String(heroList.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ── END HERO ── */}

      {/* ═══════════════════════════════════════════════════════
          EDITORIAL SECTION  — White + Red theme
      ═══════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 bg-white overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#dc2626_1px,transparent_1px),linear-gradient(to_bottom,#dc2626_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        {/* Decorative red accent circles */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: easeOut }}
            className="text-center max-w-2xl mx-auto mb-16 sm:mb-20"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-[2px] bg-primary" />
              <p className="text-primary text-xs font-bold uppercase tracking-[0.3em]">
                Bài viết
              </p>
              <span className="w-8 h-[2px] bg-primary" />
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-5xl text-gray-900 mt-2">
              Nổi bật
            </h2>
            <p className="text-gray-500 text-sm mt-4 leading-relaxed">
              Tin tức · Sự kiện · Sản phẩm
            </p>
          </motion.div>

          <div className="space-y-20 sm:space-y-28">
            {editorial.map((post, idx) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.65,
                  ease: easeOut,
                  delay: idx * 0.05,
                }}
                className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                <motion.div
                  className={`lg:col-span-7 relative ${idx % 2 === 1 ? "lg:order-2" : ""}`}
                  whileHover={{ scale: 1.01 }}
                  transition={springSoft}
                >
                  <span className="absolute -top-3 -left-2 sm:left-4 z-10 text-[clamp(4rem,14vw,8rem)] font-heading font-bold text-primary/[0.06] leading-none select-none pointer-events-none">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <Link
                    to={`/news/${post.slug}`}
                    className="group relative block aspect-[16/11] sm:aspect-[16/9] overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-lg hover:shadow-2xl transition-shadow duration-500"
                  >
                    <motion.img
                      src={post.image}
                      alt=""
                      className="h-full w-full object-cover"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.65, ease: easeOut }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-primary/10 opacity-60 group-hover:opacity-70 transition-opacity duration-500" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
                      style={{ skewX: -12 }}
                    />
                    <span className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-primary text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                      {post.tag}
                    </span>
                  </Link>
                </motion.div>

                <div
                  className={`lg:col-span-5 relative ${idx % 2 === 1 ? "lg:order-1" : ""}`}
                >
                  <time className="text-xs text-primary flex items-center gap-2 font-semibold uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(post.date)}
                  </time>
                  <h3 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-gray-900 mt-4 leading-tight">
                    <Link
                      to={`/news/${post.slug}`}
                      className="hover:text-primary transition-colors duration-300"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mt-5 leading-relaxed text-base">
                    {post.excerpt}
                  </p>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={springSoft}
                    className="inline-block mt-8"
                  >
                    <Link
                      to={`/news/${post.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-white bg-primary px-6 py-2.5 rounded-full hover:bg-primary/90 transition-colors shadow-md"
                    >
                      Đọc thêm <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          ALL ARTICLES GRID  — White + Red theme
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-28 px-4 sm:px-6 bg-gray-50 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        {/* Subtle red accent */}
        <div className="absolute top-20 right-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-14"
          >
            <div>
              <p className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-2">
                Thư viện
              </p>
              <h2 className="font-heading font-bold text-2xl sm:text-4xl text-gray-900">
                Tất cả tin tức
              </h2>
            </div>
            <div className="hidden sm:block w-24 h-[2px] bg-primary/30" />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.09, delayChildren: 0.05 },
              },
            }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8"
          >
            {articles.map((post) => (
              <motion.article
                key={post.slug}
                variants={gridCard}
                whileHover={{ y: -8, transition: springSoft }}
                className="group relative rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
              >
                <Link
                  to={`/news/${post.slug}`}
                  className="block aspect-[16/10] overflow-hidden bg-gray-100 relative"
                >
                  <motion.img
                    src={post.image}
                    alt=""
                    className="h-full w-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.55, ease: easeOut }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-wider">
                    <span className="text-primary font-bold">{post.tag}</span>
                    <time className="text-gray-400 font-medium">
                      {formatDate(post.date)}
                    </time>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-gray-900 mt-3 leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    <Link to={`/news/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <Link
                    to={`/news/${post.slug}`}
                    className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all duration-300"
                  >
                    Đọc thêm{" "}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer — White + Red theme */}
      <Footer />
    </div>
  );
}
