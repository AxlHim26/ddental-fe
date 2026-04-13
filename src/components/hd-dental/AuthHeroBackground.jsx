import React from "react";
import { motion } from "framer-motion";

/** Cùng ảnh hero trang chủ (slide 1) — full viewport, làm mờ nhẹ + zoom thở chậm. */
const HERO_IMAGE =
  "https://media.base44.com/images/public/69cff7a985a4c7940dcab568/ceb056cd9_generated_6eba3c34.png";

export default function AuthHeroBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Flex căn giữa: tránh translate + scale cùng transform (Framer ghi đè → lệch nền / hở viền). */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="h-[118%] w-[118%] shrink-0"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <img
            src={HERO_IMAGE}
            alt=""
            className="h-full w-full object-cover blur-sm sm:blur-[6px]"
          />
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/40 pointer-events-none" />
    </div>
  );
}
