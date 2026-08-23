"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { RandomLetterSwapPingPong } from "@/components/ui/random-letter-swap";
import { GlowCard } from "@/components/ui/spotlight-card";
import { SectionReveal } from "@/components/ui/SectionReveal";

const testimonials = [
  {
    name: "Robert Laurent",
    role: "Client",
    content: "The videos exceeded our expectations! Every element felt purposeful, creating a seamless and visually stunning brand identity.",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop"
  },
  {
    name: "Sophia Reinhardt",
    role: "Client",
    content: "Working with this process was effortless. The vision was understood perfectly, and the videos truly represents my brand.",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&h=200&auto=format&fit=crop"
  }
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 md:py-32 relative overflow-hidden bg-transparent scroll-mt-24 md:scroll-mt-32">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column — Info & Stats */}
          <SectionReveal variant="fade-up" delay={0.1} className="lg:col-span-5 flex flex-col gap-10 lg:sticky lg:top-32">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 w-fit">
                <span className="text-[10px] text-white">⊙</span>
                <span className="text-[10px] uppercase tracking-widest text-white/40">Happy Clients</span>
              </div>
              
              <div className="flex flex-col gap-4">
                <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tight flex flex-wrap gap-x-3 md:gap-x-4">
                  <RandomLetterSwapPingPong label="Clients" />
                  <RandomLetterSwapPingPong label="Love me" className="text-white/30" />
                </h2>
                <p className="text-white/40 text-lg">
                  Trusted by 100+ happy clients, adding $1M+ in revenue.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {[
                { value: "100+", label: "Happy clients" },
                { value: "$110k+", label: "Revenue Added" },
                { value: "4.3", label: "Average Rating" },
              ].map((stat, i) => (
                <div 
                  key={i}
                  className="p-4 sm:p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 bg-[#111] flex flex-col gap-2 md:gap-3 items-center text-center md:items-start md:text-left"
                >
                  <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">{stat.value}</span>
                  <span className="text-[9px] md:text-[10px] leading-[1.2] md:leading-tight uppercase tracking-wider text-white/30">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 md:gap-4">
              <LiquidButton 
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                size="lg"
              >
                See All Projects
              </LiquidButton>
              <LiquidButton 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                size="lg"
              >
                Contact Now
              </LiquidButton>
            </div>
          </SectionReveal>

          {/* Right Column — Testimonial Feed */}
          <SectionReveal variant="fade-up" delay={0.25} className="lg:col-span-7 flex flex-col gap-6">
            {testimonials.map((t, i) => (
              <div 
                key={i} 
                className="bg-[#0f0f0f]/80 backdrop-blur-sm p-10 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-white tracking-tight">{t.name}</span>
                    <span className="text-xs text-white/30 uppercase tracking-[0.2em] font-medium">{t.role}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white mr-2">{t.rating.toFixed(1)}</span>
                    {[...Array(5)].map((_, starIdx) => (
                      <Star 
                        key={starIdx} 
                        className={`w-3.5 h-3.5 ${starIdx < Math.floor(t.rating) ? 'fill-yellow-500 text-yellow-500' : 'fill-white/10 text-white/10'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-lg text-white/50 leading-relaxed font-medium">
                    {t.content}
                  </p>
                </div>
              </div>
            ))}
          </SectionReveal>

        </div>
      </div>
    </section>
  );
};
