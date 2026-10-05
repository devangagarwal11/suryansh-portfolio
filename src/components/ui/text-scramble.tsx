'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, MotionProps } from 'framer-motion';

type TextScrambleProps = {
  children: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  as?: React.ElementType;
  className?: string;
  trigger?: boolean;
  onScrambleComplete?: () => void;
} & MotionProps;

const defaultChars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// motion.create() must NOT run during render: it builds a brand-new component
// type every time, so React unmounts/remounts the text on each frame of the
// scramble (flicker + lost state). Cache one motion component per element type.
type ScrambleHost = React.ComponentType<
  React.PropsWithChildren<{ className?: string } & MotionProps>
>;
const motionCache = new Map<React.ElementType, ScrambleHost>();
function getMotionComponent(Component: React.ElementType): ScrambleHost {
  let cached = motionCache.get(Component);
  if (!cached) {
    cached = motion.create(Component as 'p') as unknown as ScrambleHost;
    motionCache.set(Component, cached);
  }
  return cached;
}

export function TextScramble({
  children,
  duration = 0.8,
  speed = 0.04,
  characterSet = defaultChars,
  className,
  as: Component = 'p',
  trigger = true,
  onScrambleComplete,
  ...props
}: TextScrambleProps) {
  const MotionComponent = getMotionComponent(Component);
  const [displayText, setDisplayText] = useState(children);
  const completeRef = useRef(onScrambleComplete);

  useEffect(() => {
    completeRef.current = onScrambleComplete;
  });

  useEffect(() => {
    if (!trigger) return;

    const text = children;
    const steps = duration / speed;
    let step = 0;

    const interval = setInterval(() => {
      const progress = step / steps;
      let scrambled = '';

      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          scrambled += ' ';
        } else if (progress * text.length > i) {
          scrambled += text[i];
        } else {
          scrambled += characterSet[Math.floor(Math.random() * characterSet.length)];
        }
      }

      setDisplayText(scrambled);
      step++;

      if (step > steps) {
        clearInterval(interval);
        setDisplayText(text);
        completeRef.current?.();
      }
    }, speed * 1000);

    // Clean up if the component unmounts / re-triggers mid-scramble.
    return () => clearInterval(interval);
  }, [trigger, children, duration, speed, characterSet]);

  return (
    <MotionComponent className={className} {...props}>
      {displayText}
    </MotionComponent>
  );
}
