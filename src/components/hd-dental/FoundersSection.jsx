import React from "react";
import { motion } from "framer-motion";
import useScrollReveal from "./useScrollReveal";

const founders = [
  {
    name: "Nguyễn Thanh Văn",
    role: "CEO & Đồng sáng lập",
    image: "https://vcdn1-kinhdoanh.vnecdn.net/2021/02/05/3-1-1612513233-7959-1612513323.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=KExmq1x6m9hYfS5aZ4YHdQ",
    desc: "Hơn 15 năm kinh nghiệm trong lĩnh vực thiết bị y tế. Tầm nhìn đưa HD Dental trở thành thương hiệu hàng đầu Đông Nam Á.",
  },
  {
    name: "Trần Hoàng Nam",
    role: "CTO & Đồng sáng lập",
    image: "https://nhakhoabsninh.com/wp-content/uploads/2025/11/bs-dang-e1764504600468.jpg",
    desc: "Chuyên gia công nghệ nha khoa số, tiên phong ứng dụng AI và CAD/CAM trong lĩnh vực nha khoa Việt Nam.",
  },
  {
    name: "Nguyễn Hữu Đắc",
    role: "COO & Đồng sáng lập",
    image: "https://cafefcdn.com/203337114487263232/2026/2/25/z75617835068752e2c375e4079669dfc28748ca14d72e8-1771992389898-1771992390299185111743.jpg",
    desc: "Quản lý vận hành xuất sắc, xây dựng hệ thống phân phối trải dài 63 tỉnh thành với dịch vụ hậu mãi vượt trội.",
  },
];

export default function FoundersSection() {
  const { ref, isVisible } = useScrollReveal(0.15);

  return (
    <section id="founders" className="scroll-mt-24 py-24 lg:py-32 bg-foreground" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="font-body text-primary text-sm font-bold uppercase tracking-[0.2em]">Ban sáng lập</span>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-background mt-4">
            Đồng sáng lập
          </h2>
          <p className="font-body text-background/55 text-sm mt-3 max-w-xl mx-auto">
            Đội ngũ định hướng chiến lược và vận hành HD Dental.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {founders.map((founder, i) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              className="group relative cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-full h-[420px] lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Red shadow on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 shadow-[inset_0_0_60px_rgba(226,31,38,0.8)]" />
                
                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-heading font-bold text-xl text-white">{founder.name}</h3>
                  <p className="font-body text-primary text-sm font-semibold mt-1">{founder.role}</p>
                  {/* Slide up description */}
                  <div className="overflow-hidden max-h-0 group-hover:max-h-40 transition-all duration-500 ease-out">
                    <p className="font-body text-white/80 text-sm mt-3 leading-relaxed">
                      {founder.desc}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
