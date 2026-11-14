"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Muted background loop that only starts downloading when it is about to scroll into view,
 * and pauses while off screen. The poster shows until then, so it looks identical.
 */
export function LazyLoopVideo({
  className,
  poster,
  sources,
}: {
  className?: string;
  poster: string;
  sources: { src: string; type: string }[];
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!near || !v) return;
    v.load(); // <source> children were just added; the element needs a load() to pick them up
    v.play().catch(() => {});
  }, [near]);

  return (
    <video ref={ref} className={className} muted loop playsInline preload={near ? "auto" : "none"} poster={poster}>
      {near && sources.map((s) => <source key={s.src} src={s.src} type={s.type} />)}
    </video>
  );
}
