"use client";

import { motion } from "framer-motion";
import { ArrowUp, Heart, Instagram, Linkedin, Youtube, Mail } from "lucide-react";
import { XLogo as Twitter } from "@/components/ui/Icons";
import { RandomLetterSwapPingPong } from "@/components/ui/random-letter-swap";

type SocialLinkItem = {
  name: string;
  href: string;
  icon: any;
};

const socialLinksData: SocialLinkItem[] = [
  { name: "Instagram", href: "https://www.instagram.com/maxx_editzdb?igsh=YXVnZXh6aHFkcmd5", icon: Instagram },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/suryansh-srivastava0x2", icon: Linkedin },
  { name: "Twitter", href: "https://x.com/SuryanshSr38263", icon: Twitter },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="footer" className="border-t border-white/5 bg-[#0c0c0c]">
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4 flex flex-col items-center text-center md:items-start md:text-left">
            <a href="#hero" className="text-2xl font-serif text-white">
              Suryansh Srivastava
            </a>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              AI Visual Creator & Motion Artist crafting premium digital experiences through visual storytelling.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-sm font-semibold uppercase tracking-widest mb-4 text-muted-foreground text-center md:text-left">
              <RandomLetterSwapPingPong label="Quick Links" />
            </h4>
            <nav className="grid grid-cols-2 gap-2 text-left w-max">
              <a href="#hero" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Home</a>
              <a href="#projects" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Projects</a>
              <a href="#about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">About</a>
              <a href="#services" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Services</a>
              <a href="#contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Contact</a>
            </nav>
          </div>

          {/* Social */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-sm font-semibold uppercase tracking-widest mb-4 text-muted-foreground text-center md:text-left">
              <RandomLetterSwapPingPong label="Connect" />
            </h4>
            <div className="flex gap-3 justify-center md:justify-start">
              {socialLinksData.map((link) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground hover:border-primary/50"
                    whileHover={{ y: -3 }}
                    aria-label={link.name}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 md:flex-row">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Suryansh Srivastava. All rights reserved.
          </p>

          {/* Right aligned group */}
          <div className="flex items-center gap-6 flex-col md:flex-row w-full md:w-auto justify-between md:justify-end">
            {/* Developer Reference with beating heart & sleek hover glow */}
            <div className="text-sm text-white/40 flex items-center gap-1.5 py-1">
              <span>Made with</span>
              <motion.span 
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                className="inline-block text-red-500 filter drop-shadow-[0_0_4px_rgba(239,68,68,0.5)]"
              >
                ❤️
              </motion.span>
              <span>by</span>
              <a 
                href="https://www.instagram.com/pandey.aditya._/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors relative group py-0.5"
              >
                Aditya Pandey
                {/* Aesthetic expanding underline */}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-emerald-400 origin-bottom-right transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-hover:origin-bottom-left" />
              </a>
            </div>

            <motion.button onClick={scrollToTop}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/40 transition-colors hover:text-white hover:border-white/20"
              whileHover={{ y: -3, scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Scroll to top">
              <ArrowUp className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
