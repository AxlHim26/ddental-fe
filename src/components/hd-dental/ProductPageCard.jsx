import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ProductPageCard({ product, pageIndex, totalPages }) {
  return (
    <article className="relative w-full max-w-[1040px] overflow-hidden rounded-[30px] border border-zinc-200/80 bg-zinc-100 shadow-[0_24px_70px_rgba(15,23,42,0.14)]">
      <div className="pointer-events-none absolute inset-x-6 -bottom-8 h-12 rounded-full bg-zinc-900/10 blur-2xl" />

      <div className="relative grid grid-cols-1 gap-0 p-3 sm:p-4 lg:grid-cols-2">
        <div className="absolute left-1/2 top-6 z-20 hidden h-[calc(100%-3rem)] w-px -translate-x-1/2 bg-gradient-to-b from-zinc-300/0 via-zinc-300 to-zinc-300/0 lg:block" />
        <div className="absolute left-1/2 top-6 z-20 hidden h-[calc(100%-3rem)] w-10 -translate-x-1/2 bg-gradient-to-r from-zinc-950/5 via-zinc-400/20 to-zinc-950/5 blur-sm lg:block" />

        <div className="relative flex min-w-0 items-center justify-center rounded-2xl bg-white p-4 sm:p-6 lg:rounded-r-none lg:pr-8">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 lg:rounded-r-none" />
          <motion.img
            src={product.image}
            alt={product.name}
            className="relative z-10 h-auto max-h-[320px] w-full max-w-full object-contain sm:max-h-[360px] lg:max-h-[420px]"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <div className="relative flex min-w-0 flex-col justify-center rounded-2xl bg-white p-5 sm:p-6 lg:rounded-l-none lg:pl-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-400">
            Trưng bày sản phẩm
          </p>

          <h3 className="text-balance font-heading text-2xl font-black leading-tight text-primary sm:text-3xl lg:text-4xl">
            {product.name}
          </h3>

          <p className="mt-4 text-pretty font-body text-sm leading-relaxed text-zinc-600 sm:text-base">
            {product.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to={`/product/${product.id}`}
              className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
            >
              Xem chi tiết
            </Link>

            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
              {String(pageIndex + 1).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
