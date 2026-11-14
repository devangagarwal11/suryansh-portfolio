"use client";

import { RandomLetterSwapPingPong } from "@/components/ui/random-letter-swap";
import { TextScramble } from "@/components/ui/text-scramble";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { LazyLoopVideo } from "@/components/ui/LazyLoopVideo";

/** The finished ad this workflow produced (Wistia, vertical 9:16). */
const RESULT_MEDIA_ID = "p6ye60edvj";
const RESULT_SRC = `https://fast.wistia.net/embed/iframe/${RESULT_MEDIA_ID}?videoFoam=false&fitStrategy=contain&copyLinkAndThumbnailEnabled=false&seo=false`;

export const Process = () => {
  return (
    <section id="process" className="relative overflow-hidden bg-[#0c0c0c] scroll-mt-24 md:scroll-mt-32">
      {/* ── Part 1: the Claude-automated workflow, looping in the background ── */}
      <div className="relative">
        <div className="absolute inset-0" aria-hidden="true">
          {/* loads only as it nears the viewport, so it doesn't compete with the first screen */}
          <LazyLoopVideo
            className="absolute inset-0 h-full w-full object-cover"
            poster="/videos/process-loop-poster.jpg"
            sources={[
              { src: "/videos/process-loop.mp4", type: "video/mp4" },
              { src: "/videos/process-loop.webm", type: "video/webm" },
            ]}
          />
          {/* 25% black overlay */}
          <div className="pointer-events-none absolute inset-0 bg-black/25" />
          {/* blend into the dark sections above and below */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0c0c0c] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0c0c0c] to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[max(56.25vw,620px)] max-w-[1400px] flex-col px-6 pt-24 md:pt-32">
          <SectionReveal variant="fade-up" className="flex flex-col items-center gap-6 text-center">
            <div className="px-4 py-1.5 rounded-full border border-white/15 bg-black/30 backdrop-blur-sm flex items-center gap-2">
              <span className="text-[10px] text-white">⊙</span>
              <TextScramble
                className="text-xs font-medium uppercase tracking-widest text-white/80"
                duration={1}
                characterSet="01"
              >
                How it works
              </TextScramble>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif text-white flex flex-wrap justify-center items-center gap-x-3 md:gap-x-4 drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
              <RandomLetterSwapPingPong label="Process" />
              <RandomLetterSwapPingPong label="Is Everything" className="text-white/60 italic" />
            </h2>
            <p className="text-white/70 text-lg max-w-md drop-shadow-[0_1px_12px_rgba(0,0,0,0.5)]">
              Simple, streamlined process is what gets you premium results.
            </p>
          </SectionReveal>
        </div>
      </div>

      {/* ── Part 2: the output of that process ── */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 pb-24 md:pb-32 pt-10 md:pt-16">
        <SectionReveal variant="fade-up" className="grid items-center gap-10 md:grid-cols-[1fr_auto] md:gap-16">
          <div className="flex flex-col gap-6 text-center md:text-left">
            <div className="mx-auto md:mx-0 w-fit px-4 py-1.5 rounded-full border border-white/10 bg-white/5 flex items-center gap-2">
              <span className="text-[10px] text-white">↳</span>
              <span className="text-xs font-medium uppercase tracking-widest text-white/80">The result</span>
            </div>
            <h3 className="text-4xl md:text-6xl font-serif text-white leading-[1.05]">
              What Claude <span className="text-white/40 italic">came up with</span>
            </h3>
            <p className="text-white/50 text-lg max-w-lg mx-auto md:mx-0 leading-relaxed">
              The same pipeline, start to finish: one brief in, a finished ultra-realistic drama ad out. Cast, generated,
              quality-checked and edited with Claude in the loop.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {["Thinbi · Elevator drama", "9:16", "Realistic AI cast", "Edited in Premiere Pro"].map((t) => (
                <span key={t} className="text-[11px] uppercase tracking-widest text-white/50 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="mx-auto w-[min(78vw,380px)] aspect-[9/16] overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
            <iframe
              src={RESULT_SRC}
              title="Thinbi: the finished ad"
              allow="autoplay; fullscreen"
              allowFullScreen
              loading="lazy"
              className="h-full w-full"
            />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};
