"use client";

import { motion } from "framer-motion";
import { MessageSquare, CreditCard, Layers, Zap, Scissors, CheckCircle } from "lucide-react";
import { RandomLetterSwapPingPong } from "@/components/ui/random-letter-swap";
import { TextScramble } from "@/components/ui/text-scramble";
import { TextEffect } from "@/components/ui/text-effect";
import { GlowCard } from "@/components/ui/spotlight-card";
import { SectionReveal } from "@/components/ui/SectionReveal";

export const Process = () => {
  const steps = [
    {
      id: 1,
      title: "Client Meeting",
      description: "I connect with clients via online Meet to understand their vision and collaboratively build a project roadmap. I also contribute my own creative input to help the client see the bigger picture and enhance the final outcome. Payment terms are discussed and agreed upon during this call.",
      icon: MessageSquare,
    },
    {
      id: 2,
      title: "Advance Payment & Project Kickoff",
      description: "Once the client makes an advance payment of 30% of the total project fee, work officially begins. A deadline is also fixed at this stage to keep the project on track.",
      icon: CreditCard,
    },
    {
      id: 3,
      title: "Storyboard",
      description: "The first step in production is building a storyboard. I manually curate references and inspiration relevant to the project, and for scenes that need to be created from scratch, I sketch them out directly on the storyboard - bringing my own creative direction to life visually.",
      icon: Layers,
    },
    {
      id: 4,
      title: "Production",
      description: "Drawing on my experience across various ad campaigns, I apply my understanding of the target audience and campaign objectives to craft fast, punchy, and visually compelling hook scenes that grab attention from the first frame.",
      icon: Zap,
    },
    {
      id: 5,
      title: "AI-Assisted Editing & Post-Production",
      description: "Scene analysis is conducted using AI tools (Claude and ChatGPT) to craft catchy hooks and keep the narrative sharp. Visual enhancement is then applied to each scene to refine colour grading, tone, and aesthetics to match the desired mood. SFX and background music are layered in to elevate the emotional impact, using industry-standard tools including Adobe Premiere Pro, After Effects, and Photoshop.",
      icon: Scissors,
    },
    {
      id: 6,
      title: "Delivery & Final Polishing",
      description: "The completed video is delivered with a watermark applied. The package includes 3 complimentary revision rounds for any adjustments. Should revisions exceed this limit, each additional change will be billed individually, with the cost determined by the complexity of the requested modification.",
      icon: CheckCircle,
    },
  ];

  return (
    <section id="process" className="py-24 md:py-32 bg-[#0c0c0c] scroll-mt-24 md:scroll-mt-32">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <SectionReveal variant="fade-up" className="flex flex-col items-center gap-6 mb-20 text-center">
          <div className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 flex items-center gap-2">
            <span className="text-[10px] text-white">⊙</span>
            <TextScramble 
              className="text-xs font-medium uppercase tracking-widest text-white/80"
              duration={1}
              characterSet="01"
            >
              How it works
            </TextScramble>
          </div>
          <h2 className="text-5xl md:text-7xl font-serif text-white flex flex-wrap justify-center items-center gap-x-3 md:gap-x-4">
            <RandomLetterSwapPingPong label="Process" />
            <RandomLetterSwapPingPong label="Is Everything" className="text-white/40 italic" />
          </h2>
          <p className="text-white/40 text-lg max-w-md">
            Simple, streamlined process is what gets you premium results.
          </p>
        </SectionReveal>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <SectionReveal
              key={step.id}
              variant="fade-up"
              delay={i * 0.08}
            >
              <motion.div
                className="p-8 rounded-[2rem] border border-white/10 bg-[#111] relative group overflow-hidden h-full flex flex-col"
              >
                {/* Step Number Badge */}
                <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/40 group-hover:text-white group-hover:border-white/30 transition-all">
                  {step.id}
                </div>

                {/* Icon */}
                <div className="mb-8 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/60 group-hover:text-white group-hover:scale-110 transition-all">
                  <step.icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-4 flex-1">
                  <h3 className="text-xl font-serif text-white group-hover:translate-x-1 transition-transform">
                    <TextEffect preset="blur">{step.title}</TextEffect>
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Step Label */}
                <div className="mt-8 pt-8 border-t border-white/5">
                  <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold bg-white/5 px-4 py-1.5 rounded-full">
                    Step {step.id}
                  </span>
                </div>
              </motion.div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
