import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { E, Reveal } from "@/lib/animations";

const milestones = [
  {
    year: "2010",
    title: "Khởi đầu",
    content: "HD Dental được thành lập tại TP.HCM với đội ngũ 5 thành viên và 1 showroom nhỏ, tập trung phân phối thiết bị nha khoa cơ bản cho các phòng khám tư nhân.",
  },
  {
    year: "2015",
    title: "Mở rộng quy mô",
    content: "Đạt mốc 1,000 khách hàng, mở rộng mạng lưới phân phối ra 20 tỉnh thành. Ký kết hợp tác độc quyền với nhiều thương hiệu nha khoa hàng đầu thế giới.",
  },
  {
    year: "2020",
    title: "Chuyển đổi số",
    content: "Triển khai nền tảng thương mại điện tử, ứng dụng AI trong tư vấn giải pháp nha khoa. Ra mắt Trung tâm Đào tạo HD Academy phục vụ cộng đồng nha sĩ.",
  },
  {
    year: "2025",
    title: "Vươn tầm khu vực",
    content: "Trở thành nhà phân phối thiết bị nha khoa lớn nhất Việt Nam, mở rộng thị trường sang Campuchia, Lào và Myanmar. Hướng tới mục tiêu 10,000 khách hàng.",
  },
];

export default function TimelineSection() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1); // 1 = forward, -1 = backward

  const go = (i) => {
    setDir(i > active ? 1 : -1);
    setActive(i);
  };

  return (
    <section id="timeline" className="py-24 lg:py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        {/* Heading */}
        <Reveal className="text-center mb-16">
          <span className="font-body text-primary text-xs font-bold uppercase tracking-[0.3em] mb-3 block">Hành trình</span>
          <h2 className="font-heading font-black text-4xl md:text-5xl text-foreground leading-tight">
            LỊCH SỬ <span className="text-primary">PHÁT TRIỂN</span>
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto mt-5" />
        </Reveal>

        {/* Horizontal timeline */}
        <Reveal delay={0.2} className="relative flex items-center justify-between max-w-3xl mx-auto mb-20">
          {/* Track */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2" />
          <motion.div
            className="absolute top-1/2 left-0 h-px bg-primary -translate-y-1/2 origin-left"
            animate={{ width: `${(active / (milestones.length - 1)) * 100}%` }}
            transition={{ duration: 0.6, ease: E }}
          />

          {milestones.map((m, i) => (
            <button
              key={m.year}
              onClick={() => go(i)}
              className="relative z-10 flex flex-col items-center gap-3 group"
            >
              {/* Glow ring around active */}
              {i === active && (
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-primary/10"
                  layoutId="timeline-glow"
                  transition={{ duration: 0.4, ease: E }}
                />
              )}
              <div
                className={`relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                  i === active
                    ? "bg-primary border-primary scale-110 shadow-lg shadow-primary/30"
                    : i < active
                    ? "bg-primary/20 border-primary"
                    : "bg-background border-border group-hover:border-primary/50"
                }`}
              >
                <span className={`font-heading font-bold text-xs ${
                  i === active ? "text-white" : i < active ? "text-primary" : "text-muted-foreground"
                }`}>
                  {m.year}
                </span>
              </div>
              <span className={`font-body text-xs font-semibold transition-colors hidden md:block ${
                i === active ? "text-primary" : "text-muted-foreground"
              }`}>
                {m.title}
              </span>
            </button>
          ))}
        </Reveal>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: dir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -60 }}
            transition={{ duration: 0.45, ease: E }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.h3
              className="font-heading font-black text-8xl md:text-9xl text-primary/[0.07] leading-none mb-2 select-none"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: E }}
            >
              {milestones[active].year}
            </motion.h3>
            <h4 className="font-heading font-bold text-2xl text-foreground mb-4 -mt-6">
              {milestones[active].title}
            </h4>
            <p className="font-body text-muted-foreground leading-relaxed text-base lg:text-lg">
              {milestones[active].content}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}