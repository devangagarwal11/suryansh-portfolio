import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { GlowCard } from "@/components/ui/spotlight-card";

export default function DemoPage() {
  return (
    <div className="flex flex-col gap-12 w-full min-h-screen justify-center items-center bg-black">
      <div className="relative h-[200px] w-full max-w-[800px] flex items-center justify-center"> 
        <LiquidButton size="xxl">
          Liquid Glass
        </LiquidButton> 
      </div>
      
      <div className="flex flex-wrap gap-8 justify-center">
        <LiquidButton size="sm">Small Glass</LiquidButton>
        <LiquidButton size="default">Default Glass</LiquidButton>
        <LiquidButton size="lg">Large Glass</LiquidButton>
        <LiquidButton size="xl">Extra Large</LiquidButton>
      </div>

      <div className="flex flex-wrap gap-8 justify-center">
        <LiquidButton variant="outline">Outline Glass</LiquidButton>
        <LiquidButton variant="secondary">Secondary Glass</LiquidButton>
      </div>

      <div className="flex flex-col items-center gap-8">
        <h2 className="text-2xl font-bold text-white">Spotlight Glow Cards</h2>
        <div className="flex flex-wrap gap-10 justify-center">
          <GlowCard glowColor="blue">
            <div className="flex flex-col gap-2 p-4 text-white">
              <h3 className="text-xl font-bold">Blue Glow</h3>
              <p className="text-sm opacity-50">Hover over me to see the spotlight.</p>
            </div>
          </GlowCard>
          <GlowCard glowColor="purple">
            <div className="flex flex-col gap-2 p-4 text-white">
              <h3 className="text-xl font-bold">Purple Glow</h3>
              <p className="text-sm opacity-50">Dynamic color based on pointer.</p>
            </div>
          </GlowCard>
          <GlowCard glowColor="orange">
            <div className="flex flex-col gap-2 p-4 text-white">
              <h3 className="text-xl font-bold">Orange Glow</h3>
              <p className="text-sm opacity-50">Customizable hues and spread.</p>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  )
}
