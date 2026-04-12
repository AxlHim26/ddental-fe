"use client";

import React, { useState, useMemo } from "react";

import { useParams, Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, Star, ArrowRight, Search, X } from "lucide-react";
import { products, categories } from "../lib/productData";
import ShopNavbar from "../components/hd-dental/ShopNavbar";

const TAG_COLORS = {
  "Best Seller": "bg-primary text-white",
  "Hot": "bg-orange-500 text-white",
  "Mới": "bg-green-600 text-white",
  "Sale": "bg-primary text-white",
  "Premium": "bg-foreground text-background",
};

const PRICE_RANGES = [
  { label: "Tất cả", min: 0, max: Infinity },
  { label: "Dưới 10 triệu", min: 0, max: 10000000 },
  { label: "10 - 50 triệu", min: 10000000, max: 50000000 },
  { label: "50 - 200 triệu", min: 50000000, max: 200000000 },
  { label: "Trên 200 triệu", min: 200000000, max: Infinity },
];

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
  const category = slug ? categories[slug] : null;
  const isAllProducts = !slug;
  const activeCategory = isAllProducts ? ALL_CATALOG : category;

  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState("default");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hoveredProductId, setHoveredProductId] = useState(null);

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

  if (slug && !category) return <div className="p-8 text-center font-body">Danh mục không tồn tại</div>;

  return (
    <div className="min-h-screen bg-background font-body relative pt-20 sm:pt-24">
      <ShopNavbar onSearch={setSearch} searchValue={search} />

      {/* ── Global Black Overlay on Hover ── */}
      <div
        className={`fixed inset-0 bg-black/20 z-30 pointer-events-none transition-opacity duration-500 ease-out ${hoveredProductId ? "opacity-100" : "opacity-0"}`}
      />

      {/* Banner */}
      <div className="relative h-48 lg:h-64 overflow-hidden">
        <img src={activeCategory.banner} alt={activeCategory.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        <div className="absolute inset-0 flex items-center px-8 max-w-7xl mx-auto">
          <div>
            <p className="font-body text-primary text-xs font-bold uppercase tracking-widest">HD Dental</p>
            <h1 className="font-heading font-bold text-3xl lg:text-5xl text-white mt-1">{activeCategory.name}</h1>
            <p className="font-body text-white/70 text-sm mt-2 max-w-md">{activeCategory.description}</p>
          </div>
        </div>
      </div>

      {/* Breadcrumb and Search */}
      <div className="border-b border-border bg-white px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-body text-sm text-muted-foreground">
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

          <div className="w-full sm:max-w-xs relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Nhập tên sản phẩm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 border border-border rounded-full font-body text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all bg-muted/20 hover:bg-muted/40"
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`${sidebarOpen ? "w-56" : "w-0 overflow-hidden"} flex-shrink-0 transition-all duration-300`}>
            <div className="space-y-6">
              {/* Danh mục trước — chọn “tất cả” hoặc từng nhóm */}
              <div>
                <h3 className="font-heading font-bold text-sm text-foreground mb-3 uppercase tracking-wide">Danh mục</h3>
                <div className="space-y-1.5">
                  <NavLink
                    to="/shop"
                    end
                    className={({ isActive }) =>
                      `block font-body text-sm px-3 py-2 rounded-lg transition-all ${isActive ? "bg-primary text-white font-semibold" : "text-muted-foreground hover:bg-muted hover:text-primary"
                      }`
                    }
                  >
                    Tất cả sản phẩm
                  </NavLink>
                  {Object.values(categories).map((c) => (
                    <NavLink
                      key={c.slug}
                      to={`/shop/${c.slug}`}
                      className={({ isActive }) =>
                        `block font-body text-sm px-3 py-2 rounded-lg transition-all ${isActive ? "bg-primary text-white font-semibold" : "text-muted-foreground hover:bg-muted hover:text-primary"
                        }`
                      }
                    >
                      {c.name}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Lọc theo giá */}
              <div>
                <h3 className="font-heading font-bold text-sm text-foreground mb-3 uppercase tracking-wide">Lọc theo giá</h3>
                <div className="space-y-1.5">
                  {PRICE_RANGES.map((range, i) => (
                    <button
                      key={i}
                      onClick={() => setPriceRange(i)}
                      className={`w-full text-left font-body text-sm px-3 py-2 rounded-lg transition-all ${priceRange === i ? "bg-primary text-white font-semibold" : "hover:bg-muted text-muted-foreground"
                        }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="flex items-center gap-2 font-body text-sm text-muted-foreground border border-border rounded-lg px-3 py-2 hover:border-primary hover:text-primary transition-all"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Bộ lọc
                </button>
                <span className="font-body text-sm text-muted-foreground">{catProducts.length} sản phẩm</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="font-body text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
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
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {catProducts.map((product, i) => (
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
      className={`group flex flex-col h-full bg-background border border-border rounded-2xl overflow-hidden transition-all duration-400 relative ${isHovered ? "scale-105 shadow-2xl ring-2 ring-primary border-transparent" : "hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5"}`}
      onMouseEnter={() => onHover(product.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="relative aspect-square bg-muted/30 overflow-hidden">
        {/* Default image */}
        <img
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${isHovered ? "scale-110 opacity-0" : "scale-100 opacity-100"}`}
        />
        {/* Alternate square image if available */}
        {product.images && product.images[0] && (
          <img
            src={product.images[0]}
            alt={`${product.name} alternate`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${isHovered ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
          />
        )}
        {product.tag && (
          <span className={`absolute top-2 left-2 font-body text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${TAG_COLORS[product.tag] || "bg-foreground text-background"}`}>
            {product.tag}
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="font-body text-xs font-semibold text-muted-foreground bg-background border border-border rounded-full px-3 py-1">Hết hàng</span>
          </div>
        )}
        {/* Shop now on hover */}
        <div
          className={`absolute bottom-2 left-2 right-2 transition-all duration-300 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <Link
            to={`/product/${product.id}`}
            className="w-full bg-primary text-white font-body font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            Shop Now
          </Link>
        </div>
      </div>

      <div className="p-3.5 flex flex-col flex-1">
        <p className="font-body text-[10px] text-primary font-bold uppercase tracking-wide">{product.brand}</p>
        <h4 className="font-body font-medium text-sm text-foreground mt-0.5 leading-snug line-clamp-2">{product.name}</h4>
        <div className="flex items-center gap-1 mt-1.5 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
          ))}
          <span className="font-body text-[10px] text-muted-foreground ml-0.5">({product.reviews})</span>
        </div>
        <div className="flex items-baseline justify-between gap-1 mt-auto pt-2">
          <p className="font-heading font-bold text-sm text-primary">{formatPrice(product.price)}</p>
          {product.oldPrice && (
            <p className="font-body text-[10px] text-muted-foreground line-through">{formatPrice(product.oldPrice)}</p>
          )}
        </div>
      </div>
    </div>
  );
}
