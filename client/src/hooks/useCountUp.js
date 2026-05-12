import { useEffect, useState } from "react";

export default function useCountUp(target, active) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) return;
    let t0 = null;
    let raf;
    const dur = 2200;

    const step = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);

  return n;
}
