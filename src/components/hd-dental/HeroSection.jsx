import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { getHeroArticles } from "@/lib/newsData";
import { E, Reveal } from "@/lib/animations";

const slides = [
  {
    image:
      "https://media.base44.com/images/public/69cff7a985a4c7940dcab568/ceb056cd9_generated_6eba3c34.png",
    line1: "GIẢI PHÁP",
    line2: "NHA KHOA",
    subtitle: "Công nghệ hiện đại — Chất lượng vượt trội",
  },
  {
    image:
      "https://media.base44.com/images/public/69cff7a985a4c7940dcab568/03fb83d84_generated_4e9cea76.png",
    line1: "THIẾT BỊ",
    line2: "CAO CẤP",
    subtitle: "Đối tác tin cậy của hàng ngàn nha sĩ Việt Nam",
  },
];

const heroNews = getHeroArticles().slice(0, 3);
const SLIDE_DURATION = 6000;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [hoveredSlide, setHoveredSlide] = useState(null);
  const [progress, setProgress] = useState(0);
  const activeSlide = hoveredSlide !== null ? hoveredSlide : current;
  const sectionRef = useRef(null);

  // Parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Auto-slide with progress
  useEffect(() => {
    let start = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(elapsed / SLIDE_DURATION, 1));
    }, 30);
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
      start = Date.now();
      setProgress(0);
    }, SLIDE_DURATION);
    return () => {
      clearInterval(timer);
      clearInterval(progressInterval);
    };
  }, []);

  const goTo = (idx) => {
    setCurrent(idx);
    setProgress(0);
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-gray-950"
    >
      {/* Parallax Background */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <AnimatePresence mode="sync">
          <motion.div
            key={activeSlide}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1.0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: E }}
          >
            <motion.img
              src={slides[activeSlide].image}
              alt=""
              className="w-full h-full object-cover"
              animate={{ scale: [1, 1.06] }}
              transition={{
                duration: 10,
                ease: "linear",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

      {/* Decorative circles */}
      <motion.div
        className="absolute top-24 right-16 w-80 h-80 rounded-full border border-primary/10 pointer-events-none hidden lg:block"
        animate={{ rotate: 360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-36 right-28 w-48 h-48 rounded-full border border-primary/8 pointer-events-none hidden lg:block"
        animate={{ rotate: -360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />

      {/* Watermark */}
      <div className="absolute bottom-0 right-0 pointer-events-none overflow-hidden hidden lg:block">
        <motion.p
          className="font-heading font-black text-[12rem] xl:text-[18rem] leading-none text-white/[0.02] whitespace-nowrap select-none"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6, ease: E }}
        >
          HD DENTAL
        </motion.p>
      </div>

      {/* Content */}
      <motion.div
        className="relative h-full max-w-7xl mx-auto px-8 lg:px-16 flex flex-col justify-center"
        style={{ opacity: contentOpacity }}
      >
        <div className="mt-16 lg:mt-0 max-w-3xl">
          {/* Badge */}
          <Reveal delay={0.1}>
            <div className="inline-flex items-center gap-2 border border-primary/40 text-primary text-xs font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Giải pháp nha khoa #1 Việt Nam
            </div>
          </Reveal>

          {/* Title */}
          <AnimatePresence mode="wait">
            <motion.div key={current}>
              <div className="overflow-hidden mb-1 pt-4 pb-3">
                <motion.h1
                  className="font-heading font-black text-4xl md:text-7xl lg:text-8xl text-white leading-none"
                  initial={{ y: 120 }}
                  animate={{ y: 0 }}
                  exit={{ y: -120 }}
                  transition={{ duration: 0.7, ease: E }}
                >
                  {slides[current].line1}
                </motion.h1>
              </div>
              <div className="overflow-hidden mb-6 pt-4">
                <motion.h1
                  className="font-heading font-black text-4xl md:text-7xl lg:text-8xl text-primary leading-none"
                  initial={{ y: 120 }}
                  animate={{ y: 0 }}
                  exit={{ y: -120 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: E }}
                >
                  {slides[current].line2}
                </motion.h1>
              </div>
              <motion.p
                className="font-body text-white/60 text-lg md:text-xl max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                {slides[current].subtitle}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          {/* CTAs */}
          <Reveal delay={0.4}>
            <div className="flex gap-4 mt-10 flex-wrap">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2.5 bg-primary text-white font-body font-bold text-sm px-8 py-4 rounded-full hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 hover:-translate-y-1 group"
              >
                XEM SẢN PHẨM
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-body font-semibold text-sm px-8 py-4 rounded-full hover:border-white hover:bg-white/10 transition-all"
              >
                Liên hệ
              </a>
            </div>
          </Reveal>

          {/* Scroll hint */}
          <Reveal delay={0.6}>
            <a
              href="#stats"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white font-body text-xs mt-12 transition-colors"
            >
              Khám phá thêm <ChevronDown className="w-4 h-4 animate-bounce" />
            </a>
          </Reveal>
        </div>
      </motion.div>

      {/* News Grid */}
      <div className="absolute bottom-8 left-8 lg:left-16 right-8 lg:right-auto hidden lg:block max-w-3xl">
        <div className="grid grid-cols-3 gap-3">
          {heroNews.map((item, i) => (
            <Link key={item.slug} to={`/news/${item.slug}`}>
              <motion.div
                onMouseEnter={() => setHoveredSlide(i % slides.length)}
                onMouseLeave={() => setHoveredSlide(null)}
                className="bg-white/[0.07] backdrop-blur-xl border border-white/15 rounded-xl px-5 py-4 cursor-pointer hover:bg-white/15 transition-all duration-300 group h-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.1, ease: E }}
                whileHover={{ y: -4 }}
              >
                <span className="text-primary font-body text-[10px] font-bold uppercase tracking-wider">
                  {item.tag}
                </span>
                <p className="text-white font-body text-sm font-medium mt-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </p>
                <ArrowRight className="w-3 h-3 text-white/30 mt-2 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Slide controls */}
      <div className="absolute bottom-8 right-8 lg:right-16 hidden lg:flex flex-col items-end gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => goTo((current - 1 + slides.length) % slides.length)}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/15 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-white font-heading font-bold text-sm w-14 text-center">
            {String(current + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </span>
          <button
            onClick={() => goTo((current + 1) % slides.length)}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/15 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        {/* Progress bar */}
        <div className="w-24 h-0.5 bg-white/15 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
}
