import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { products as allProducts } from "@/lib/productData";

const products = [...allProducts]
   .filter((p) => p.tag === "Bán chạy" || p.rating >= 4.8)
   .sort((a, b) => b.rating - a.rating)
   .slice(0, 5);

// helper format short name
const getShortName = (name) => {
   if (name.includes("Anthos A3")) return "ANTHOS A3";
   if (name.includes("CS 9300")) return "CS 9300";
   if (name.includes("Grace X2")) return "GRACE X2";
   if (name.includes("VALO")) return "VALO GRAND";
   if (name.includes("PaX-i3D")) return "PAX-I3D";
   return name.split(" ")[0].toUpperCase();
}

export default function BestSellers() {
   const [activeIdx, setActiveIdx] = useState(0);
   const [quickView, setQuickView] = useState(null);

   const goNext = () => setActiveIdx((prev) => (prev + 1) % products.length);
   const goPrev = () => setActiveIdx((prev) => (prev - 1 + products.length) % products.length);

   // Prevent scroll when modal is open
   useEffect(() => {
      if (quickView) document.body.style.overflow = "hidden";
      else document.body.style.overflow = "auto";
      return () => { document.body.style.overflow = "auto"; }
   }, [quickView]);

   // Smooth, weighted spring for that premium cinematic feeling
   const SPRING = { type: "spring", stiffness: 90, damping: 20, mass: 1 };

   return (
      <section className="relative w-full h-[650px] lg:h-[800px] bg-[radial-gradient(ellipse_at_center,_#FFFFFF_0%,_#F4F4F5_100%)] overflow-hidden select-none flex items-center justify-center font-body text-foreground">

         {/* ── Subtle HD Dental Red Spotlight ── */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

         {/* ── Top Nav Header ── */}
         <div className="absolute top-8 left-0 right-0 px-8 flex justify-center items-center z-30 pointer-events-none">
            <div className="flex items-center gap-4 text-foreground/80 text-[10px] tracking-[0.3em] uppercase font-bold">
               <span className="w-12 h-[1px] bg-foreground/20 shadow-sm hidden sm:block" />
               BỘ SƯU TẬP KINH ĐIỂN
               <span className="w-12 h-[1px] bg-foreground/20 shadow-sm hidden sm:block" />
            </div>
         </div>

         {/* ── Background Typography (Parallax) ── */}
         <AnimatePresence mode="popLayout">
            <motion.div
               key={activeIdx}
               initial={{ opacity: 0, x: 50, scale: 0.98 }}
               animate={{ opacity: 1, x: 0, scale: 1 }}
               exit={{ opacity: 0, x: -50, scale: 1.02 }}
               transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
               className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -translate-y-8 md:-translate-y-12"
            >
               <div className="flex justify-between items-end w-full max-w-[90vw] md:max-w-[70vw] mb-0 px-4">
                  <span className="text-foreground/80 text-[16px] md:text-3xl font-heading tracking-[0.1em] md:tracking-widest uppercase font-bold">HD DENTAL</span>
                  <span className="text-foreground/80 text-[16px] md:text-3xl font-heading tracking-[0.1em] md:tracking-widest uppercase font-bold">ĐÁNH GIÁ CAO</span>
               </div>
               <h2 className="font-heading font-black uppercase whitespace-nowrap text-transparent [-webkit-text-stroke:2px_rgba(0,0,0,0.06)] drop-shadow-sm" style={{ fontSize: "clamp(6rem, 19vw, 22rem)", lineHeight: 0.8, letterSpacing: "-0.02em" }}>
                  {getShortName(products[activeIdx].name)}
               </h2>
            </motion.div>
         </AnimatePresence>

         {/* ── Slider Container ── */}
         <div className="relative w-full h-full max-w-[1920px] mx-auto flex items-center justify-center z-10 pointer-events-none">
            {products.map((product, idx) => {
               let position = "center";
               if (idx === activeIdx) position = "center";
               else if (idx === (activeIdx - 1 + products.length) % products.length) position = "left";
               else if (idx === (activeIdx + 1) % products.length) position = "right";
               else position = "hidden";

               const isCenter = position === "center";
               const isLeft = position === "left";
               const isRight = position === "right";

               let xOffset = "0%";
               let scale = 1;
               let opacity = 1;
               let zIndex = 10;
               let blur = "blur(0px)";

               if (isLeft) {
                  xOffset = "-65vw"; // Peaking exactly half
                  scale = 0.55;
                  opacity = 1;
                  zIndex = 5;
               } else if (isRight) {
                  xOffset = "65vw";
                  scale = 0.55;
                  opacity = 1;
                  zIndex = 5;
               } else if (!isCenter) {
                  opacity = 0;
                  scale = 0.4;
                  zIndex = 0;
                  if (idx < activeIdx) xOffset = "-100vw";
                  else xOffset = "100vw";
               }

               return (
                  <motion.div
                     key={product.id}
                     className="absolute top-0 w-[50vw] sm:w-[60vw] max-w-[600px] h-full flex flex-col items-center justify-center cursor-pointer pointer-events-auto"
                     initial={false}
                     animate={{ x: xOffset, scale, opacity, zIndex, filter: blur }}
                     transition={SPRING}
                     onClick={() => {
                        if (isLeft) goPrev();
                        if (isRight) goNext();
                     }}
                  >
                     <div className="relative w-full flex items-center justify-center -translate-y-8 md:-translate-y-12">
                        <img
                           src={product.image}
                           alt={product.name}
                           className="h-auto max-h-[45vh] lg:max-h-[50vh] object-contain pointer-events-none z-10 drop-shadow-2xl"
                        />

                        {/* Đổ bóng tĩnh (fake floor shadow) */}
                        <div className="absolute -bottom-5 lg:-bottom-8 w-[65%] h-[20px] bg-black/10 blur-xl rounded-[100%] pointer-events-none" />
                     </div>
                  </motion.div>
               );
            })}
         </div>

         {/* ── Bottom Controls (Pagination & Info) ── */}
         <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 z-30 flex flex-col items-center pointer-events-none">

            {/* Line Pagination */}
            <div className="flex items-center gap-0 mb-6 sm:mb-8 pointer-events-auto">
               <button onClick={goPrev} className="w-1.5 h-1.5 rounded-full bg-foreground/30 hover:bg-primary hover:scale-150 transition-all cursor-pointer shadow-sm" />
               <div className="w-12 sm:w-20 md:w-32 border-t border-dashed border-foreground/15" />
               <div className="w-4 h-4 rounded-full border-[1.5px] border-primary/50 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(227,0,15,0.4)]" />
               </div>
               <div className="w-12 sm:w-20 md:w-32 border-t border-dashed border-foreground/15" />
               <button onClick={goNext} className="w-1.5 h-1.5 rounded-full bg-foreground/30 hover:bg-primary hover:scale-150 transition-all cursor-pointer shadow-sm" />
            </div>

            {/* Info Text */}
            <AnimatePresence mode="wait">
               <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-center px-4"
               >
                  <p className="text-foreground/80 text-[8px] sm:text-[9.5px] uppercase font-bold tracking-[0.2em] leading-[1.8] max-w-[650px] mb-6 sm:mb-8 mx-auto line-clamp-3">
                     {products[activeIdx].description}
                  </p>
                  <button onClick={() => setQuickView(products[activeIdx])} className="inline-block pointer-events-auto bg-primary border-none text-white hover:bg-red-700 text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-full transition-all duration-300 drop-shadow-md">
                     KHÁM PHÁ THÊM
                  </button>
               </motion.div>
            </AnimatePresence>
         </div>

         <div className="absolute bottom-8 right-8 md:bottom-12 md:right-16 flex items-center gap-4 z-40 pointer-events-auto">
            <span className="text-foreground/80 text-[10px] sm:text-xs font-bold tracking-widest mr-2 font-heading">
               0{activeIdx + 1} / 0{products.length}
            </span>
            <button onClick={goPrev} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-foreground/15 hover:bg-primary hover:text-white hover:border-primary shadow-sm flex flex-col items-center justify-center transition-all text-foreground/60">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button onClick={goNext} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-foreground/15 hover:bg-primary hover:text-white hover:border-primary shadow-sm flex flex-col items-center justify-center transition-all text-foreground/60">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>
         </div>

         {/* ── Quick View Modal ── */}
         <AnimatePresence>
            {quickView && (
               <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 md:p-12 text-[#111] backdrop-blur-md"
                  initial={{ opacity: 0, backgroundColor: "rgba(0,0,0,0)" }}
                  animate={{ opacity: 1, backgroundColor: "rgba(0,0,0,0.6)" }}
                  exit={{ opacity: 0, backgroundColor: "rgba(0,0,0,0)" }}
                  onClick={() => setQuickView(null)}
               >
                  <motion.div
                     className="relative w-full max-w-[1200px] bg-white h-[90vh] max-h-[800px] flex flex-col md:flex-row shadow-2xl overflow-hidden rounded-[2px]"
                     initial={{ y: 80, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     exit={{ y: 40, opacity: 0 }}
                     transition={{ type: "spring", stiffness: 90, damping: 20 }}
                     onClick={(e) => e.stopPropagation()}
                  >
                     {/* CLOSE BUTTON */}
                     <button className="absolute top-6 right-6 z-20 text-black/40 hover:text-black transition-colors" onClick={() => setQuickView(null)}>
                        <X className="w-6 h-6" />
                     </button>

                     {/* LEFT: IMAGE (LIGHT GREY STUDIO BG) */}
                     <div className="w-full md:w-[55%] h-[40%] md:h-full bg-[#E5E5E5] flex flex-col items-center justify-center relative shrink-0">
                        <motion.img
                           src={quickView.image}
                           className="w-[85%] h-[85%] object-contain drop-shadow-xl z-10"
                           initial={{ opacity: 0, scale: 0.8, y: 40 }}
                           animate={{ opacity: 1, scale: 1, y: 0 }}
                           transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
                        />
                        {/* Shadow under item inside modal */}
                        <div className="absolute bottom-[10%] w-[60%] h-[15px] bg-black/20 blur-xl rounded-[100%] pointer-events-none" />
                     </div>

                     {/* RIGHT: CONTENT */}
                     <div className="w-full md:w-[45%] h-[60%] md:h-full p-8 md:p-12 flex flex-col overflow-y-auto relative">
                        <div>
                           {/* HEADER: LOGO + NAME */}
                           <div className="flex items-center gap-4 mb-6 md:mb-8 mt-4 md:mt-0">
                              {/* Fake Brand Logo Circle */}
                              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-black flex items-center justify-center font-black text-xs md:text-sm tracking-tighter">
                                 {quickView.brand.substring(0, 3).toUpperCase()}
                              </div>
                              <h2 className="text-4xl md:text-5xl lg:text-7xl font-heading font-black uppercase text-black tracking-tighter leading-none" style={{ letterSpacing: "-0.04em", transform: "scaleY(1.1)", transformOrigin: "bottom" }}>
                                 {getShortName(quickView.name)}
                              </h2>
                           </div>

                           {/* DESCRIPTION */}
                           <p className="text-[#888] text-[9px] md:text-[10px] leading-loose font-bold mb-8 uppercase" style={{ letterSpacing: "0.15em" }}>
                              {quickView.description}
                           </p>

                           {/* SPECS */}
                           <div className="space-y-3 sm:space-y-4 text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-[#999]">
                              <div className="flex">
                                 <span className="w-32 sm:w-40">Thương hiệu</span>
                                 <span className="text-black">{quickView.brand}</span>
                              </div>
                              <div className="flex">
                                 <span className="w-32 sm:w-40">Danh mục</span>
                                 <span className="text-black">{quickView.category.replace("-", " ")}</span>
                              </div>
                              <div className="flex">
                                 <span className="w-32 sm:w-40">Đánh giá</span>
                                 <span className="text-black">{quickView.rating} / 5.0 ({quickView.reviews})</span>
                              </div>
                              <div className="flex">
                                 <span className="w-32 sm:w-40">Tình trạng</span>
                                 <span className="text-black">Sản phẩm mới</span>
                              </div>
                              <div className="flex mt-8 md:mt-12 pt-4 border-t border-[#EEE]">
                                 <span className="w-32 sm:w-40 text-black">Giá niêm yết</span>
                                 <span className="text-black">{quickView.price.toLocaleString("vi")} ₫</span>
                              </div>
                           </div>
                        </div>

                        {/* CTA BUTTON - BOTTOM RIGHT */}
                        <div className="mt-8 md:mt-auto self-start md:self-end md:absolute md:bottom-12 md:right-12">
                           <Link to={`/product/${quickView.id}`} className="bg-[#E3000F] text-white hover:bg-black text-[9px] md:text-[10px] font-black uppercase px-6 py-3 md:px-8 md:py-4 transition-colors flex items-center gap-3 drop-shadow-lg rounded-sm">
                              Mua / Đặt hàng tại đây
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                           </Link>
                        </div>
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>

      </section>
   );
}
