"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Left, centre (the drama), right. On tablet/desktop all three loop at once, side by side. */
const REEL = ["adperf-left-mida", "adperf-center-drama", "adperf-right-smooche"];
/** On phones they play one by one, full screen: drama first, then Mida, then Smooche. */
const PHONE_ORDER = [1, 0, 2];

const PHONE_QUERY = "(max-width: 767px)"; // matches Tailwind's md breakpoint
const subscribePhone = (cb: () => void) => {
  const mq = window.matchMedia(PHONE_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getPhone = () => window.matchMedia(PHONE_QUERY).matches;

/**
 * Full-bleed showreel for the Ad Performance section: three real ads playing in parallel side by side
 * (one by one on phones), a dark gradient, and the headline on top.
 */
export function AdPerformanceHero({ resultsId }: { resultsId?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const vidRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const isPhone = useSyncExternalStore(subscribePhone, getPhone, () => false);
  const [onScreen, setOnScreen] = useState(false);
  const [step, setStep] = useState(0); // position in PHONE_ORDER
  const activeIdx = PHONE_ORDER[step];

  // Only spend bandwidth/CPU on the reel while it is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Desktop/tablet: everything loops together. Phone: only the current ad plays, from the start.
  useEffect(() => {
    vidRefs.current.forEach((v, i) => {
      if (!v) return;
      v.loop = !isPhone;
      if (!onScreen) return v.pause();
      if (!isPhone || i === activeIdx) {
        v.play().catch(() => {});
      } else {
        v.pause();
        v.currentTime = 0;
      }
    });
  }, [isPhone, onScreen, activeIdx]);

  const onEnded = (i: number) => {
    if (isPhone && i === activeIdx) setStep((s) => (s + 1) % PHONE_ORDER.length);
  };

  const rise = (delay: number) => ({
    initial: { y: "105%" },
    animate: inView ? { y: "0%" } : undefined,
    transition: { duration: 1, ease: EASE, delay },
  });
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: inView ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.9, ease: EASE, delay },
  });

  return (
    <div
      ref={ref}
      className="relative left-1/2 w-screen -translate-x-1/2 h-[100svh] min-h-[620px] max-h-[1080px] overflow-hidden bg-[#080808]"
    >
      {/* tablet/desktop: three ads in parallel, side by side, drama in the centre.
          phone: the same three stacked full screen, cross-fading one by one */}
      <div className="absolute inset-0 md:grid md:grid-cols-3" aria-hidden="true">
        {REEL.map((name, i) => (
          <div
            key={name}
            className="absolute inset-0 overflow-hidden transition-opacity duration-700 md:relative md:inset-auto md:h-full"
            style={{ opacity: isPhone && i !== activeIdx ? 0 : 1 }}
          >
            <video
              ref={(el) => {
                vidRefs.current[i] = el;
              }}
              className="absolute inset-0 h-full w-full object-cover object-top"
              src={`/videos/${name}.mp4`}
              poster={`/videos/${name}.jpg`}
              muted
              loop
              playsInline
              preload="metadata"
              disablePictureInPicture
              onEnded={() => onEnded(i)}
            />
          </div>
        ))}
      </div>

      {/* legibility: dark at the bottom, lighter mid-frame, soft top edge into the section */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,#080808_0%,rgba(8,8,8,.9)_28%,rgba(8,8,8,.55)_50%,rgba(8,8,8,.15)_72%,rgba(8,8,8,.3)_100%)]" />
      {/* the reel rises out of the page background instead of starting on a hard edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 md:h-56 bg-[linear-gradient(to_bottom,#080808_0%,rgba(8,8,8,.92)_18%,rgba(8,8,8,.7)_38%,rgba(8,8,8,.4)_60%,rgba(8,8,8,.15)_80%,rgba(8,8,8,0)_100%)]" />

      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-[1400px] px-6 pb-10 md:px-12 md:pb-14">
          <motion.p {...fade(0)} className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/70">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Performance creative · Meta &amp; TikTok
          </motion.p>

          <h3 className="mt-5 font-serif text-white leading-[0.95] tracking-tight text-[clamp(3.1rem,9.5vw,9.5rem)]">
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span {...rise(0.1)} className="block">
                Ads that don&rsquo;t
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span {...rise(0.22)} className="block italic text-white/55">
                look like ads.
              </motion.span>
            </span>
          </h3>

          <div className="mt-6 grid gap-6 md:mt-9 md:grid-cols-12 md:items-end">
            <motion.div {...fade(0.45)} className="md:col-span-7">
              <p className="max-w-[46ch] text-[15px] leading-relaxed text-white/80 md:text-[18px]">
                Scroll-stopping AI ads that feel like real content, not marketing. Built to earn the click and find
                you more winners.
              </p>
              <ol className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-[0.18em] text-white/50 md:text-[11px]">
                {["Angle", "Hooks", "AI production", "Edit"].map((s, i) => (
                  <li key={s} className="flex items-center gap-2">
                    {i > 0 && <span className="text-white/30">→</span>}
                    {s}
                  </li>
                ))}
              </ol>
            </motion.div>
            {resultsId && (
              <motion.div {...fade(0.6)} className="md:col-span-5 md:flex md:justify-end">
                <a
                  href={`#${resultsId}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform duration-300 hover:scale-[1.03]"
                >
                  See the results <span aria-hidden="true">↓</span>
                </a>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
