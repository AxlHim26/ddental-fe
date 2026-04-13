import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useScrollReveal from "./useScrollReveal";
import { Target, Eye, ArrowRight } from "lucide-react";
import { AnimatedNumber } from "@/lib/animations";

const tabs = [
  {
    id: "about",
    label: "Về chúng tôi",
    icon: null,
    heading: "Đồng hành cùng nha sĩ Việt Nam",
    body: "HD Dental được thành lập với sứ mệnh mang đến giải pháp nha khoa toàn diện, từ thiết bị hiện đại đến dịch vụ tư vấn chuyên nghiệp. Chúng tôi tin rằng mỗi nha sĩ đều xứng đáng được sử dụng công nghệ tốt nhất.",
    body2: "Với mạng lưới đối tác toàn cầu và đội ngũ kỹ thuật dày dặn kinh nghiệm, HD Dental cam kết đem đến sản phẩm chất lượng quốc tế với dịch vụ hậu mãi tận tâm nhất.",
  },
  {
    id: "mission",
    label: "Sứ mệnh",
    icon: Target,
    heading: "Sứ mệnh của chúng tôi",
    body: "Nâng cao chất lượng chăm sóc sức khỏe răng miệng tại Việt Nam bằng cách cung cấp các thiết bị và công nghệ nha khoa tiên tiến nhất, giúp mỗi phòng khám trở nên chuyên nghiệp và hiệu quả hơn.",
    body2: "Chúng tôi cam kết đồng hành lâu dài với cộng đồng nha sĩ Việt Nam — không chỉ bán sản phẩm mà còn là người bạn đồng hành trên hành trình phát triển sự nghiệp.",
  },
  {
    id: "vision",
    label: "Tầm nhìn",
    icon: Eye,
    heading: "Tầm nhìn đến 2030",
    body: "Trở thành hệ sinh thái nha khoa số 1 Đông Nam Á — nơi kết nối nha sĩ, bệnh nhân và nhà cung cấp thiết bị trong một nền tảng công nghệ thống nhất, hiện đại và đáng tin cậy.",
    body2: "HD Dental hướng tới việc phục vụ 20,000 phòng khám trên toàn khu vực, xây dựng tiêu chuẩn chất lượng mới cho ngành nha khoa châu Á.",
  },
];

const statsConfig = [
  { value: 5000, label: "Khách hàng" },
  { value: 200, label: "Sản phẩm" },
  { value: 15, label: "Đối tác" },
];

/** @param {{ value: number; label: string; triggerKey: string; isVisible: boolean }} props */
function StatCard({ value, label, triggerKey, isVisible }) {
  return (
    <div className="text-center sm:text-left">
      <motion.p
        key={triggerKey} // Re-animate when tab changes
        className="font-heading font-bold text-2xl text-primary tabular-nums"
        initial={{ opacity: 0, y: 10 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
      >
        <AnimatedNumber value={value} suffix="+" />
      </motion.p>
      <p className="font-body text-muted-foreground text-sm mt-1">{label}</p>
    </div>
  );
}

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState("about");
  const { ref, isVisible } = useScrollReveal(0.15);
  const tab = tabs.find((t) => t.id === activeTab) ?? tabs[0];

  return (
    <section id="about" className="scroll-mt-24 py-24 lg:py-32 bg-background overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        {/* 50/50 Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* LEFT: Image */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden">
              <img
                src="https://media.base44.com/images/public/69cff7a985a4c7940dcab568/310517f13_generated_3f413930.png"
                alt="Văn phòng HD Dental"
                className="w-full h-[400px] lg:h-[560px] object-cover"
              />
            </div>
            {/* Floating stat badge */}
            <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-primary rounded-2xl flex items-center justify-center shadow-xl">
               <div className="text-center">
                  <p className="text-primary-foreground font-heading font-bold text-3xl">
                     <AnimatedNumber value={14} suffix="+" />
                  </p>
                  <p className="text-primary-foreground/80 font-body text-xs mt-1 leading-tight">Năm<br />kinh nghiệm</p>
               </div>
            </div>
            {/* Decorative ring */}
            <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full border-2 border-primary/20" />
          </motion.div>

          {/* RIGHT: Tabs + Content */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Tab switcher */}
            <div className="flex gap-2 mb-8 bg-muted rounded-xl p-1 w-fit">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`font-body text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                    activeTab === t.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.icon && <t.icon className="w-3.5 h-3.5" />}
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
              >
                {tab.icon && (
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <tab.icon className="w-6 h-6 text-primary" />
                  </div>
                )}
                <h3 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-5">
                  {tab.heading}
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed mb-4">{tab.body}</p>
                <p className="font-body text-muted-foreground leading-relaxed mb-8">{tab.body2}</p>

                <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-body font-semibold text-sm px-6 py-3 rounded-full hover:bg-primary/90 transition-all group">
                  Xem sản phẩm
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Stats — đếm 0 → mục tiêu mỗi khi đổi tab */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-12 pt-10 border-t border-border">
              {statsConfig.map((stat) => (
                <StatCard key={stat.label} value={stat.value} label={stat.label} triggerKey={activeTab} isVisible={isVisible} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
