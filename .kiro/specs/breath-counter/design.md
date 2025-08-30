# Design Document

## Overview

The breath counter feature adds a visual cycle counter to the existing breath timer sine wave application. The counter displays the current breathing cycle count (0-21) and increments each time the sine wave completes a full period. This enhancement provides users with progress tracking during structured breathing exercises while maintaining the clean, mobile-friendly design of the existing application.

The counter will be implemented as a React state-managed component that synchronizes with the existing sine wave animation timing through cycle detection logic. The design prioritizes mobile responsiveness, accessibility, and seamless integration with the current codebase.

## Architecture

### Component Structure
```
BreathTimer (existing)
├── Canvas (existing sine wave)
├── Controls Container (existing)
│   ├── MobileSlider components (existing)
│   ├── MobileButton (existing)
│   └── BreathCounter (new)
└── Counter Display (new overlay/positioned element)
```

### State Management
- **Counter State**: React useState for current count (0-21)
- **Cycle Detection**: Custom hook to detect sine wave cycle completions
- **Synchronization**: Integration with existing animation refs and timing

### Integration Points
- **Animation Loop**: Hook into existing `draw()` function for cycle detection
- **Responsive System**: Leverage existing `useViewport` and `useResponsiveCanvas` hooks
- **Styling System**: Extend existing CSS variables and mobile-first approach

## Components and Interfaces

### 1. BreathCounter Component

```typescript
interface BreathCounterProps {
  count: number;
  maxCount: number;
  position?: 'overlay' | 'controls';
  size?: 'small' | 'medium' | 'large';
}

const BreathCounter: React.FC<BreathCounterProps> = ({
  count,
  maxCount = 21,
  position = 'overlay',
  size = 'medium'
}) => {
  // Component implementation
};
```

**Responsibilities:**
- Display current count with clear typography
- Handle responsive sizing based on viewport
- Provide smooth count transition animations
- Maintain accessibility standards (ARIA labels, semantic markup)

### 2. useCycleDetection Hook

```typescript
interface CycleDetectionConfig {
  frequency: number;
  speedRef: React.MutableRefObject<number>;
  onCycleComplete: () => void;
}

const useCycleDetection = (config: CycleDetectionConfig) => {
  // Cycle detection logic
  return {
    currentPhase: number,
    cycleProgress: number,
    resetCycle: () => void
  };
};
```

**Responsibilities:**
- Monitor sine wave phase progression
- Detect complete cycle transitions (0 → 2π)
- Trigger counter increment callbacks
- Handle animation speed changes dynamically

### 3. useBreathCounter Hook

```typescript
interface BreathCounterState {
  count: number;
  isActive: boolean;
  resetCounter: () => void;
  incrementCounter: () => void;
}

const useBreathCounter = (maxCount: number = 21): BreathCounterState => {
  // Counter state management
};
```

**Responsibilities:**
- Manage counter state (0-21 cycling)
- Handle counter reset logic
- Provide counter control methods
- Maintain counter persistence during animation changes

## Data Models

### Counter State Model
```typescript
interface CounterState {
  currentCount: number;        // 0-21
  maxCount: number;           // 21 (configurable)
  isActive: boolean;          // Animation state
  lastCycleTime: number;      // Timestamp of last cycle
}
```

### Cycle Detection Model
```typescript
interface CycleState {
  currentPhase: number;       // 0-2π radians
  previousPhase: number;      // Previous frame phase
  cycleCount: number;         // Total cycles detected
  phaseDirection: 1 | -1;     // Phase progression direction
}
```

### Display Configuration Model
```typescript
interface CounterDisplayConfig {
  position: {
    x: number | 'auto';
    y: number | 'auto';
  };
  styling: {
    fontSize: string;
    fontWeight: string;
    color: string;
    backgroundColor?: string;
  };
  responsive: {
    mobile: Partial<CounterDisplayConfig>;
    tablet: Partial<CounterDisplayConfig>;
    desktop: Partial<CounterDisplayConfig>;
  };
}
```

## Error Handling

### Animation Synchronization Errors
- **Issue**: Counter desynchronization from sine wave
- **Handling**: Implement phase validation and automatic resync
- **Recovery**: Reset counter and cycle detection on significant drift

