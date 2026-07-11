import React from "react";
import Lenis from "lenis";
import gsap from "gsap";
// @ts-ignore
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LENIS_OPTIONS } from "../lib/constants";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useLenisScroll(active: boolean) {
  React.useEffect(() => {
    if (!active) return;
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      console.log("[useLenisScroll] prefers-reduced-motion is active. Bypassing Lenis initialization.");
      return;
    }

    const lenis = new Lenis(LENIS_OPTIONS);
    (window as any).lenis = lenis;

    // Sync Lenis scroll with GSAP ScrollTrigger to prevent lag on scrubbed animations
    lenis.on("scroll", ScrollTrigger.update);

    // Use GSAP ticker for the RAF loop instead of manual requestAnimationFrame
    const tickerCallback = () => {
      lenis.raf(performance.now());
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0); // Disable lag smoothing for precise scroll sync

    const listener = (e: MediaQueryListEvent) => {
      if (e.matches) {
        console.log("[useLenisScroll] prefers-reduced-motion enabled dynamically. Destroying Lenis.");
        lenis.destroy();
        (window as any).lenis = undefined;
        gsap.ticker.remove(tickerCallback);
      }
    };
    mediaQuery.addEventListener("change", listener);

    return () => {
      lenis.destroy();
      (window as any).lenis = undefined;
      gsap.ticker.remove(tickerCallback);
      mediaQuery.removeEventListener("change", listener);
    };
  }, [active]);
}
export default useLenisScroll;
