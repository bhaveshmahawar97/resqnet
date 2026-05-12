import { useEffect, useState } from "react";

const BP = { sm: 640, md: 1024, xl: 1440 };

export default function useViewport() {
  const snap = () => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1280;
    return {
      w,
      mobile: w < BP.sm,
      tablet: w >= BP.sm && w < BP.md,
      desktop: w >= BP.md,
      ultra: w >= BP.xl,
    };
  };

  const [vp, setVP] = useState(snap);

  useEffect(() => {
    const fn = () => setVP(snap());
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, []);

  return vp;
}
