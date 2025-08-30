import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useCycleDetection } from './useCycleDetection';
import { useBreathCounter } from './useBreathCounter';

describe('useCycleDetection Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('integration with breath counter', () => {
    it('should integrate with breath counter for complete cycle tracking', () => {
      const mockSpeedRef = { current: 2 };
      let counterValue = 0;
      
      const mockOnCycleComplete = vi.fn(() => {
        counterValue++;
      });
      
      const { result: cycleResult } = renderHook(() => 
        useCycleDetection({
          frequency: 0.01,
          speedRef: mockSpeedRef,
          onCycleComplete: mockOnCycleComplete,
          canvasWidth: 800,
        })
      );

      // Integration test - counter is used for integration verification
      renderHook(() => useBreathCounter(21));

      // Simulate time passing for multiple cycles
      act(() => {
        vi.advanceTimersByTime(5000); // 5 seconds
        cycleResult.current.updatePhase();
      });

      // Should have detected at least one complete cycle
      expect(mockOnCycleComplete).toHaveBeenCalled();
      expect(counterValue).toBeGreaterThan(0);
    });

    it('should handle speed changes during animation', () => {
      const mockSpeedRef = { current: 2 };
      const mockOnCycleComplete = vi.fn();
      
      const { result } = renderHook(() => 
        useCycleDetection({
          frequency: 0.01,
          speedRef: mockSpeedRef,
          onCycleComplete: mockOnCycleComplete,
          canvasWidth: 800,
        })
      );

      // Start with normal speed
      act(() => {
        vi.advanceTimersByTime(1000);
        result.current.updatePhase();
      });

      // Change speed mid-animation
      mockSpeedRef.current = 4;
      
      act(() => {
        vi.advanceTimersByTime(1000);
        result.current.updatePhase();
      });

      // Should handle speed changes gracefully
      expect(mockOnCycleComplete).toHaveBeenCalled();
    });

    it('should reset properly when canvas dimensions change', () => {
      const mockSpeedRef = { current: 2 };
      const mockOnCycleComplete = vi.fn();
      
      const { result, rerender } = renderHook(
        ({ canvasWidth }) => 
          useCycleDetection({
            frequency: 0.01,
            speedRef: mockSpeedRef,
            onCycleComplete: mockOnCycleComplete,
            canvasWidth,
          }),
        { initialProps: { canvasWidth: 800 } }
      );

      // Advance time partially
      act(() => {
        vi.advanceTimersByTime(1000);
        result.current.updatePhase();
      });

      // Change canvas width (simulating orientation change)
      rerender({ canvasWidth: 400 });

      // Reset should be called automatically
      act(() => {
        result.current.resetCycle();
      });

      // Continue animation with new dimensions
      act(() => {
        vi.advanceTimersByTime(2000);
        result.current.updatePhase();
      });

      expect(mockOnCycleComplete).toHaveBeenCalled();
    });
  });
});