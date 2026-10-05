import type Lenis from "lenis";

type LenisWindow = Window & { lenis?: Lenis };

/**
 * Scroll to an element id (without the #), a number, or the top of the page.
 * Goes through Lenis when it is running so we never have two smooth-scroll
 * engines (Lenis + the browser's) fighting each other, which causes stutter.
 */
export function scrollToTarget(target: string | number, offset = 0) {
  if (typeof window === "undefined") return;
  const lenis = (window as LenisWindow).lenis;

  if (typeof target === "string") {
    const el = document.getElementById(target);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset });
    else el.scrollIntoView({ behavior: "smooth" });
    return;
  }

  if (lenis) lenis.scrollTo(target, { offset });
  else window.scrollTo({ top: target + offset, behavior: "smooth" });
}

export function stopSmoothScroll() {
  (window as LenisWindow).lenis?.stop();
}

export function startSmoothScroll() {
  (window as LenisWindow).lenis?.start();
}
