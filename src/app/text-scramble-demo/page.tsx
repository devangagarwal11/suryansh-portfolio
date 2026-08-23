"use client"

import * as React from "react"
import { useState } from "react"
import { TextScramble } from "@/components/ui/text-scramble"
import { RandomLetterSwapForward, RandomLetterSwapPingPong } from "@/components/ui/random-letter-swap"
import { Navigation } from "@/components/ui/Navigation"

// Text Scramble Demos
export function BasicScrambleDemo() {
  return (
    <div className="flex justify-center">
      <TextScramble className="font-mono text-sm uppercase text-white">
        Text Scramble
      </TextScramble>
    </div>
  )
}

export function CustomTriggerScrambleDemo() {
  const [isTrigger, setIsTrigger] = useState(false)

  return (
    <div className="flex justify-center">
      <a
        href="#"
        className="text-zinc-500 transition-colors hover:text-white"
        onMouseEnter={() => setIsTrigger(true)}
        onMouseLeave={() => setIsTrigger(false)}
      >
        <TextScramble
          className="text-sm"
          as="span"
          speed={0.01}
          trigger={isTrigger}
          onScrambleComplete={() => setIsTrigger(false)}
        >
          Tyler, The Creator - I Hope You Find Your Way Home
        </TextScramble>
      </a>
    </div>
  )
}

// Random Letter Swap Demos
function RandomLetterSwapBasicExample() {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      <RandomLetterSwapForward
        label="Right here!"
        className="text-white text-2xl"
        reverse={true}
      />
      <RandomLetterSwapForward
        label="Right now!"
        reverse={false}
        className="font-bold italic text-white/40 text-2xl"
      />
      <RandomLetterSwapPingPong 
        label="Ping Pong Effect" 
        className="text-white text-2xl"
      />
    </div>
  )
}

function TimingExample() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <RandomLetterSwapForward
        label="Fast Animation"
        className="text-white text-xl"
        transition={{ type: "spring", duration: 0.3 }}
        staggerDuration={0.01}
      />
      <RandomLetterSwapPingPong
        label="Slow Animation"
        className="text-white text-xl"
        transition={{ type: "spring", duration: 1.2 }}
        staggerDuration={0.05}
      />
    </div>
  )
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white p-24 flex flex-col gap-16">
      <Navigation />
      
      <section className="flex flex-col gap-8">
        <h1 className="text-4xl font-serif text-center">Text Scramble</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm flex flex-col gap-4">
            <h2 className="text-xl font-bold">Basic</h2>
            <BasicScrambleDemo />
          </div>
          <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm flex flex-col gap-4">
            <h2 className="text-xl font-bold">Custom Trigger (Hover)</h2>
            <CustomTriggerScrambleDemo />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <h1 className="text-4xl font-serif text-center">Random Letter Swap</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm flex flex-col gap-4">
            <h2 className="text-xl font-bold">Basic Variations</h2>
            <RandomLetterSwapBasicExample />
          </div>
          <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm flex flex-col gap-4">
            <h2 className="text-xl font-bold">Timing & Stagger</h2>
            <TimingExample />
          </div>
        </div>
      </section>
    </div>
  )
}
