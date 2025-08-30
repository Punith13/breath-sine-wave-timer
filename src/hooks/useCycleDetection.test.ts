import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useCycleDetection } from './useCycleDetection';
import type { CycleDetectionConfig } from './useCycleDetection';

describe('useCycleDetection', () => {
  let mockOnCycleComplete: ReturnType<typeof vi.fn>;
  let speedRef: React.MutableRefObject<number>;

  beforeEach(() => {
    mockOnCycleComplete = vi.fn();
    speedRef = { current: 2 };
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createConfig = (overrides: Partial<CycleDetectionConfig> = {}): CycleDetectionConfig => ({
    frequency: 0.01,
    speedRef,
    onCycleComplete: mockOnCycleComplete,
    canvasWidth: 800,
    ...overrides,
  });

  describe('initialization', () => {
    it('should initialize with required functions', () => {
      const config = createConfig();
      const { result } = renderHook(() => useCycleDetection(config));

      expect(typeof result.current.resetCycle).toBe('function');
      expect(typeof result.current.updatePhase).toBe('function');
    });
  });

  describe('time-based cycle detection', () => {
    it('should call onCycleComplete after sufficient time has passed', () => {
      const config = createConfig();
      const { result } = renderHook(() => useCycleDetection(config));

      // Simulate time passing for one complete cycle
      act(() => {
        vi.advanceTimersByTime(2000); // Advance by 2 seconds
        result.current.updatePhase();
      });

      expect(mockOnCycleComplete).toHaveBeenCalled();
    });

    it('should not call onCycleComplete before sufficient time has passed', () => {
      const config = createConfig();
      const { result } = renderHook(() => useCycleDetection(config));

      // Simulate short time passing
      act(() => {
        vi.advanceTimersByTime(100); // Advance by 100ms
        result.current.updatePhase();
      });

      expect(mockOnCycleComplete).not.toHaveBeenCalled();
    });

    it('should reset cycle timing when resetCycle is called', () => {
      const config = createConfig();
      const { result } = renderHook(() => useCycleDetection(config));

      // Advance time partially
      act(() => {
        vi.advanceTimersByTime(1000);
        result.current.updatePhase();
      });

      // Reset cycle
      act(() => {
        result.current.resetCycle();
      });

      // Advance time again (should not trigger cycle complete yet)
      act(() => {
        vi.advanceTimersByTime(1000);
        result.current.updatePhase();
      });

      expect(mockOnCycleComplete).not.toHaveBeenCalled();
    });
  });

  describe('different speeds', () => {
    it('should adjust cycle timing based on speed', () => {
      speedRef.current = 4; // Double the speed
      const config = createConfig();
      const { result } = renderHook(() => useCycleDetection(config));

      // At double speed, cycles should complete faster
      act(() => {
        vi.advanceTimersByTime(1000); // Less time needed
        result.current.updatePhase();
      });

      expect(mockOnCycleComplete).toHaveBeenCalled();
    });
  });
});