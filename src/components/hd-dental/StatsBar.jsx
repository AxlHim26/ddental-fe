import React from "react";
import { Users, Package, Award, Star } from "lucide-react";
import { Reveal, AnimatedNumber } from "@/lib/animations";

const stats = [
  { value: 5000, suffix: "+", label: "Khách hàng tin tưởng", icon: Users },
  { value: 200, suffix: "+", label: "Sản phẩm chính hãng", icon: Package },
  { value: 14, suffix: "+", label: "Năm kinh nghiệm", icon: Award },
  { value: 98, suffix: "%", label: "Khách hàng hài lòng", icon: Star },
];

export default function StatsBar() {
  return (
    <section id="stats" className="bg-primary py-0 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.label} delay={i * 0.1}
                className={`px-6 lg:px-8 py-8 flex items-center gap-4 ${
                  i < stats.length - 1 ? "lg:border-r border-white/20" : ""
                } ${i >= 2 ? "border-t lg:border-t-0 border-white/20" : ""}`}>
                <Icon className="w-7 h-7 text-white/30 flex-shrink-0" />
                <div>
                  <p className="font-heading font-black text-2xl lg:text-3xl text-white leading-none">
                    <AnimatedNumber value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="font-body text-white/70 text-xs mt-1">{s.label}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
