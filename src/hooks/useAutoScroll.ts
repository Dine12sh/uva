import React from "react";
import { AUTO_SCROLL_DURATION } from "../lib/constants";

export function useAutoScroll(showContent: boolean, disabled: boolean = false) {
  const scrolledRef = React.useRef(false);

  React.useEffect(() => {
    if (!showContent || scrolledRef.current || disabled) return;
    if (typeof window === "undefined") return;

    let observer: MutationObserver | null = null;
    let rafId: number | null = null;

    const performScroll = (element: HTMLElement) => {
      if (scrolledRef.current) return;
      scrolledRef.current = true;

      console.log("[useAutoScroll] Target Interactive Cake found. Initiating scroll.");

      if (observer) {
        observer.disconnect();
      }

      rafId = requestAnimationFrame(() => {
        const lenis = (window as any).lenis;
        if (lenis) {
          try {
            lenis.scrollTo(element, {
              duration: AUTO_SCROLL_DURATION,
            });
          } catch (e) {
            console.error("[useAutoScroll] Lenis scrollTo failed, falling back to native scroll", e);
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        } else {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    };

    const initialTarget = document.getElementById("interactive-cake");
    if (initialTarget) {
      performScroll(initialTarget);
      return;
    }

    observer = new MutationObserver(() => {
      const target = document.getElementById("interactive-cake");
      if (target) {
        performScroll(target);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      if (observer) {
        observer.disconnect();
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [showContent, disabled]);
}
export default useAutoScroll;
