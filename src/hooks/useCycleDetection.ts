import { useRef, useCallback } from 'react';

export interface CycleDetectionConfig {
  frequency: number;
  speedRef: React.MutableRefObject<number>;
  onCycleComplete: () => void;
  canvasWidth?: number;
}

export interface CycleDetectionState {
  resetCycle: () => void;
  updatePhase: (currentOffset: number) => void;
}

export const useCycleDetection = (config: CycleDetectionConfig): CycleDetectionState => {
  const { frequency, speedRef, onCycleComplete, canvasWidth = 800 } = config;
  
  // Track the last offset where we detected a cycle
  const lastCycleOffsetRef = useRef<number>(0);
  
  // Calculate how much offset represents one complete cycle
  const getOffsetPerCycle = useCallback(() => {
    const scaledFrequency = frequency * (800 / canvasWidth);
    return (2 * Math.PI) / scaledFrequency;
  }, [frequency, canvasWidth]);
  
  // Update function that checks if we've completed a full sine wave cycle
  const updatePhase = useCallback((currentOffset: number) => {
    const offsetPerCycle = getOffsetPerCycle();
    
    // Calculate how many complete cycles have passed since the last detected cycle
    const offsetSinceLastCycle = currentOffset - lastCycleOffsetRef.current;
    
    if (offsetSinceLastCycle >= offsetPerCycle) {
      // We've completed at least one full cycle
      const completedCycles = Math.floor(offsetSinceLastCycle / offsetPerCycle);
      
      // Call onCycleComplete for each completed cycle
      for (let i = 0; i < completedCycles; i++) {
        onCycleComplete();
      }
      
      // Update the last cycle offset to account for all completed cycles
      lastCycleOffsetRef.current += completedCycles * offsetPerCycle;
    }
  }, [getOffsetPerCycle, onCycleComplete]);
  
  // Reset cycle detection state
  const resetCycle = useCallback(() => {
    lastCycleOffsetRef.current = 0;
  }, []);
  
  return {
    resetCycle,
    updatePhase,
  };
};