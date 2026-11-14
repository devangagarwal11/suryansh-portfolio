"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useWistiaPlayer, wistiaEmbedClass } from "@/lib/wistia";

/**
 * Ad performance, Apple-style widget panels.
 * Scroll in → TrendTrack + Atria logos dock → a line drops → the panel opens.
 * A segmented control switches between case studies; each one is the ad
 * (hover to play) beside a bento of frosted widgets whose numbers count in.
 */

type ListRow = [string, string];
type RankPoint = { label: string; rank: number; of: number };

export type PerfCase = {
  id: string;
  brand: string;
  adName: string;
  thumbnail: string;
  mediaId?: string;
  badge: string; // e.g. "Winner", "Top 5%"
  hero:
    | { kind: "cpa"; value: number; caption: string }
    | { kind: "rank"; rank: number; of: number; topPct: number; points: RankPoint[]; caption: string };
  status: { title: string; sub: string };
  details: ListRow[];
  extra?: { label: string; value: number; suffix?: string; sub: string };
};

const EASE = [0.16, 1, 0.3, 1] as const;

/* ───────────── small pieces ───────────── */

const Counter = ({ from, to, prefix = "", suffix = "", run, delay = 0.2, decimals = 0 }: { from: number; to: number; prefix?: string; suffix?: string; run: boolean; delay?: number; decimals?: number }) => {
  const [v, setV] = useState(from);
  useEffect(() => {
    if (!run) return;
    const c = animate(from, to, { duration: 1.8, delay, ease: EASE, onUpdate: setV });
    return () => c.stop();
  }, [run, from, to, delay]);
  return (
    <span className="tabular-nums">
      {prefix}
      {v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
};

/** Frosted widget tile. */
const Tile = ({ children, className = "", i = 0 }: { children: React.ReactNode; className?: string; i?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    exit={{ opacity: 0, y: -10, filter: "blur(6px)", transition: { duration: 0.25 } }}
    transition={{ duration: 0.7, ease: EASE, delay: 0.08 * i }}
    className={`relative overflow-hidden rounded-[26px] border border-white/[0.08] bg-gradient-to-b from-white/[0.07] to-white/[0.025] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-6 ${className}`}
  >
    {children}
  </motion.div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[13px] font-medium tracking-[-0.01em] text-white/45">{children}</p>
);

/** Rank chart: lower rank number = higher on the chart. Draws itself. */
const RankChart = ({ points }: { points: RankPoint[] }) => {
  const W = 520;
  const H = 150;
  const max = Math.max(...points.map((p) => p.rank));
  const xs = points.map((_, i) => 14 + (i * (W - 28)) / (points.length - 1));
  const ys = points.map((p) => 16 + ((p.rank - 1) / (max - 1)) * (H - 40));
  const d = xs.reduce((acc, x, i) => {
    if (i === 0) return `M ${x} ${ys[i]}`;
    const cx = (xs[i - 1] + x) / 2;
    return `${acc} C ${cx} ${ys[i - 1]}, ${cx} ${ys[i]}, ${x} ${ys[i]}`;
  }, "");
  const area = `${d} L ${xs[xs.length - 1]} ${H} L ${xs[0]} ${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 h-[120px] w-full md:h-[150px]" preserveAspectRatio="none">
      <defs>
        <linearGradient id="rankFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(52,211,153,0.35)" />
          <stop offset="100%" stopColor="rgba(52,211,153,0)" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      <motion.path d={area} fill="url(#rankFill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.9 }} />
      <motion.path d={d} fill="none" stroke="#34D399" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: EASE, delay: 0.35 }} />
      {points.map((p, i) => (
        <motion.g key={p.label} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.5 + i * 0.35 }} style={{ transformOrigin: `${xs[i]}px ${ys[i]}px` }}>
          <circle cx={xs[i]} cy={ys[i]} r="5" fill="#0d0d0d" stroke="#34D399" strokeWidth="2.5" />
          <text x={xs[i]} y={ys[i] - 12} textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"} fill="#6EE7B7" fontSize="13" fontWeight="600">
            #{p.rank}
          </text>
          <text x={xs[i]} y={H - 4} textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"} fill="rgba(255,255,255,0.35)" fontSize="12">
            {p.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
};

/* ───────────── the ad on the left (hover to play) ───────────── */

const AdTile = ({ c }: { c: PerfCase }) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [unmuted, setUnmuted] = useState(false);
  const { play, pause, setMuted, isPlaying } = useWistiaPlayer(playerRef, c.mediaId, mounted && !!c.mediaId);
  const start = useCallback(() => {
    if (!c.mediaId) return;
    setMounted(true);
    setHovering(true);
    play();
  }, [c.mediaId, play]);
  const stop = useCallback(() => {
    setHovering(false);
    pause();
  }, [pause]);
  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !unmuted;
    setUnmuted(next);
    setMuted(!next);
    if (next && !hovering) start();
  };
  const showVideo = isPlaying && hovering;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.25 } }}
      transition={{ duration: 0.8, ease: EASE }}
      onMouseEnter={start}
      onMouseLeave={stop}
      onClick={() => (hovering ? stop() : start())}
      className={`relative mx-auto aspect-[9/16] w-[min(70vw,290px)] overflow-hidden rounded-[30px] border border-white/10 bg-black shadow-[0_30px_80px_rgba(0,0,0,0.6)] ${c.mediaId ? "cursor-pointer" : ""}`}
    >
      {mounted && c.mediaId && (
        <div className="absolute inset-0">
          <div ref={playerRef} className={`${wistiaEmbedClass(c.mediaId)} h-full w-full`} />
        </div>
      )}
      <img src={c.thumbnail} alt={`${c.brand}: ${c.adName}`} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${showVideo ? "opacity-0" : "opacity-100"}`} loading="lazy" />
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10 transition-opacity duration-500 ${showVideo ? "opacity-30" : "opacity-100"}`} />
      <span className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-xl">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        {c.badge}
      </span>
      {c.mediaId && (
        <>
          <span className={`pointer-events-none absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 backdrop-blur-xl transition-opacity duration-300 ${showVideo ? "opacity-0" : "opacity-100"}`}>
            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-white" aria-hidden="true">
              <path d="M7 4.5v15l12-7.5z" />
            </svg>
          </span>
          <button
            type="button"
            onClick={toggleSound}
            aria-label={unmuted ? "Mute" : "Unmute"}
            className={`absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 ${unmuted ? "border-white bg-white text-black" : "border-white/20 bg-black/40 text-white backdrop-blur-xl hover:bg-white/10"}`}
          >
            {unmuted ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </>
      )}
      <div className={`pointer-events-none absolute inset-x-4 bottom-4 transition-opacity duration-300 ${showVideo ? "opacity-0" : "opacity-100"}`}>
        <p className="text-[15px] font-semibold tracking-[-0.01em] text-white">{c.brand}</p>
        <p className="text-[12px] text-white/60">{c.adName}</p>
      </div>
    </motion.div>
  );
};

/* ───────────── the bento on the right ───────────── */

const Bento = ({ c }: { c: PerfCase }) => (
  <div className="grid grid-cols-2 gap-3 md:gap-4">
    {/* hero metric */}
    <Tile className="col-span-2" i={0}>
      {c.hero.kind === "cpa" ? (
        <>
          <div className="flex items-start justify-between">
            <Label>Cost per acquisition</Label>
            <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">Meta</span>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-[72px] font-semibold leading-none tracking-[-0.05em] text-white md:text-[104px]">
              <Counter from={c.hero.value * 3.2} to={c.hero.value} prefix="$" run />
            </span>
            <span className="text-2xl font-medium tracking-[-0.02em] text-white/35 md:text-3xl">CPA</span>
          </div>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/55">{c.hero.caption}</p>
        </>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <Label>Ad rank in its niche</Label>
            <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">Top {c.hero.topPct}%</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[64px] font-semibold leading-none tracking-[-0.05em] text-white md:text-[88px]">
              <Counter from={c.hero.points[0].rank} to={c.hero.rank} prefix="#" run />
            </span>
            <span className="text-xl font-medium text-white/35 md:text-2xl">/ {c.hero.of}</span>
          </div>
          <RankChart points={c.hero.points} />
          <p className="mt-2 text-[15px] leading-relaxed text-white/55">{c.hero.caption}</p>
        </>
      )}
    </Tile>

    {/* status */}
    <Tile i={1}>
      <Label>Status</Label>
      <div className="mt-3 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>
        <span className="text-[22px] font-semibold tracking-[-0.03em] text-white md:text-[26px]">{c.status.title}</span>
      </div>
      <p className="mt-1.5 text-[13px] text-white/45">{c.status.sub}</p>
    </Tile>

    {/* extra stat, or details in its place */}
    {c.extra ? (
      <Tile i={2}>
        <Label>{c.extra.label}</Label>
        <p className="mt-3 text-[34px] font-semibold leading-none tracking-[-0.04em] text-white md:text-[40px]">
          <Counter from={0} to={c.extra.value} suffix={c.extra.suffix} run />
        </p>
        <p className="mt-2 text-[13px] text-white/45">{c.extra.sub}</p>
      </Tile>
    ) : null}

    {/* details list */}
    <Tile className={c.extra ? "col-span-2" : ""} i={3}>
      <Label>Ad details</Label>
      <div className={`mt-2 grid ${c.extra ? "grid-cols-2 gap-x-6 md:grid-cols-4" : "grid-cols-1"}`}>
        {c.details.map(([k, v]) => (
          <div key={k} className={`flex items-center justify-between gap-3 border-white/[0.07] py-2.5 ${c.extra ? "md:block md:border-0" : "border-b last:border-0"}`}>
            <span className="text-[13px] text-white/45">{k}</span>
            <span className="text-[15px] font-medium tracking-[-0.01em] text-white md:mt-0.5 md:block">{v}</span>
          </div>
        ))}
      </div>
    </Tile>
  </div>
);

/* ───────────── main ───────────── */

export const AdPerformance = ({ cases }: { cases: PerfCase[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t = window.setTimeout(() => setOpen(true), 950);
    return () => window.clearTimeout(t);
  }, [inView]);
  const c = cases[active];

  return (
    <div ref={ref} className="relative">
      {/* 1 · the trackers arrive */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <motion.p initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.5, ease: EASE }} className="text-[13px] font-medium tracking-[-0.01em] text-white/40">
          Performance tracked with
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { from: -160, el: (<><img src="/images/logos/trendtrack-icon.svg" alt="" className="h-7 w-7 rounded-md" /><span className="text-lg font-semibold tracking-tight text-white">TrendTrack</span></>) },
            { from: 160, el: <img src="/images/logos/atria-logo-white.svg" alt="Atria" className="h-6 w-auto" /> },
          ].map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: l.from, scale: 0.9, filter: "blur(10px)" }}
              animate={inView ? { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.9, ease: EASE }}
              className="flex h-14 items-center gap-3 rounded-full border border-white/[0.12] bg-white/[0.06] px-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_40px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
            >
              {l.el}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 2 · the line drops and the panel opens */}
      <motion.div initial={{ scaleY: 0, opacity: 0 }} animate={open ? { scaleY: 1, opacity: 1 } : {}} transition={{ duration: 0.5, ease: EASE }} style={{ originY: 0 }} className="mx-auto h-12 w-px bg-gradient-to-b from-white/60 to-white/0" />
      <motion.div
        initial={{ clipPath: "inset(0 50% 100% 50% round 36px)", opacity: 0.6 }}
        animate={open ? { clipPath: "inset(0 0% 0% 0% round 36px)", opacity: 1 } : {}}
        transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
        className="relative overflow-hidden rounded-[36px] border border-white/[0.08] bg-gradient-to-b from-[#161616] to-[#0d0d0d] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_40px_120px_rgba(0,0,0,0.55)] md:p-8"
      >
        <div className="pointer-events-none absolute -top-48 right-[-10%] h-[28rem] w-[60%] rounded-full bg-emerald-400/[0.05] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 left-[-10%] h-[24rem] w-[50%] rounded-full bg-white/[0.03] blur-3xl" />

        {/* segmented control (only when there is more than one case) */}
        {cases.length > 1 && (
        <div className="relative mb-6 flex flex-wrap items-center justify-between gap-4 md:mb-8">
          <p className="text-[13px] font-medium text-white/40">Case studies</p>
          <div className="relative flex rounded-full border border-white/[0.08] bg-white/[0.04] p-1 backdrop-blur-2xl">
            {cases.map((cs, i) => (
              <button key={cs.id} type="button" onClick={() => setActive(i)} className="relative rounded-full px-4 py-2 text-[13px] font-medium md:px-5">
                {active === i && <motion.span layoutId="perfSeg" className="absolute inset-0 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.3)]" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
                <span className={`relative z-10 transition-colors duration-300 ${active === i ? "text-black" : "text-white/60 hover:text-white"}`}>{cs.brand}</span>
              </button>
            ))}
          </div>
        </div>
        )}

        {open && (
          <AnimatePresence mode="wait">
            <motion.div key={c.id} className="relative grid items-start gap-6 md:grid-cols-[auto_1fr] md:gap-8">
              <AdTile c={c} />
              <Bento c={c} />
            </motion.div>
          </AnimatePresence>
        )}
        {!open && <div className="h-[520px]" />}
      </motion.div>
    </div>
  );
};
