import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealX } from "@/lib/animations";

const categories = [
  {
    title: "Ghế Nha Khoa",
    subtitle: "Ghế nha khoa cao cấp",
    image: "https://media.base44.com/images/public/69cff7a985a4c7940dcab568/9d44d492a_generated_28f20030.png",
    count: "45+ sản phẩm",
    link: "/shop/ghe-nha-khoa",
    num: "01",
  },
  {
    title: "Đèn Trám - Đèn Tẩy Trắng",
    subtitle: "Đèn trám & tẩy trắng",
    image: "https://media.base44.com/images/public/69cff7a985a4c7940dcab568/6b1b734a3_generated_6271cc37.png",
    count: "30+ sản phẩm",
    link: "/shop/den-tram",
    num: "02",
  },
  {
    title: "Thiết Bị Chẩn Đoán Hình Ảnh",
    subtitle: "Chẩn đoán hình ảnh",
    image: "https://media.base44.com/images/public/69cff7a985a4c7940dcab568/5201dbde0_generated_d92d08c0.png",
    count: "60+ sản phẩm",
    link: "/shop/chan-doan",
    num: "03",
  },
];

export default function ProductsSection() {
  return (
    <section id="products" className="py-24 lg:py-32 bg-muted/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <RevealX x={-50}>
            <span className="font-body text-primary text-xs font-bold uppercase tracking-[0.3em] block mb-3">Danh mục</span>
            <h2 className="font-heading font-black text-4xl md:text-5xl text-foreground leading-tight">
              DANH MỤC <span className="text-primary">SẢN PHẨM</span>
            </h2>
            <div className="w-12 h-1 bg-primary rounded-full mt-5" />
          </RevealX>
          <Reveal delay={0.2}>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-primary text-white font-body text-sm font-bold px-6 py-3 rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5 group self-start md:self-auto"
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Reveal>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-7">
          {categories.map((cat, i) => (
            <Reveal key={cat.title} delay={0.1 + i * 0.12}>
              <CategoryCard category={cat} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="group relative rounded-3xl overflow-hidden cursor-pointer h-[420px] lg:h-[520px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ rotateY: -2, rotateX: 1 }}
      transition={{ duration: 0.4 }}
      style={{ transformPerspective: 1000 }}
    >
      {/* Image */}
      <motion.img
        src={category.image}
        alt={category.title}
        className="w-full h-full object-cover"
        animate={{ scale: hovered ? 1.1 : 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Overlay transition */}
      <div
        className={`absolute inset-0 transition-all ${
          hovered
            ? "bg-gradient-to-t from-primary via-primary/40 to-primary/5"
            : "bg-gradient-to-t from-black/80 via-black/20 to-transparent"
        }`}
        style={{ transitionDuration: "600ms" }}
      />

      {/* Number badge */}
      <motion.div
        className="absolute top-5 right-5 w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <span className="font-heading font-black text-white text-sm">{category.num}</span>
      </motion.div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-7 lg:p-8">
        <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-2">
          {category.count}
        </p>
        <h3 className="font-heading font-bold text-2xl lg:text-3xl text-white leading-tight">{category.title}</h3>
        <p className="font-body text-white/60 text-sm mt-1">{category.subtitle}</p>

        <motion.div
          animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.35 }}
          className="mt-5"
        >
          <Link
            to={category.link}
            className="inline-flex items-center gap-2 bg-white text-primary font-body font-bold text-sm px-6 py-3 rounded-full hover:bg-white/90 transition-colors shadow-xl"
          >
            <ArrowRight className="w-4 h-4" />
            Xem sản phẩm
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
