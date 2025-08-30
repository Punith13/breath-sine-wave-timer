# Design Document

## Overview

The mobile-friendly breath timer design transforms the existing fixed-width canvas application into a fully responsive, touch-optimized experience. The design maintains the core sine wave visualization while adapting the interface for mobile devices through responsive canvas sizing, touch-friendly controls, and mobile-first CSS approaches.

## Architecture

### Responsive Canvas Strategy

The current fixed 800x300px canvas will be replaced with a dynamic sizing system:

- **Container-based sizing**: Canvas dimensions calculated based on parent container width
- **Aspect ratio preservation**: Maintain visual proportions across different screen sizes  
- **DPR (Device Pixel Ratio) handling**: Support high-DPI displays for crisp rendering
- **Orientation adaptation**: Different sizing strategies for portrait vs landscape modes

### Mobile-First CSS Architecture

- **CSS Custom Properties**: Define responsive breakpoints and sizing variables
- **Container Queries**: Use modern CSS container queries where supported, with fallbacks
- **Touch Target Optimization**: Ensure all interactive elements meet 44px minimum size
- **Safe Area Handling**: Support devices with notches and rounded corners

### State Management Enhancements

- **Viewport tracking**: Add state for current screen dimensions and orientation
- **Touch interaction state**: Track touch events for enhanced mobile interactions
- **Performance monitoring**: Optional frame rate tracking for mobile optimization

## Components and Interfaces

### Enhanced BreathTimer Component

```typescript
interface ViewportState {
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  isMobile: boolean;
  devicePixelRatio: number;
}

interface CanvasDimensions {
  width: number;
  height: number;
  scaleFactor: number;
}

interface TouchInteractionState {
  isInteracting: boolean;
  activeControl: 'amplitude' | 'speed' | null;
}
```

### Responsive Canvas Hook

A custom hook `useResponsiveCanvas` will handle:
- Canvas dimension calculations
- Device pixel ratio adjustments
- Resize event handling
- Performance optimization for mobile devices

### Mobile Detection Utilities

- **Device type detection**: Distinguish between mobile, tablet, and desktop
- **Touch capability detection**: Detect touch vs mouse input
- **Performance tier detection**: Identify device performance capabilities

## Data Models

### Canvas Configuration

```typescript
interface CanvasConfig {
  baseWidth: number;          // Reference width for calculations
  baseHeight: number;         // Reference height for calculations
  minWidth: number;           // Minimum canvas width
  maxWidth: number;           // Maximum canvas width
  aspectRatio: number;        // Width/height ratio to maintain
  marginPercentage: number;   // Screen margin as percentage
}
```

### Responsive Breakpoints

```typescript
interface Breakpoints {
  mobile: number;     // 0-767px
  tablet: number;     // 768-1023px
  desktop: number;    // 1024px+
}

interface ResponsiveConfig {
  canvas: {
    mobile: CanvasConfig;
    tablet: CanvasConfig;
    desktop: CanvasConfig;
  };
  controls: {
    mobile: ControlConfig;
    tablet: ControlConfig;
    desktop: ControlConfig;
  };
}
```

## Error Handling

### Canvas Rendering Errors

- **Fallback dimensions**: Use safe default sizes if calculation fails
- **Context creation failure**: Provide user-friendly error message
- **Performance degradation**: Automatically reduce animation complexity on slow devices

### Touch Interaction Errors

- **Touch event conflicts**: Prevent default browser behaviors appropriately
- **Gesture interference**: Handle conflicts with browser gestures (zoom, scroll)
- **Input validation**: Ensure slider values remain within valid ranges during touch

### Responsive Layout Errors

- **Viewport detection failure**: Fallback to conservative mobile layout
- **Orientation change handling**: Graceful handling of rapid orientation changes
- **Container size calculation**: Safe defaults when container queries fail

## Testing Strategy

### Responsive Design Testing

1. **Viewport Testing**: Test across standard mobile, tablet, and desktop viewports
2. **Orientation Testing**: Verify smooth transitions between portrait and landscape
3. **Device Simulation**: Test on various device simulators and real devices
4. **Cross-browser Testing**: Ensure compatibility across mobile browsers

### Touch Interaction Testing

1. **Touch Target Testing**: Verify all interactive elements meet accessibility guidelines
2. **Gesture Testing**: Ensure no conflicts with browser gestures
3. **Multi-touch Testing**: Handle edge cases with multiple simultaneous touches
4. **Haptic Feedback Testing**: Verify haptic feedback works where supported

### Performance Testing

1. **Animation Performance**: Measure frame rates across different devices
2. **Memory Usage**: Monitor memory consumption during extended use
3. **Battery Impact**: Test battery usage on mobile devices
4. **Load Time Testing**: Ensure fast initial load on mobile networks

### Accessibility Testing

1. **Screen Reader Testing**: Ensure canvas content is accessible
2. **High Contrast Testing**: Verify visibility in high contrast modes
3. **Font Size Testing**: Test with user-adjusted font sizes
4. **Motor Accessibility**: Ensure controls work with assistive devices

## Implementation Approach

### Phase 1: Responsive Canvas Foundation
- Implement dynamic canvas sizing system
- Add viewport detection and tracking
- Create responsive canvas hook
- Update canvas rendering to handle variable dimensions

### Phase 2: Mobile-Optimized Controls
- Enhance slider components for touch interaction
- Implement larger touch targets
- Add haptic feedback support
- Optimize control layout for mobile

### Phase 3: Layout and Styling
- Implement responsive CSS architecture
- Add mobile-first media queries
- Handle orientation changes
- Implement safe area support

### Phase 4: Performance and Polish
- Optimize animation performance for mobile
- Add performance monitoring
- Implement graceful degradation
- Final cross-device testing and refinement

## Technical Considerations

### Canvas Scaling Strategy

The canvas will use a two-step scaling approach:
1. **Logical scaling**: Adjust canvas logical dimensions based on container
2. **Physical scaling**: Apply device pixel ratio for crisp rendering on high-DPI displays

### CSS Architecture

- **Mobile-first approach**: Base styles for mobile, enhanced for larger screens
- **CSS custom properties**: Dynamic values for responsive calculations
- **Container queries**: Modern responsive design where supported
- **Fallback strategies**: Ensure compatibility with older mobile browsers

### Performance Optimizations

- **Conditional rendering**: Reduce animation complexity on slower devices
- **Frame rate adaptation**: Dynamically adjust animation frame rate
- **Memory management**: Efficient canvas context handling
- **Touch event optimization**: Passive event listeners where appropriate