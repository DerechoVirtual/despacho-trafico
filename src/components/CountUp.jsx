import { useEffect, useRef, useState } from "react";

/**
 * Número que cuenta desde 0 hasta `value` cuando entra en pantalla.
 * <CountUp value={100} prefix="+" />  ·  <CountUp value={34700} suffix=" €" />
 * Respeta prefers-reduced-motion y los navegadores automatizados (muestra el
 * valor final directamente).
 */
export default function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1700,
  className = "",
}) {
  const ref = useRef(null);
  const started = useRef(false);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const instant =
      (typeof navigator !== "undefined" && navigator.webdriver === true) ||
      (window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) ||
      typeof IntersectionObserver === "undefined";

    const run = () => {
      if (started.current) return;
      started.current = true;
      if (instant) return setShown(value);
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out cúbico
        setShown(Math.round(value * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (instant) {
      run();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown.toLocaleString("es-ES")}
      {suffix}
    </span>
  );
}
