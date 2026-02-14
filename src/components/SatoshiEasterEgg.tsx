'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { SatoshiNakamoto } from '@/components/login/BusinessmanAvatars';

type Side = 'left' | 'right';

interface Appearance {
  side: Side;
  topPercent: number; // 15-75 to avoid header and bottom
}

// Min/max seconds between appearances
const MIN_INTERVAL = 45;
const MAX_INTERVAL = 120;
// How long Satoshi stays visible (ms)
const VISIBLE_DURATION = 6000;
// Fade-in + slide-in duration (must match CSS)
const ANIM_DURATION = 1200;

function getRandomInterval(): number {
  return (MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL)) * 1000;
}

function getRandomAppearance(): Appearance {
  return {
    side: Math.random() < 0.5 ? 'left' : 'right',
    topPercent: 15 + Math.random() * 60,
  };
}

export function SatoshiEasterEgg() {
  const [appearance, setAppearance] = useState<Appearance | null>(null);
  const [phase, setPhase] = useState<'hidden' | 'entering' | 'visible' | 'leaving'>('hidden');

  const triggerAppearance = useCallback(() => {
    const app = getRandomAppearance();
    setAppearance(app);
    setPhase('entering');

    // After enter animation completes, mark as visible
    setTimeout(() => setPhase('visible'), ANIM_DURATION);

    // Start leaving after visible duration
    setTimeout(() => setPhase('leaving'), ANIM_DURATION + VISIBLE_DURATION);

    // Fully hidden after leave animation
    setTimeout(() => {
      setPhase('hidden');
      setAppearance(null);
    }, ANIM_DURATION + VISIBLE_DURATION + ANIM_DURATION);
  }, []);

  useEffect(() => {
    // First appearance after a random delay (20-60s)
    const initialDelay = (20 + Math.random() * 40) * 1000;
    let timeoutId = setTimeout(() => {
      triggerAppearance();
      scheduleNext();
    }, initialDelay);

    function scheduleNext() {
      const totalCycleDuration = ANIM_DURATION + VISIBLE_DURATION + ANIM_DURATION;
      timeoutId = setTimeout(() => {
        triggerAppearance();
        scheduleNext();
      }, totalCycleDuration + getRandomInterval());
    }

    return () => clearTimeout(timeoutId);
  }, [triggerAppearance]);

  if (!appearance || phase === 'hidden') return null;

  const isLeft = appearance.side === 'left';

  // Animation class based on phase
  let animClass = '';
  if (phase === 'entering') {
    animClass = isLeft ? 'satoshi-peek-in-left' : 'satoshi-peek-in-right';
  } else if (phase === 'visible') {
    animClass = isLeft ? 'satoshi-idle-left' : 'satoshi-idle-right';
  } else if (phase === 'leaving') {
    animClass = isLeft ? 'satoshi-peek-out-left' : 'satoshi-peek-out-right';
  }

  return (
    <div
      className={`fixed z-30 pointer-events-none ${animClass}`}
      style={{
        top: `${appearance.topPercent}%`,
        [isLeft ? 'left' : 'right']: 0,
      }}
    >
      <div className={isLeft ? '' : 'scale-x-[-1]'}>
        <SatoshiNakamoto className="w-20 h-28 drop-shadow-lg opacity-60" />
      </div>
    </div>
  );
}
