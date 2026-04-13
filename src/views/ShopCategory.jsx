"use client";

import React, { useState, useMemo, useEffect } from "react";

import { useParams, Link, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, Star, ArrowRight, Search, X, LayoutGrid, Banknote } from "lucide-react";
import { products, categories } from "../lib/productData";
import ShopNavbar from "../components/hd-dental/ShopNavbar";

const TAG_COLORS = {
  "Bán chạy": "bg-amber-500 text-white",
  "Nổi bật": "bg-sky-600 text-white",
  "Mới": "bg-emerald-600 text-white",
  "Giảm giá": "bg-rose-600 text-white",
  "Cao cấp": "bg-violet-900 text-white",
};

const PRICE_RANGES = [
  { label: "Tất cả", min: 0, max: Infinity },
  { label: "Dưới 10 triệu", min: 0, max: 10000000 },
  { label: "10 - 50 triệu", min: 10000000, max: 50000000 },
  { label: "50 - 200 triệu", min: 50000000, max: 200000000 },
  { label: "Trên 200 triệu", min: 200000000, max: Infinity },
];

const sidebarLinkBase =
  "group block w-full text-left font-body text-sm leading-snug rounded-xl px-3.5 py-2.5 border transition-[color,background-color,border-color,box-shadow] duration-200 ease-out";

function sidebarNavClasses(isActive) {
  return isActive
    ? `${sidebarLinkBase} border-primary/35 bg-primary/[0.09] text-primary font-semibold shadow-sm shadow-primary/5 ring-1 ring-primary/10`
    : `${sidebarLinkBase} border-transparent text-foreground/80 hover:border-border hover:bg-muted/50 hover:text-foreground`;
}

function sidebarPriceClasses(selected) {
  return selected
    ? `${sidebarLinkBase} border-primary/35 bg-primary/[0.09] text-primary font-semibold shadow-sm shadow-primary/5 ring-1 ring-primary/10`
    : `${sidebarLinkBase} border-transparent text-foreground/80 hover:border-border hover:bg-muted/50 hover:text-foreground`;
}

function formatPrice(p) {
  if (p >= 1000000) return (p / 1000000).toFixed(0) + " triệu ₫";
  return p.toLocaleString("vi") + " ₫";
}

/** Trang /shop — hiển thị toàn bộ sản phẩm; lọc danh mục + giá ở sidebar. */
const ALL_CATALOG = {
  name: "Tất cả sản phẩm",
  description:
    "Khám phá toàn bộ thiết bị nha khoa HD Dental. Chọn danh mục hoặc mức giá ở cột bên trái để lọc.",
  banner: categories["ghe-nha-khoa"].banner,
};


