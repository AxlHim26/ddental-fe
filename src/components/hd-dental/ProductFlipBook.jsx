import React, { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { products as allProducts } from "@/lib/productData";
import ProductPageCard from "./ProductPageCard";

const PAGE_SWIPE_THRESHOLD = 90;

function getShowcaseProducts() {
  return [...allProducts]
    .filter((item) => item.rating >= 4.7)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);
}

export default function ProductFlipBook() {
  const products = useMemo(getShowcaseProducts, []);
  const [pageIndex, setPageIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [direction, setDirection] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioContextRef = useRef(null);

  const totalPages = products.length;
  const currentProduct = products[pageIndex];
  const nextProduct =
    previewIndex === null ? null : products[previewIndex];

  const playFlipSound = useCallback(() => {
    if (!soundEnabled || typeof window === "undefined") return;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioCtx();
    }

    const ctx = audioContextRef.current;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // Low "thump" to suggest page inertia.
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
    oscGain.gain.setValueAtTime(0.0001, now);
    oscGain.gain.exponentialRampToValueAtTime(0.05, now + 0.01);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.11);

    // Soft paper "swish" using filtered noise.
    const duration = 0.12;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(1200, now);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.02, now + 0.01);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    source.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    source.start(now);
    source.stop(now + duration);
  }, [soundEnabled]);

  const startFlip = (nextIndex, nextDirection) => {
    if (isFlipping || nextIndex === pageIndex) return;
    setDirection(nextDirection);
    setPreviewIndex(nextIndex);
    setIsFlipping(true);
    playFlipSound();
  };

  const goNext = () => {
    const nextIndex = (pageIndex + 1) % totalPages;
    startFlip(nextIndex, 1);
  };

  const goPrev = () => {
    const nextIndex = (pageIndex - 1 + totalPages) % totalPages;
    startFlip(nextIndex, -1);
  };

  const handleDragEnd = (_event, info) => {
    if (info.offset.x <= -PAGE_SWIPE_THRESHOLD) {
      goNext();
      return;
    }
    if (info.offset.x >= PAGE_SWIPE_THRESHOLD) {
      goPrev();
    }
  };

  if (!currentProduct) return null;

  return (
    <section
      id="products"
      className="overflow-x-hidden bg-gradient-to-b from-zinc-100 via-zinc-50 to-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-5 lg:px-8">
        <header className="mb-10 text-center sm:mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Product Catalogue
          </p>
          <h2 className="mt-3 text-balance font-heading text-3xl font-black text-zinc-900 sm:text-4xl lg:text-5xl">
            Flip Book Product Showcase
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty font-body text-sm leading-relaxed text-zinc-600 sm:text-base">
            Khám phá thiết bị nha khoa cao cấp với trải nghiệm lật trang catalogue hiện đại, tinh gọn và tập trung vào sản phẩm.
          </p>
        </header>

        <div className="relative [perspective:2200px]">
          <div className="pointer-events-none absolute inset-x-4 top-3 h-[88%] rounded-[34px] bg-white/70 shadow-[0_18px_50px_rgba(15,23,42,0.1)] sm:inset-x-8" />

          <motion.div
            drag={isFlipping ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={handleDragEnd}
            className="relative mx-auto w-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            {nextProduct && (
              <motion.div
                className="absolute inset-0 z-0"
                initial={{ opacity: 0.72, scale: 0.992 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductPageCard
                  product={nextProduct}
                  pageIndex={previewIndex}
                  totalPages={totalPages}
                />
              </motion.div>
            )}

            <div className="relative z-10">
              <ProductPageCard
                product={currentProduct}
                pageIndex={pageIndex}
                totalPages={totalPages}
              />
            </div>

            {isFlipping && (
              <motion.div
                className="pointer-events-none absolute inset-0 z-30"
                initial={{ opacity: 0.95 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.22 }}
              >
                <motion.div
                  className="absolute inset-y-0 w-1/2"
                  style={{
                    right: direction > 0 ? 0 : "auto",
                    left: direction > 0 ? "auto" : 0,
                    transformStyle: "preserve-3d",
                    transformOrigin: direction > 0 ? "left center" : "right center",
                  }}
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: direction > 0 ? -178 : 178 }}
                  transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
                  onAnimationComplete={() => {
                    if (previewIndex !== null) {
                      setPageIndex(previewIndex);
                    }
                    setPreviewIndex(null);
                    setIsFlipping(false);
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-[30px]"
                    style={{
                      backfaceVisibility: "hidden",
                      background:
                        direction > 0
                          ? "linear-gradient(90deg, rgba(9,9,11,0.08) 0%, rgba(255,255,255,0.97) 22%, rgba(244,244,245,1) 100%)"
                          : "linear-gradient(270deg, rgba(9,9,11,0.08) 0%, rgba(255,255,255,0.97) 22%, rgba(244,244,245,1) 100%)",
                      boxShadow:
                        direction > 0
                          ? "-24px 0 36px rgba(15,23,42,0.16)"
                          : "24px 0 36px rgba(15,23,42,0.16)",
                    }}
                  />

                  <div
                    className="absolute inset-0 rounded-[30px]"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                      background:
                        direction > 0
                          ? "linear-gradient(90deg, rgba(228,228,231,0.96) 0%, rgba(248,248,249,1) 42%, rgba(228,228,231,0.92) 100%)"
                          : "linear-gradient(270deg, rgba(228,228,231,0.96) 0%, rgba(248,248,249,1) 42%, rgba(228,228,231,0.92) 100%)",
                    }}
                  />

                  <motion.div
                    className="absolute inset-y-0 z-10 w-6 sm:w-8"
                    style={{
                      right: direction > 0 ? 0 : "auto",
                      left: direction > 0 ? "auto" : 0,
                      background:
                        direction > 0
                          ? "linear-gradient(270deg, rgba(15,23,42,0.26) 0%, rgba(15,23,42,0.06) 48%, rgba(255,255,255,0) 100%)"
                          : "linear-gradient(90deg, rgba(15,23,42,0.26) 0%, rgba(15,23,42,0.06) 48%, rgba(255,255,255,0) 100%)",
                      transform: direction > 0 ? "translateX(35%)" : "translateX(-35%)",
                      filter: "blur(0.4px)",
                    }}
                    initial={{
                      borderTopRightRadius: direction > 0 ? "58%" : "18%",
                      borderBottomRightRadius: direction > 0 ? "58%" : "18%",
                      borderTopLeftRadius: direction > 0 ? "18%" : "58%",
                      borderBottomLeftRadius: direction > 0 ? "18%" : "58%",
                      opacity: 0.2,
                    }}
                    animate={{
                      borderTopRightRadius: direction > 0 ? "82%" : "16%",
                      borderBottomRightRadius: direction > 0 ? "82%" : "16%",
                      borderTopLeftRadius: direction > 0 ? "16%" : "82%",
                      borderBottomLeftRadius: direction > 0 ? "16%" : "82%",
                      opacity: 0.55,
                    }}
                    transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
                  />
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={goPrev}
              disabled={isFlipping}
              className="inline-flex min-w-[132px] items-center justify-center rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Previous
            </button>

            <span className="px-2 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
              {String(pageIndex + 1).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
            </span>

            <button
              type="button"
              onClick={goNext}
              disabled={isFlipping}
              className="inline-flex min-w-[132px] items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Next
            </button>

            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              className={`inline-flex min-w-[132px] items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
                soundEnabled
                  ? "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-700"
                  : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-900 hover:text-zinc-900"
              }`}
            >
              Sound: {soundEnabled ? "On" : "Off"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
