import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

/* ── Easing ── */
export const E = [0.22, 1, 0.36, 1];

/* ── Counter Hook ── */
export function useCounter(target, duration = 1.8, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) { setCount(0); return; }
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / (duration * 1000), 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ── Animated Number ── */
export function AnimatedNumber({ value, suffix = "", prefix = "", className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const num = useCounter(value, 1.8, inView);
  return (
    <span ref={ref} className={className}>
      {prefix}{num.toLocaleString()}{suffix}
    </span>
  );
}

/* ── Reveal (Y) ── */
export function Reveal({ children, y = 50, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: E }}
    >{children}</motion.div>
  );
}

/* ── RevealX ── */
export function RevealX({ children, x = -60, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, x }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: E }}
    >{children}</motion.div>
  );
}

/* ── ScaleIn ── */
export function ScaleIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: E }}
    >{children}</motion.div>
  );
}

/* ── ClipRevealImage ── */
export function ClipRevealImage({ src, alt, className = "", delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={`overflow-hidden ${className}`}
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      animate={inView ? { clipPath: "inset(0 0% 0 0)" } : {}}
      transition={{ duration: 0.9, delay, ease: E }}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </motion.div>
  );
}