export default function ShopCategory() {
  const { slug } = useParams();
  const location = useLocation();
  const category = slug ? categories[slug] : null;
  const isAllProducts = !slug;
  const activeCategory = isAllProducts ? ALL_CATALOG : category;

  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState("default");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 8;

  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) setSidebarOpen(true);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    if (!mq.matches) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const closeSidebarIfMobile = () => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      setSidebarOpen(false);
    }
  };

  const catProducts = useMemo(() => {
    let list = isAllProducts ? [...products] : products.filter((p) => p.category === slug);
    const range = PRICE_RANGES[priceRange];
    list = list.filter((p) => p.price >= range.min && p.price <= range.max);
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [slug, isAllProducts, search, priceRange, sortBy]);

  const totalPages = Math.max(1, Math.ceil(catProducts.length / PRODUCTS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return catProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [catProducts, currentPage]);

  const heroBackgrounds = useMemo(() => {
    const list = Object.values(categories).map((c) => c.banner);
    const deduped = Array.from(new Set([activeCategory.banner, ...list]));
    return deduped.filter(Boolean);
  }, [activeCategory.banner]);
  const heroDescription = useMemo(
    () => activeCategory.description.replace(/\.\s*Chọn/i, ".\nChọn"),
    [activeCategory.description]
  );

  useEffect(() => {
    setHeroSlideIndex(0);
  }, [slug]);

  useEffect(() => {
    setCurrentPage(1);
  }, [slug, search, priceRange, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (heroBackgrounds.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroBackgrounds.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [heroBackgrounds]);

  if (slug && !category) return <div className="p-8 text-center font-body">Danh mục không tồn tại</div>;

  return (
    <div className="min-h-screen bg-background font-body relative pt-20 sm:pt-24 overflow-x-hidden">
      <ShopNavbar onSearch={setSearch} searchValue={search} />

      {/* Dim background when a product card is hovered — desktop only (hover-capable devices) */}
      <div
        className={`fixed inset-0 bg-black/20 z-30 pointer-events-none transition-opacity duration-500 ease-out max-lg:hidden [@media(hover:none)]:hidden ${hoveredProductId ? "opacity-100" : "opacity-0"}`}
      />

      {/* Mobile / tablet: tap outside filter drawer */}
      <button
        type="button"
        aria-label="Đóng bộ lọc"
        className={`fixed left-0 right-0 bottom-0 top-20 sm:top-24 z-[45] bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Hero chuyển nền theo slide */}
      <div className="relative h-52 sm:h-64 lg:h-80 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {heroBackgrounds.map((bg, idx) => (
            <img
              key={`${bg}-${idx}`}
              src={bg}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                idx === heroSlideIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25" />
        </div>
        <div className="absolute inset-0 z-10 flex items-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full min-w-0 pointer-events-none">
          <div className="min-w-0 max-w-full sm:max-w-[62%] lg:max-w-[56%] pointer-events-auto">
            <p className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-body text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] text-primary">
              HD Dental
            </p>
            <h1 className="font-heading font-extrabold text-[1.9rem] sm:text-[2.2rem] lg:text-[3.1rem] text-white mt-3 leading-[1.08] tracking-[-0.01em] line-clamp-2 sm:line-clamp-none drop-shadow-[0_6px_20px_rgba(0,0,0,0.38)]">
              {activeCategory.name}
            </h1>
            <p className="font-body whitespace-pre-line text-white/88 text-sm sm:text-[1rem] mt-3 max-w-[42ch] leading-relaxed line-clamp-3 sm:line-clamp-none">
              {heroDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Breadcrumb and Search */}
      <div className="border-b border-border bg-white px-3 sm:px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-body text-xs sm:text-sm text-muted-foreground min-w-0">
            <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <span>/</span>
            {slug ? (
              <>
                <Link to="/shop" className="hover:text-primary transition-colors">Sản phẩm</Link>
                <span>/</span>
                <span className="text-foreground font-medium">{category.name}</span>
              </>
            ) : (
              <span className="text-foreground font-medium">{ALL_CATALOG.name}</span>
            )}
          </div>

          <div className="w-full min-w-0 sm:max-w-xs relative shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full min-w-0 pl-9 pr-8 py-2 sm:py-1.5 border border-border rounded-full font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all bg-muted/20 hover:bg-muted/40"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 w-full min-w-0">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 min-w-0">
          {/* Sidebar: drawer &lt; lg, cột cố định ≥ lg */}
          <aside
            id="shop-filter-sidebar"
            className={[
              "flex-shrink-0 transition-[transform,width,min-width,opacity] duration-300 ease-out",
              "fixed z-[50] top-20 sm:top-24 bottom-0 left-0 lg:relative lg:top-auto lg:bottom-auto lg:left-auto lg:z-auto",
              "w-[min(17.5rem,calc(100vw-1.25rem))] max-w-[90vw] lg:max-w-none",
              sidebarOpen ? "translate-x-0" : "-translate-x-full pointer-events-none lg:translate-x-0 lg:pointer-events-auto",
              sidebarOpen
                ? "lg:w-[15.5rem] lg:min-w-[15.5rem]"
                : "lg:w-0 lg:min-w-0 lg:overflow-hidden lg:opacity-0 lg:pointer-events-none",
              "overflow-y-auto overscroll-contain bg-background lg:bg-transparent py-4 pl-3 pr-3 sm:pl-4 sm:pr-4 lg:p-0 shadow-2xl lg:shadow-none rounded-r-2xl lg:rounded-none",
            ].join(" ")}
            aria-hidden={!sidebarOpen ? true : undefined}
          >
            <div className="flex items-center justify-between gap-2 pb-3 mb-1 border-b border-border/80 lg:hidden shrink-0">
              <span className="font-heading font-bold text-sm text-foreground">Bộ lọc</span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav
              className="rounded-2xl border border-border/90 bg-white p-3 sm:p-4 shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.02] space-y-6 sm:space-y-7"
              aria-label="Lọc sản phẩm"
            >
              <div>
                <h3 className="font-heading font-bold text-xs text-foreground uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                  <LayoutGrid className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden />
                  Danh mục
                </h3>
                <ul className="space-y-1">
                  <li>
                    <NavLink to="/shop" end className={({ isActive }) => sidebarNavClasses(isActive)} onClick={closeSidebarIfMobile}>
                      Tất cả sản phẩm
                    </NavLink>
                  </li>
                  {Object.values(categories).map((c) => (
                    <li key={c.slug}>
                      <NavLink
                        to={`/shop/${c.slug}`}
                        className={({ isActive }) => sidebarNavClasses(isActive)}
                        onClick={closeSidebarIfMobile}
                      >
                        {c.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="h-px bg-gradient-to-r from-border via-border/60 to-transparent" aria-hidden />

              <div>
                <h3 className="font-heading font-bold text-xs text-foreground uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                  <Banknote className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden />
                  Lọc theo giá
                </h3>
                <div className="space-y-1" role="radiogroup" aria-label="Khoảng giá">
                  {PRICE_RANGES.map((range, i) => {
                    const selected = priceRange === i;
                    return (
                      <button
                        key={range.label}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => {
                          setPriceRange(i);
                          closeSidebarIfMobile();
                        }}
                        className={sidebarPriceClasses(selected)}
                      >
                        <span className="flex items-start gap-2.5">
                          <span
                            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full border-2 transition-colors duration-200 ${selected ? "border-primary bg-primary shadow-[0_0_0_3px_hsl(var(--primary)_/_0.15)]" : "border-muted-foreground/40 bg-background group-hover:border-primary/55"}`}
                            aria-hidden
                          />
                          <span>{range.label}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </nav>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0 w-full lg:w-auto">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-3 mb-5 sm:mb-6 min-w-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen((o) => !o)}
                  className="flex items-center gap-2 font-body text-sm text-muted-foreground border border-border rounded-lg px-3 py-2.5 sm:py-2 hover:border-primary hover:text-primary transition-all shrink-0"
                  aria-expanded={sidebarOpen}
                  aria-controls="shop-filter-sidebar"
                >
                  <SlidersHorizontal className="w-4 h-4 shrink-0" />
                  Bộ lọc
                </button>
                <span className="font-body text-xs sm:text-sm text-muted-foreground whitespace-nowrap">{catProducts.length} sản phẩm</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="font-body text-sm border border-border rounded-lg px-3 py-2.5 sm:py-2 focus:outline-none focus:border-primary w-full min-w-0 sm:w-auto sm:min-w-[12rem] max-w-full bg-background"
              >
                <option value="default">Sắp xếp mặc định</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
            </div>

            {/* Grid */}
            {catProducts.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground font-body">
                Không tìm thấy sản phẩm phù hợp
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
                  {paginatedProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      className="h-full relative"
                      style={{ zIndex: hoveredProductId === product.id ? 40 : 10 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <ProductCard
                        product={product}
                        isHovered={hoveredProductId === product.id}
                        onHover={setHoveredProductId}
                      />
                    </motion.div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors"
                    >
                      Trước
                    </button>

                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`h-9 min-w-9 px-3 rounded-lg text-sm font-semibold transition-colors ${
                          page === currentPage
                            ? "bg-primary text-white"
                            : "border border-border text-foreground hover:border-primary hover:text-primary"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors"
                    >
                      Sau
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, isHovered, onHover }) {
  return (
    <div
      className={`group flex flex-col h-full bg-background rounded-xl sm:rounded-2xl overflow-hidden transition-[transform,box-shadow,border-color] duration-300 ease-out relative ${
        isHovered
          ? "max-lg:border max-lg:shadow-md lg:-translate-y-2 lg:border-2 lg:border-primary/35 lg:shadow-[0_18px_50px_-12px_rgba(0,0,0,0.12),0_8px_24px_-8px_hsl(var(--primary)_/_0.22)]"
          : "border border-border lg:hover:-translate-y-1 lg:hover:border-primary/20 lg:hover:shadow-lg lg:hover:shadow-black/[0.06]"
      }`}
      onMouseEnter={() => onHover(product.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="relative aspect-square bg-muted/30 overflow-hidden">
        <div
          className={`absolute inset-0 origin-center transform-gpu transition-transform duration-500 motion-reduce:transition-none [transition-timing-function:cubic-bezier(0.33,1,0.68,1)] ${isHovered ? "lg:scale-[1.12] scale-100" : "scale-100"}`}
        >
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transform-gpu"
          />
        </div>
        {product.tag && (
          <span
            className={`absolute top-1.5 left-1.5 sm:top-2 sm:left-2 font-body text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full max-w-[calc(100%-1rem)] truncate ${TAG_COLORS[product.tag] || "bg-foreground text-background"}`}
          >
            {product.tag}
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="font-body text-xs font-semibold text-muted-foreground bg-background border border-border rounded-full px-3 py-1">Hết hàng</span>
          </div>
        )}
        {/* CTA: luôn hiện trên mobile; desktop dùng hover */}
        <div
          className={`absolute bottom-1.5 left-1.5 right-1.5 sm:bottom-2 sm:left-2 sm:right-2 transition-all duration-300 lg:opacity-0 lg:translate-y-4 ${isHovered ? "lg:opacity-100 lg:translate-y-0" : ""} max-lg:opacity-100 max-lg:translate-y-0`}
        >
          <Link
            to={`/product/${product.id}`}
            className="w-full bg-primary text-white font-body font-semibold text-[11px] sm:text-xs py-2 sm:py-2.5 rounded-lg sm:rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 hover:bg-primary/90 active:bg-primary/95 transition-colors min-h-[2.25rem] sm:min-h-0"
          >
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            Xem chi tiết
          </Link>
        </div>
      </div>

      <div className="p-2.5 sm:p-3.5 flex flex-col flex-1 min-h-0 min-w-0">
        <p className="font-body text-[9px] sm:text-[10px] text-primary font-bold uppercase tracking-wide truncate">{product.brand}</p>
        <h4 className="font-body font-medium text-xs sm:text-sm text-foreground mt-0.5 leading-snug line-clamp-2 break-words">{product.name}</h4>
        <div className="flex items-center gap-0.5 sm:gap-1 mt-1 sm:mt-1.5 mb-1 sm:mb-2 flex-wrap">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
          ))}
          <span className="font-body text-[9px] sm:text-[10px] text-muted-foreground ml-0.5">({product.reviews})</span>
        </div>
        <div className="flex items-baseline justify-between gap-1 mt-auto pt-1.5 sm:pt-2 min-w-0">
          <p className="font-heading font-bold text-xs sm:text-sm text-primary truncate">{formatPrice(product.price)}</p>
          {product.oldPrice && (
            <p className="font-body text-[9px] sm:text-[10px] text-muted-foreground line-through shrink-0">{formatPrice(product.oldPrice)}</p>
          )}
        </div>
      </div>
    </div>
  );
}
