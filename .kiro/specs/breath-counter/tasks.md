# Implementation Plan

- [x] 1. Create core counter state management hook
  - Implement `useBreathCounter` hook with counter state (0-21 cycling logic)
  - Add counter increment, reset, and state management functions
  - Write unit tests for counter logic and edge cases
  - _Requirements: 1.1, 1.3, 4.4_

- [x] 2. Implement cycle detection system
  - Create `useCycleDetection` hook to monitor sine wave phase progression
  - Add logic to detect complete sine wave cycles (0 → 2π transitions)
  - Integrate cycle detection with existing animation timing and speed changes
  - Write unit tests for cycle detection accuracy across different speeds
  - _Requirements: 1.2, 3.1, 3.2, 3.3_

- [x] 3. Create BreathCounter display component
  - Implement `BreathCounter` React component with responsive typography
  - Add proper semantic markup and ARIA labels for accessibility
  - Create component interface with configurable positioning and sizing props
  - Write unit tests for component rendering and prop handling
  - _Requirements: 2.1, 2.2, 5.4_

- [x] 4. Add responsive positioning and mobile optimization
  - Implement counter positioning logic that works across all device types
  - Add CSS styles using existing variable system for mobile-first responsive design
  - Ensure counter visibility and contrast against sine wave background
  - Handle orientation changes using existing viewport hooks
  - _Requirements: 2.4, 2.5, 2.6, 5.1, 5.2, 5.5_

- [x] 5. Integrate counter with existing animation system
  - Connect cycle detection hook to existing sine wave animation loop
  - Add counter increment triggering when cycles complete
  - Ensure counter synchronization with animation pause/resume functionality
  - Maintain counter timing accuracy when amplitude or speed controls are adjusted
  - _Requirements: 1.2, 1.4, 1.5, 4.1, 4.3, 5.3_

- [ ] 6. Add counter display to main application
  - Integrate BreathCounter component into existing App.tsx layout
  - Position counter appropriately within existing responsive grid system
  - Ensure counter doesn't interfere with existing controls or canvas
  - Test integration across different screen sizes and orientations
  - _Requirements: 2.1, 4.2, 5.1, 5.2_

- [ ] 7. Implement smooth transitions and animations
  - Add CSS transitions for counter value changes
  - Implement smooth count increment animations that aren't jarring
  - Ensure animations respect reduced motion preferences
  - Test animation performance impact on main sine wave animation
  - _Requirements: 2.3_

- [ ] 8. Add comprehensive error handling and edge cases
  - Implement counter desynchronization detection and recovery
  - Add fallback behavior for animation performance issues
  - Handle edge cases like very fast/slow animation speeds
  - Add error boundaries and graceful degradation for counter failures
  - _Requirements: 3.2, 3.3, 4.1_

- [ ] 9. Write integration tests for counter synchronization
  - Create tests verifying counter increments match sine wave cycles exactly
  - Test counter behavior across different animation speeds and amplitudes
  - Verify counter accuracy during animation pause/resume cycles
  - Test counter reset functionality and 0-21 cycling behavior
  - _Requirements: 1.1, 1.2, 1.3, 3.1, 3.2, 3.3_

- [ ] 10. Conduct mobile device testing and optimization
  - Test counter visibility and positioning on actual mobile devices
  - Verify touch interaction compatibility with existing controls
  - Test orientation change behavior and counter repositioning
  - Optimize performance for lower-end mobile devices
  - _Requirements: 2.4, 2.5, 2.6, 5.1, 5.2, 5.3, 5.5_