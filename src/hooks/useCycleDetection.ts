import { useRef, useCallback } from 'react';

export interface CycleDetectionConfig {
  frequency: number;
  speedRef: React.MutableRefObject<number>;
  onCycleComplete: () => void;
  canvasWidth?: number;
}

export interface CycleDetectionState {
  resetCycle: () => void;
  updatePhase: () => void;
}

export const useCycleDetection = (config: CycleDetectionConfig): CycleDetectionState => {
  const { speedRef, onCycleComplete } = config;
  
  // Simple time-based cycle detection
  const startTimeRef = useRef<number>(Date.now());
  const lastCycleTimeRef = useRef<number>(Date.now());
  
  // Calculate cycle duration based on speed
  // Simple approach: base cycle time divided by speed
  const getCycleDuration = useCallback(() => {
    const speed = speedRef.current || 1;
    // Base cycle duration in milliseconds (adjustable)
    const baseCycleDuration = 3000; // 3 seconds at speed 1
    return baseCycleDuration / speed;
  }, [speedRef]);
  
  // Simple update function that just checks elapsed time
  const updatePhase = useCallback(() => {
    const currentTime = Date.now();
    const cycleDuration = getCycleDuration();
    
    // Check if enough time has passed for a complete cycle
    if (currentTime - lastCycleTimeRef.current >= cycleDuration) {
      onCycleComplete();
      lastCycleTimeRef.current = currentTime;
    }
  }, [getCycleDuration, onCycleComplete]);
  
  // Reset cycle detection state
  const resetCycle = useCallback(() => {
    const currentTime = Date.now();
    startTimeRef.current = currentTime;
    lastCycleTimeRef.current = currentTime;
  }, []);
  
  return {
    resetCycle,
    updatePhase,
  };
};