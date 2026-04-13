import { useState, useEffect, useRef } from "react";

/**
 * Animates an integer from 0 to endValue over durationMs.
 * Re-runs when triggerKey changes (e.g. switching “Về chúng tôi” / “Sứ mệnh” / “Tầm nhìn”).
 */
export function useCountUp(endValue, durationMs, triggerKey) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    setValue(0);
    const start = performance.now();

    const tick = (now) => {
      if (cancelled) return;
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(endValue * eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, [endValue, durationMs, triggerKey]);

  return value;
}
