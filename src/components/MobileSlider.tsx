import React, { useState, useRef, useCallback } from 'react';
import { hapticSliderStart, hapticSliderEnd } from '../utils/haptics';

interface MobileSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  enableHaptics?: boolean;
}

export const MobileSlider: React.FC<MobileSliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  onTouchStart,
  onTouchEnd,
  enableHaptics = true,
}) => {
  const [isInteracting, setIsInteracting] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);

  const handleTouchStart = useCallback(() => {
    setIsInteracting(true);
    if (enableHaptics) {
      hapticSliderStart();
    }
    onTouchStart?.();
  }, [onTouchStart, enableHaptics]);

  const handleTouchEnd = useCallback(() => {
    setIsInteracting(false);
    if (enableHaptics) {
      hapticSliderEnd();
    }
    onTouchEnd?.();
  }, [onTouchEnd, enableHaptics]);

  const handleMouseDown = useCallback(() => {
    setIsInteracting(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsInteracting(false);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  }, [onChange]);

  return (
    <div className="mobile-slider-container">
      <label className="mobile-slider-label">
        {label} ({value})
      </label>
      <div className="mobile-slider-wrapper">
        <input
          ref={sliderRef}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className={`mobile-slider ${isInteracting ? 'mobile-slider--active' : ''}`}
          aria-label={`${label} slider, current value ${value}`}
        />
      </div>
    </div>
  );
};