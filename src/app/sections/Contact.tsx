"use client";

import { useState } from "react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { RandomLetterSwapPingPong } from "@/components/ui/random-letter-swap";

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "New Project Inquiry",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: "952ea822-5a15-402c-a2df-7cb65fb38c49", // Updated with user's live key
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          from_name: "Portfolio Contact Form"
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", subject: "New Project Inquiry", message: "" });
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        console.error("Submission error:", result);
        alert(result.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to send message. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 bg-[#0c0c0c] relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-4xl bg-white/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2 items-start">
          
          {/* Left Column: Info */}
          <SectionReveal variant="slide-right">
            <div className="mb-8 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white">⊙</span>
                <span className="text-xs font-medium uppercase tracking-widest text-white/40">
                  Let&apos;s Connect
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-serif text-white leading-tight flex flex-wrap gap-x-3 gap-y-2">
                <RandomLetterSwapPingPong label="Let's" />
                <RandomLetterSwapPingPong label="build" />
                <RandomLetterSwapPingPong label="something" />
                <RandomLetterSwapPingPong label="exceptional" className="text-white/40 italic" />
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                Have a project in mind or just want to say hi? I&apos;m currently available for new opportunities and collaborations.
              </p>
            </div>

            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <div className="h-12 w-12 rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-primary flex-shrink-0">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Email Me</h4>
                  <a href="mailto:suryanshsrivastava05@gmail.com" className="text-lg text-muted-foreground hover:text-primary transition-colors">
                    suryanshsrivastava05@gmail.com
                  </a>
                </div>
              </div>


            </div>
          </SectionReveal>

          {/* Right Column: Form */}
          <SectionReveal variant="slide-left">
            <div className="relative p-10 md:p-14 rounded-[3rem] bg-white/[0.02] border border-white/10 shadow-2xl backdrop-blur-xl">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="h-24 w-24 rounded-full bg-white/10 flex items-center justify-center text-white mb-8">
                      <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <h3 className="text-3xl font-serif text-white mb-4">Message Sent!</h3>
                    <p className="text-white/40 text-lg">Thank you for reaching out. I&apos;ll get back to you shortly.</p>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-xs font-medium uppercase tracking-[0.2em] text-white/40 ml-1">Name</label>
                        <input 
                          required
                          type="text" 
                          placeholder="John Doe"
                          className="form-input"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-xs font-medium uppercase tracking-[0.2em] text-white/40 ml-1">Email</label>
                        <input 
                          required
                          type="email" 
                          placeholder="john@example.com"
                          className="form-input"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="text-xs font-medium uppercase tracking-[0.2em] text-white/40 ml-1">Subject</label>
                      <div className="relative">
                        <select 
                          className="form-input appearance-none"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        >
                          <option>New Project Inquiry</option>
                          <option>Collaboration</option>
                          <option>Just Saying Hi</option>
                          <option>Other</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                           <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-xs font-medium uppercase tracking-[0.2em] text-white/40 ml-1">Message</label>
                      <textarea 
                        required
                        rows={5}
                        placeholder="Tell me about your project..."
                        className="form-input resize-none"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </div>

                    <LiquidButton 
                      disabled={isSubmitting}
                      type="submit" 
                      className="w-full h-16 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-6 w-6 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="h-5 w-5" />
                        </>
                      )}
                    </LiquidButton>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </SectionReveal>

        </div>
      </div>
    </section>
  );
}
