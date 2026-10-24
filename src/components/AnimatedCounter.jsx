import React, { useState, useEffect, useRef } from 'react';

/**
 * AnimatedCounter component
 * Optimized to prevent freezing/lagging when navigating or loading views.
 * On mount, immediately renders the target value so numbers never freeze, stutter,
 * or sit on 0 or intermediate integers.
 */
export default function AnimatedCounter({
  value = 0,
  duration = 0,
  formatter,
  prefix = '',
  suffix = ''
}) {
  const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const [displayValue, setDisplayValue] = useState(numValue);
  const prevValueRef = useRef(numValue);

  useEffect(() => {
    // If value has not changed or duration is 0, update immediately without animation
    if (prevValueRef.current === numValue || duration <= 0) {
      setDisplayValue(numValue);
      prevValueRef.current = numValue;
      return;
    }

    // For small differences, avoid jerky animation
    if (Math.abs(numValue - prevValueRef.current) < 5) {
      setDisplayValue(numValue);
      prevValueRef.current = numValue;
      return;
    }

    const start = prevValueRef.current;
    const end = numValue;
    const animDuration = Math.min(duration, 350);
    let startTimestamp = null;
    let animationFrameId = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / animDuration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * ease);

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(end);
        prevValueRef.current = end;
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [numValue, duration]);

  const formatted = formatter
    ? formatter(displayValue)
    : displayValue.toLocaleString();

  return (
    <span className="inline-block tabular-nums">
      {prefix}{formatted}{suffix}
    </span>
  );
}
