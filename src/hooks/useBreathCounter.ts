import { useState, useCallback } from 'react';

export interface BreathCounterState {
  count: number;
  isActive: boolean;
  resetCounter: () => void;
  incrementCounter: () => void;
  setActive: (active: boolean) => void;
}

export const useBreathCounter = (maxCount: number = 21): BreathCounterState => {
  const [count, setCount] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  const resetCounter = useCallback(() => {
    setCount(0);
  }, []);

  const incrementCounter = useCallback(() => {
    setCount(prevCount => {
      // Cycle from 0 to maxCount (inclusive), then reset to 0
      // For maxCount=21: 0→1→2→...→21→0
      return prevCount >= maxCount ? 0 : prevCount + 1;
    });
  }, [maxCount]);

  const setActive = useCallback((active: boolean) => {
    setIsActive(active);
  }, []);

  return {
    count,
    isActive,
    resetCounter,
    incrementCounter,
    setActive,
  };
};