import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Monitor, GraduationCap, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Palette,
    title: "Thiết kế phòng khám",
    subtitle: "Thiết kế phòng khám",
    desc: "Tư vấn và thiết kế phòng khám nha khoa chuyên nghiệp, tối ưu không gian làm việc và trải nghiệm bệnh nhân. Từ bản vẽ đến thi công hoàn thiện.",
    image: "https://media.base44.com/images/public/69cff7a985a4c7940dcab568/f114a4731_generated_image.png",
    accent: "bg-primary",
    num: "01",
    tag: "Thiết kế",
  },
  {
    icon: Monitor,
    title: "Thiết bị nha khoa",
    subtitle: "Thiết bị nha khoa",
    desc: "Phân phối độc quyền các thương hiệu thiết bị nha khoa hàng đầu thế giới. Ghế nha khoa, máy chụp X-quang, đèn trám composite và hàng trăm sản phẩm chất lượng cao.",
    image: "https://media.base44.com/images/public/69cff7a985a4c7940dcab568/a9e78f522_generated_image.png",
    accent: "bg-white",
    accentText: "text-black",
    num: "02",
    tag: "Thiết bị",
  },
  {
    icon: GraduationCap,
    title: "Đào tạo chuyên sâu",
    subtitle: "HD Academy",
    desc: "HD Academy — Trung tâm đào tạo kỹ thuật nha khoa với đội ngũ giảng viên quốc tế. Các khóa học từ cơ bản đến nâng cao cho nha sĩ Việt Nam.",
    image: "https://media.base44.com/images/public/69cff7a985a4c7940dcab568/8174e0e9a_generated_image.png",
    accent: "bg-primary",
    num: "03",
    tag: "Học viện",
  },
];

const EASE = [0.76, 0, 0.24, 1];
const DUR = 0.65;

export default function ServicesSection() {
  const [active, setActive] = useState(/** @type {number | null} */ (null));

  return (
    <section id="services" className="scroll-mt-24 relative bg-[#080808] overflow-hidden py-24 lg:py-32">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 lg:px-12 mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="font-body text-primary text-xs font-bold uppercase tracking-[0.3em]">Dịch vụ của chúng tôi</span>
          <h2 className="font-heading font-bold text-5xl lg:text-7xl text-white mt-4 leading-none">
            Nền tảng<br /><span className="text-white/20">dịch vụ</span>
          </h2>
        </div>
        <p className="font-body text-white/40 text-sm max-w-xs leading-relaxed md:text-right">
          Ba trụ cột tạo nên hệ sinh thái nha khoa toàn diện của HD Dental.
        </p>
      </div>

      {/* Divider top */}
      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        <div className="w-full h-px bg-white/10 mb-0" />
      </div>

      {/* Service rows */}
      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        {services.map((service, i) => (
          <ServiceRow
            key={service.num}
            service={service}
            isActive={active === i}
            anyActive={active !== null}
            onEnter={() => setActive(i)}
            onLeave={() => setActive(null)}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * @param {{
 *   service: (typeof services)[0];
 *   isActive: boolean;
 *   anyActive: boolean;
 *   onEnter: () => void;
 *   onLeave: () => void;
 * }} props
 */
function ServiceRow({ service, isActive, anyActive, onEnter, onLeave }) {
  const Icon = service.icon;
  const accentText = service.accentText || "text-white";

  return (
    <motion.div
      className="relative border-b border-white/10 overflow-hidden cursor-pointer"
      animate={{ height: isActive ? 420 : 90 }}
      transition={{ duration: DUR, ease: EASE }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* ── IDLE ROW LABEL ── */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[90px] flex items-center justify-between px-2 z-10 pointer-events-none"
        animate={{ opacity: isActive ? 0 : anyActive ? 0.35 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Number */}
        <span className="font-heading font-bold text-xs text-white/20 tracking-widest w-12 flex-shrink-0">
          {service.num}
        </span>

        {/* Title */}
        <h3
          className="font-heading font-bold text-2xl md:text-3xl text-white flex-1 px-6"
          style={{ transition: `color 0.3s` }}
        >
          {service.title}
        </h3>

        {/* Tag pill */}
        <span className="hidden md:block font-body text-[10px] text-white/30 font-semibold uppercase tracking-widest border border-white/10 rounded-full px-3 py-1 mr-4">
          {service.tag}
        </span>

        {/* Arrow */}
        <motion.div
          animate={{ rotate: isActive ? 45 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0"
        >
          <ArrowRight className="w-3.5 h-3.5 text-white/50" />
        </motion.div>
      </motion.div>

      {/* ── ACTIVE EXPANDED CONTENT ── */}
      <AnimatePresence>
        {isActive && (
          <div className="absolute inset-0 flex overflow-hidden">
            {/* LEFT: Text */}
            <motion.div
              className="relative z-20 flex flex-col justify-center h-full bg-[#0e0e0e]"
              style={{ width: "42%" }}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: DUR, ease: EASE }}
            >
              {/* Watermark number */}
              <span className="absolute top-6 right-6 font-heading font-black text-[120px] text-white/[0.03] leading-none select-none pointer-events-none">
                {service.num}
              </span>

              <div className="px-10 lg:px-14">
                {/* Icon */}
                <motion.div
                  className={`w-12 h-12 rounded-2xl ${service.accent} flex items-center justify-center mb-6`}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: EASE }}
                >
                  <Icon className={`w-6 h-6 ${accentText}`} />
                </motion.div>

                {/* Subtitle */}
                <motion.p
                  className="font-body text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.35 }}
                >
                  {service.subtitle}
                </motion.p>

                {/* Title */}
                <motion.h3
                  className="font-heading font-bold text-3xl lg:text-4xl text-white leading-tight mb-4"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.27, duration: 0.4 }}
                >
                  {service.title}
                </motion.h3>

                {/* Desc */}
                <motion.p
                  className="font-body text-white/50 text-sm leading-relaxed mb-7 max-w-xs"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32, duration: 0.4 }}
                >
                  {service.desc}
                </motion.p>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38, duration: 0.35 }}
                >
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 bg-primary text-white font-body font-semibold text-xs px-6 py-3 rounded-full hover:bg-primary/90 transition-all group"
                  >
                    Xem sản phẩm
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* RIGHT: Image */}
            <motion.div
              className="relative overflow-hidden"
              style={{ width: "58%" }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: DUR, ease: EASE }}
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
              />

              {/* Subtle gradient bleed */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e]/50 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Top-right: service num */}
              <motion.div
                className="absolute top-6 right-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                <span className="font-heading font-black text-white/20 text-6xl leading-none">
                  {service.num}
                </span>
              </motion.div>

              {/* Bottom glass badge */}
              <motion.div
                className="absolute bottom-6 left-6"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <div className="bg-white/[0.08] backdrop-blur-xl border border-white/15 rounded-2xl px-5 py-3.5">
                  <p className="font-heading font-bold text-white text-base">{service.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <p className="font-body text-white/50 text-xs">{service.subtitle}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
