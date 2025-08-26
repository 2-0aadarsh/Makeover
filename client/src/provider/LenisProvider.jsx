import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

let lenis;

const LenisProvider = ({ children }) => {
  useEffect(() => {
    lenis = new Lenis({
      duration: 1.2, // adjust for speed
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // nice ease-out
      smooth: true,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return children;
};

export { lenis };
export default LenisProvider;
