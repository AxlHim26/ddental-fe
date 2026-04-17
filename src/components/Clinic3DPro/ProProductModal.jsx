"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useSiteAuth } from "../../context/SiteAuthContext";

const formatVND = (price) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

const EASING = [0.22, 1, 0.36, 1];

/* ── Star rating row ── */
function StarRow({ rating, reviews }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg
            key={s}
            className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-amber-400" : "text-white/15"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-white/35 text-xs">
        {rating} <span className="text-white/20">·</span> {reviews} đánh giá
      </span>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   MAIN EXPORT
════════════════════════════════════════════════════ */
export default function ProProductModal({ product, onClose }) {
  const { addItem } = useCart();
  const { user, ready } = useSiteAuth();
  const router = useRouter();

  const [cartState, setCartState] = useState("idle"); // idle | adding | added | error | out_of_stock | login
  const [errorMsg, setErrorMsg] = useState("");

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Reset cart state on product change
  useEffect(() => {
    setCartState("idle");
    setErrorMsg("");
  }, [product?.id]);

  if (!product) return null;

  const isOutOfStock = product.inStock === false;

  const handleAddToCart = () => {
    if (!ready || cartState === "adding" || cartState === "added") return;

    if (!user) {
      setCartState("login");
      return;
    }

    if (isOutOfStock) {
      setCartState("out_of_stock");
      return;
    }

    setCartState("adding");
    const result = addItem(product.id, 1);

    if (!result.ok) {
      const msg =
        result.error === "out_of_stock" ? "Sản phẩm hiện đang hết hàng." :
        result.error === "not_found"    ? "Không tìm thấy sản phẩm."     :
                                          "Đã có lỗi xảy ra.";
      setErrorMsg(msg);
      setCartState("error");
      return;
    }

    setCartState("added");
    setTimeout(() => setCartState("idle"), 2200);
  };

  const handleGoLogin = () => {
    onClose();
    router.push("/login");
  };

  const handleViewDetail = () => {
    onClose();
    router.push(`/product/${product.id}`);
  };

  /* ── Tag badge colour mapping ── */
  const tagStyle = {
    "Bán chạy":  "bg-primary text-white",
    "Mới":       "bg-emerald-500 text-white",
    "Cao cấp":   "bg-violet-600 text-white",
    "Giảm giá":  "bg-amber-500 text-white",
    "Nổi bật":   "bg-sky-500 text-white",
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        initial={{ backgroundColor: "rgba(0,0,0,0)" }}
        animate={{ backgroundColor: "rgba(0,0,0,0.72)" }}
        exit={{ backgroundColor: "rgba(0,0,0,0)" }}
        style={{ backdropFilter: "blur(6px)" }}
        onClick={onClose}
      >
        <motion.div
          key="modal"
          className="relative w-full max-w-[460px] bg-[#111821] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl"
          initial={{ y: 48, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.38, ease: EASING }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Product image area ── */}
          <div className="relative h-52 bg-[#0D1521] flex items-center justify-center overflow-hidden select-none">
            {/* Soft radial glow behind product */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(91,141,184,0.12)_0%,transparent_70%)] pointer-events-none" />

            {product.image && (
              <motion.img
                src={product.image}
                alt={product.name}
                className="relative z-10 w-auto h-full max-h-44 object-contain p-5 drop-shadow-xl"
                initial={{ opacity: 0, scale: 0.88, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.1, ease: EASING }}
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            )}

            {/* Gradient overlay bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111821]/80 via-transparent to-transparent pointer-events-none" />

            {/* Tag badge */}
            {product.tag && (
              <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide ${tagStyle[product.tag] ?? "bg-white/15 text-white"}`}>
                {product.tag}
              </span>
            )}

            {/* Close button */}
            <button
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 border border-white/[0.1] text-white/50 hover:text-white hover:bg-black/75 flex items-center justify-center transition-colors"
              onClick={onClose}
              aria-label="Đóng"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ── Content ── */}
          <div className="p-5">
            {/* Brand + category */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                {product.brand}
              </span>
              {product.category && (
                <>
                  <span className="text-white/15 text-xs">·</span>
                  <span className="text-[10px] text-white/30 capitalize">
                    {product.category.replace("-", " ")}
                  </span>
                </>
              )}
            </div>

            {/* Product name */}
            <h3 className="font-heading font-bold text-[1.18rem] text-white leading-snug mb-2">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-white/42 text-[12.5px] leading-relaxed line-clamp-2 mb-3.5">
              {product.description}
            </p>

            {/* Rating */}
            {product.rating != null && (
              <div className="mb-3.5">
                <StarRow rating={product.rating} reviews={product.reviews} />
              </div>
            )}

            {/* Price */}
            <div className="flex items-end gap-2.5 mb-4">
              <span className="font-heading font-black text-2xl text-primary leading-none">
                {formatVND(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-white/25 text-sm line-through pb-0.5">
                  {formatVND(product.oldPrice)}
                </span>
              )}
              {product.oldPrice && (
                <span className="text-emerald-400/80 text-xs font-bold pb-0.5">
                  -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Out-of-stock notice */}
            {isOutOfStock && (
              <p className="text-amber-400/80 text-xs mb-3 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Sản phẩm tạm hết hàng
              </p>
            )}

            {/* Error */}
            {cartState === "error" && errorMsg && (
              <p className="text-red-400/80 text-xs mb-3">{errorMsg}</p>
            )}

            {/* Login prompt banner */}
            {cartState === "login" && (
              <motion.div
                className="mb-3 p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs text-white/50 leading-relaxed"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Bạn cần{" "}
                <button
                  className="text-primary font-semibold hover:underline"
                  onClick={handleGoLogin}
                >
                  đăng nhập
                </button>{" "}
                để thêm sản phẩm vào giỏ hàng.
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2.5">
              {/* Add to cart / Login */}
              <button
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all disabled:opacity-55 disabled:cursor-not-allowed ${
                  cartState === "added"
                    ? "bg-emerald-500 text-white"
                    : cartState === "error"
                    ? "bg-red-500/80 text-white"
                    : isOutOfStock
                    ? "bg-white/[0.08] text-white/35"
                    : "bg-primary hover:bg-primary/88 active:scale-[0.98] text-white shadow-lg shadow-primary/20"
                }`}
                onClick={handleAddToCart}
                disabled={
                  cartState === "adding" ||
                  cartState === "added" ||
                  isOutOfStock
                }
              >
                {cartState === "added" ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Đã thêm!
                  </>
                ) : cartState === "adding" ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Đang thêm…
                  </>
                ) : isOutOfStock ? (
                  "Hết hàng"
                ) : !user ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Đăng nhập để thêm
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Thêm vào giỏ
                  </>
                )}
              </button>

              {/* View detail */}
              <button
                className="px-4 py-2.5 rounded-xl border border-white/[0.12] text-white/55 hover:border-white/25 hover:text-white text-sm font-semibold transition-all active:scale-[0.97] whitespace-nowrap"
                onClick={handleViewDetail}
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
