import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useCycleDetection } from './useCycleDetection';
import type { CycleDetectionConfig } from './useCycleDetection';

describe('useCycleDetection', () => {
  let mockOnCycleComplete: ReturnType<typeof vi.fn>;
  let speedRef: React.MutableRefObject<number>;

  beforeEach(() => {
    mockOnCycleComplete = vi.fn();
    speedRef = { current: 2 };
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

  describe('offset-based cycle detection', () => {
    it('should call onCycleComplete when offset advances by one complete cycle', () => {
      const config = createConfig();
      const { result } = renderHook(() => useCycleDetection(config));

      // Calculate expected offset per cycle: 2π / scaledFrequency
      const scaledFrequency = config.frequency * (800 / config.canvasWidth!); // 0.01
      const offsetPerCycle = (2 * Math.PI) / scaledFrequency; // ~628.32

      // Simulate offset advancing by one complete cycle
      act(() => {
        result.current.updatePhase(offsetPerCycle);
      });

      expect(mockOnCycleComplete).toHaveBeenCalledTimes(1);
    });

    it('should call onCycleComplete multiple times for multiple cycles', () => {
      const config = createConfig();
      const { result } = renderHook(() => useCycleDetection(config));

      const scaledFrequency = config.frequency * (800 / config.canvasWidth!);
      const offsetPerCycle = (2 * Math.PI) / scaledFrequency;

      // Simulate offset advancing by 2.5 complete cycles
      act(() => {
        result.current.updatePhase(offsetPerCycle * 2.5);
      });

      // Should call onCycleComplete twice (for 2 complete cycles)
      expect(mockOnCycleComplete).toHaveBeenCalledTimes(2);
    });

    it('should adjust cycle detection for different canvas widths', () => {
      const config = createConfig({ canvasWidth: 400 }); // Half the default width
      const { result } = renderHook(() => useCycleDetection(config));

      // With half the canvas width, scaledFrequency doubles, so offsetPerCycle halves
      const scaledFrequency = config.frequency * (800 / config.canvasWidth!); // 0.02
      const offsetPerCycle = (2 * Math.PI) / scaledFrequency; // ~314.16

      act(() => {
        result.current.updatePhase(offsetPerCycle);
      });

      expect(mockOnCycleComplete).toHaveBeenCalledTimes(1);
    });

    it('should reset cycle tracking when resetCycle is called', () => {
      const config = createConfig();
      const { result } = renderHook(() => useCycleDetection(config));

      const scaledFrequency = config.frequency * (800 / config.canvasWidth!);
      const offsetPerCycle = (2 * Math.PI) / scaledFrequency;

      // Advance by partial cycle
      act(() => {
        result.current.updatePhase(offsetPerCycle * 0.5);
      });

      expect(mockOnCycleComplete).not.toHaveBeenCalled();

      // Reset cycle detection
      act(() => {
        result.current.resetCycle();
      });

      // Advance by another partial cycle (should not complete yet)
      act(() => {
        result.current.updatePhase(offsetPerCycle * 0.5);
      });

      expect(mockOnCycleComplete).not.toHaveBeenCalled();

      // Advance by full cycle from current position
      act(() => {
        result.current.updatePhase(offsetPerCycle * 1.5);
      });

      expect(mockOnCycleComplete).toHaveBeenCalledTimes(1);
    });

    it('should not call onCycleComplete for partial cycles', () => {
      const config = createConfig();
      const { result } = renderHook(() => useCycleDetection(config));

      const scaledFrequency = config.frequency * (800 / config.canvasWidth!);
      const offsetPerCycle = (2 * Math.PI) / scaledFrequency;

      // Advance by 90% of a cycle
      act(() => {
        result.current.updatePhase(offsetPerCycle * 0.9);
      });

      expect(mockOnCycleComplete).not.toHaveBeenCalled();
    });
  });
});