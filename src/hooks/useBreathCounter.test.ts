import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useBreathCounter } from './useBreathCounter'

describe('useBreathCounter', () => {
  describe('initial state', () => {
    it('should start with count 0', () => {
      const { result } = renderHook(() => useBreathCounter())
      
      expect(result.current.count).toBe(0)
    })

    it('should start with isActive false', () => {
      const { result } = renderHook(() => useBreathCounter())
      
      expect(result.current.isActive).toBe(false)
    })

    it('should use default maxCount of 21', () => {
      const { result } = renderHook(() => useBreathCounter())
      
      // Test the full cycle: 0->1->2->...->21->0
      // After 21 increments, should be at 21
      act(() => {
        for (let i = 0; i < 21; i++) {
          result.current.incrementCounter()
        }
      })
      expect(result.current.count).toBe(21)
      
      // After 1 more increment (22 total), should reset to 0
      act(() => {
        result.current.incrementCounter()
      })
      expect(result.current.count).toBe(0)
    })

    it('should accept custom maxCount', () => {
      const { result } = renderHook(() => useBreathCounter(5))
      
      // Increment to maxCount and verify cycle
      act(() => {
        for (let i = 0; i < 6; i++) {
          result.current.incrementCounter()
        }
      })
      
      expect(result.current.count).toBe(0) // Should reset after reaching 5
    })
  })

  describe('incrementCounter', () => {
    it('should increment count from 0 to 1', () => {
      const { result } = renderHook(() => useBreathCounter())
      
      act(() => {
        result.current.incrementCounter()
      })
      
      expect(result.current.count).toBe(1)
    })

    it('should increment count progressively', () => {
      const { result } = renderHook(() => useBreathCounter())
      
      act(() => {
        result.current.incrementCounter()
        result.current.incrementCounter()
        result.current.incrementCounter()
      })
      
      expect(result.current.count).toBe(3)
    })

    it('should reset to 0 when reaching maxCount (21)', () => {
      const { result } = renderHook(() => useBreathCounter())
      
      // Increment to 21
      act(() => {
        for (let i = 0; i < 21; i++) {
          result.current.incrementCounter()
        }
      })
      
      expect(result.current.count).toBe(21)
      
      // Next increment should reset to 0
      act(() => {
        result.current.incrementCounter()
      })
      
      expect(result.current.count).toBe(0)
    })

    it('should handle multiple complete cycles', () => {
      const { result } = renderHook(() => useBreathCounter())
      
      // Complete two full cycles (0->21->0->21->0)
      act(() => {
        for (let i = 0; i < 44; i++) {
          result.current.incrementCounter()
        }
      })
      
      expect(result.current.count).toBe(0)
    })

    it('should work with custom maxCount', () => {
      const { result } = renderHook(() => useBreathCounter(3))
      
      // Test cycle: 0->1->2->3->0
      act(() => {
        result.current.incrementCounter() // 1
        result.current.incrementCounter() // 2
        result.current.incrementCounter() // 3
      })
      
      expect(result.current.count).toBe(3)
      
      act(() => {
        result.current.incrementCounter() // Should reset to 0
      })
      
      expect(result.current.count).toBe(0)
    })
  })

  describe('resetCounter', () => {
    it('should reset count to 0 from any value', () => {
      const { result } = renderHook(() => useBreathCounter())
      
      // Increment to some value
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.incrementCounter()
        }
      })
      
      expect(result.current.count).toBe(10)
      
      // Reset
      act(() => {
        result.current.resetCounter()
      })
      
      expect(result.current.count).toBe(0)
    })

    it('should reset count to 0 when already at 0', () => {
      const { result } = renderHook(() => useBreathCounter())
      
      expect(result.current.count).toBe(0)
      
      act(() => {
        result.current.resetCounter()
      })
      
      expect(result.current.count).toBe(0)
    })

    it('should reset count to 0 from maxCount', () => {
      const { result } = renderHook(() => useBreathCounter())
      
      // Increment to maxCount (21)
      act(() => {
        for (let i = 0; i < 21; i++) {
          result.current.incrementCounter()
        }
      })
      
      expect(result.current.count).toBe(21)
      
      act(() => {
        result.current.resetCounter()
      })
      
      expect(result.current.count).toBe(0)
    })
  })

  describe('setActive', () => {
    it('should set isActive to true', () => {
      const { result } = renderHook(() => useBreathCounter())
      
      expect(result.current.isActive).toBe(false)
      
      act(() => {
        result.current.setActive(true)
      })
      
      expect(result.current.isActive).toBe(true)
    })

    it('should set isActive to false', () => {
      const { result } = renderHook(() => useBreathCounter())
      
      // First set to true
      act(() => {
        result.current.setActive(true)
      })
      
      expect(result.current.isActive).toBe(true)
      
      // Then set to false
      act(() => {
        result.current.setActive(false)
      })
      
      expect(result.current.isActive).toBe(false)
    })

    it('should not affect counter value', () => {
      const { result } = renderHook(() => useBreathCounter())
      
      // Increment counter
      act(() => {
        result.current.incrementCounter()
        result.current.incrementCounter()
      })
      
      expect(result.current.count).toBe(2)
      
      // Change active state
      act(() => {
        result.current.setActive(true)
      })
      
      expect(result.current.count).toBe(2) // Should remain unchanged
      expect(result.current.isActive).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle maxCount of 0', () => {
      const { result } = renderHook(() => useBreathCounter(0))
      
      expect(result.current.count).toBe(0)
      
      act(() => {
        result.current.incrementCounter()
      })
      
      expect(result.current.count).toBe(0) // Should stay at 0
    })

    it('should handle maxCount of 1', () => {
      const { result } = renderHook(() => useBreathCounter(1))
      
      expect(result.current.count).toBe(0)
      
      act(() => {
        result.current.incrementCounter() // Should go to 1
      })
      
      expect(result.current.count).toBe(1)
      
      act(() => {
        result.current.incrementCounter() // Should reset to 0
      })
      
      expect(result.current.count).toBe(0)
    })

    it('should handle large maxCount values', () => {
      const { result } = renderHook(() => useBreathCounter(1000))
      
      // Increment to 999
      act(() => {
        for (let i = 0; i < 999; i++) {
          result.current.incrementCounter()
        }
      })
      
      expect(result.current.count).toBe(999)
      
      act(() => {
        result.current.incrementCounter() // Should go to 1000
      })
      
      expect(result.current.count).toBe(1000)
      
      act(() => {
        result.current.incrementCounter() // Should reset to 0
      })
      
      expect(result.current.count).toBe(0)
    })
  })

  describe('function stability', () => {
    it('should maintain stable function references', () => {
      const { result, rerender } = renderHook(() => useBreathCounter())
      
      const initialFunctions = {
        resetCounter: result.current.resetCounter,
        incrementCounter: result.current.incrementCounter,
        setActive: result.current.setActive,
      }
      
      // Trigger a re-render
      rerender()
      
      expect(result.current.resetCounter).toBe(initialFunctions.resetCounter)
      expect(result.current.incrementCounter).toBe(initialFunctions.incrementCounter)
      expect(result.current.setActive).toBe(initialFunctions.setActive)
    })

    it('should update function references when maxCount changes', () => {
      const { result, rerender } = renderHook(
        ({ maxCount }) => useBreathCounter(maxCount),
        { initialProps: { maxCount: 21 } }
      )
      
      const initialIncrementCounter = result.current.incrementCounter
      
      // Change maxCount
      rerender({ maxCount: 10 })
      
      // incrementCounter should have a new reference due to maxCount dependency
      expect(result.current.incrementCounter).not.toBe(initialIncrementCounter)
    })
  })
})