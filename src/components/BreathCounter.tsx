import React from 'react';
import { useViewport } from '../hooks/useViewport';

export interface BreathCounterProps {
  count: number;
  maxCount?: number;
  position?: 'overlay' | 'controls' | 'above-canvas';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const BreathCounter: React.FC<BreathCounterProps> = ({
  count,
  maxCount = 21,
  position = 'overlay',
  size = 'medium',
  className = '',
}) => {
  const viewport = useViewport();

  // Determine responsive size based on viewport
  const responsiveSize = React.useMemo(() => {
    if (size !== 'medium') return size; // Respect explicit size prop

    if (viewport.isMobile) {
      return viewport.orientation === 'landscape' ? 'small' : 'medium';
    } else if (viewport.isTablet) {
      return 'medium';
    } else {
      return 'large';
    }
  }, [size, viewport.isMobile, viewport.isTablet, viewport.orientation]);

  // Determine responsive position adjustments
  const positionModifier = React.useMemo(() => {
    if (position !== 'overlay') return '';

    const modifiers = [];

    if (viewport.isMobile) {
      modifiers.push('mobile');
      if (viewport.orientation === 'landscape') {
        modifiers.push('landscape');
      } else {
        modifiers.push('portrait');
      }
    } else if (viewport.isTablet) {
      modifiers.push('tablet');
    } else {
      modifiers.push('desktop');
    }

    return modifiers.join('-');
  }, [position, viewport.isMobile, viewport.isTablet, viewport.orientation]);

  const counterClasses = [
    'breath-counter',
    `breath-counter--${position}`,
    `breath-counter--${responsiveSize}`,
    positionModifier && `breath-counter--${positionModifier}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={counterClasses}
      role="status"
      aria-live="polite"
      aria-label={`Breathing cycle counter: ${count} of ${maxCount}`}
      data-viewport-width={viewport.width}
      data-viewport-height={viewport.height}
      data-orientation={viewport.orientation}
    >
      <span className="breath-counter__label" aria-hidden="true">
        Cycles :
      </span>
      <span className="breath-counter__count" aria-hidden="true">
        {count}
      </span>
      <span className="breath-counter__separator" aria-hidden="true">
        /
      </span>
      <span className="breath-counter__max" aria-hidden="true">
        {maxCount}
      </span>
      <span className="sr-only">
        Breathing cycle {count} of {maxCount}
      </span>
    </div>
  );
};