### Performance Degradation
- **Issue**: High-frequency cycle detection impacting animation performance
- **Handling**: Throttle cycle detection calculations
- **Recovery**: Fallback to time-based estimation if performance drops

### Mobile Rendering Issues
- **Issue**: Counter positioning problems on orientation change
- **Handling**: Leverage existing orientation change handlers
- **Recovery**: Recalculate positions using responsive canvas dimensions

### State Persistence Errors
- **Issue**: Counter state loss during component re-renders
- **Handling**: Use refs for animation-critical state
- **Recovery**: Implement state recovery from animation context

## Testing Strategy

### Unit Tests
1. **BreathCounter Component**
   - Render with different props combinations
   - Responsive behavior across viewport sizes
   - Accessibility compliance (ARIA attributes, semantic HTML)
   - Animation transitions and state updates

2. **useCycleDetection Hook**
   - Cycle completion detection accuracy
   - Speed change adaptation
   - Phase calculation correctness
   - Edge cases (very slow/fast speeds)

3. **useBreathCounter Hook**
   - Counter increment/reset logic
   - 0-21 cycling behavior
   - State persistence across re-renders
   - Integration with cycle detection

### Integration Tests
1. **Counter-Animation Synchronization**
   - Verify counter increments match sine wave cycles
   - Test synchronization across different animation speeds
   - Validate behavior during animation pause/resume
   - Confirm accuracy across amplitude changes

2. **Responsive Behavior**
   - Counter positioning across device types
   - Orientation change handling
   - Canvas resize synchronization
   - Mobile touch interaction compatibility

3. **Performance Testing**
   - Animation frame rate impact measurement
   - Memory usage monitoring during long sessions
   - Cycle detection computational overhead
   - Mobile device performance validation

### Visual Regression Tests
1. **Counter Display**
   - Typography rendering across browsers
   - Position accuracy on different screen sizes
   - Color contrast and visibility
   - Animation smoothness verification

2. **Integration Appearance**
   - Counter visibility against sine wave background
   - Control layout preservation
   - Mobile landscape/portrait layouts
   - Dark/light theme compatibility

### Accessibility Tests
1. **Screen Reader Compatibility**
   - Counter value announcements
   - Semantic markup validation
   - ARIA label effectiveness
   - Focus management (if interactive)

2. **Motor Accessibility**
   - Touch target sizing (if applicable)
   - Gesture conflict avoidance
   - High contrast mode support
   - Reduced motion preference handling

## Implementation Approach

### Phase 1: Core Counter Logic
- Implement `useBreathCounter` hook with basic 0-21 cycling
- Create `BreathCounter` component with responsive typography
- Add basic positioning and styling

### Phase 2: Cycle Detection Integration
- Develop `useCycleDetection` hook with sine wave monitoring
- Integrate cycle detection with existing animation loop
- Implement counter increment triggering

### Phase 3: Mobile Optimization
- Enhance responsive positioning logic
- Optimize for touch devices and orientation changes
- Implement performance optimizations

### Phase 4: Polish and Testing
- Add smooth transition animations
- Implement comprehensive error handling
- Complete accessibility enhancements
- Conduct thorough testing across devices

## Technical Considerations

### Performance Optimization
- Use `useCallback` and `useMemo` for expensive calculations
- Implement cycle detection throttling to maintain 60fps
- Leverage existing animation frame scheduling
- Minimize DOM updates through efficient state management

### Mobile-First Design
- Utilize existing CSS variable system for consistent spacing
- Extend current responsive breakpoint strategy
- Maintain touch-friendly interaction patterns
- Preserve existing mobile browser behavior prevention

### Accessibility Compliance
- Follow WCAG 2.1 AA guidelines for color contrast
- Implement proper semantic markup structure
- Provide screen reader announcements for count changes
- Support reduced motion preferences

### Browser Compatibility
- Maintain compatibility with existing browser support matrix
- Use progressive enhancement for advanced features
- Implement fallbacks for older mobile browsers
- Test across iOS Safari, Chrome Mobile, and Firefox Mobile