/**
 * Haptic feedback utilities for mobile touch interactions
 * Provides fallback behavior for devices without haptic support
 */

export type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'selection' | 'impact';

interface HapticOptions {
  type?: HapticFeedbackType;
  fallback?: boolean;
}

/**
 * Check if haptic feedback is supported on the current device
 */
export const isHapticSupported = (): boolean => {
  return (
    'vibrate' in navigator ||
    ('hapticFeedback' in navigator) ||
    // Check for iOS haptic feedback
    ('webkitVibrate' in navigator) ||
    // Check for modern Vibration API
    ('Vibration' in window)
  );
};

/**
 * Trigger haptic feedback with fallback support
 */
export const triggerHaptic = (options: HapticOptions = {}): void => {
  const { type = 'light', fallback = true } = options;
  
  try {
    // Try modern haptic feedback first (iOS Safari)
    if ('hapticFeedback' in navigator && typeof (navigator as any).hapticFeedback === 'function') {
      (navigator as any).hapticFeedback(type);
      return;
    }
    
    // Try webkit haptic feedback (older iOS)
    if ('webkitVibrate' in navigator && typeof (navigator as any).webkitVibrate === 'function') {
      const pattern = getVibrationPattern(type);
      (navigator as any).webkitVibrate(pattern);
      return;
    }
    
    // Try standard vibration API (Android and some other devices)
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      const pattern = getVibrationPattern(type);
      navigator.vibrate(pattern);
      return;
    }
    
    // Fallback: visual feedback (if enabled)
    if (fallback) {
      triggerVisualFeedback(type);
    }
  } catch (error) {
    // Silently fail - haptic feedback is enhancement, not critical
    console.debug('Haptic feedback failed:', error);
    
    if (fallback) {
      triggerVisualFeedback(type);
    }
  }
};

/**
 * Get vibration pattern based on haptic type
 */
const getVibrationPattern = (type: HapticFeedbackType): number | number[] => {
  switch (type) {
    case 'light':
    case 'selection':
      return 10; // Very short vibration
    case 'medium':
      return 25; // Medium vibration
    case 'heavy':
    case 'impact':
      return 50; // Longer vibration
    default:
      return 15; // Default short vibration
  }
};

/**
 * Visual feedback fallback for devices without haptic support
 */
const triggerVisualFeedback = (type: HapticFeedbackType): void => {
  // Create a subtle visual feedback effect
  const intensity = type === 'heavy' ? 0.15 : type === 'medium' ? 0.1 : 0.05;
  
  // Flash the document background briefly
  const originalFilter = document.body.style.filter;
  document.body.style.filter = `brightness(${1 + intensity})`;
  
  setTimeout(() => {
    document.body.style.filter = originalFilter;
  }, 50);
};

/**
 * Haptic feedback for slider interactions
 */
export const hapticSliderStart = (): void => {
  triggerHaptic({ type: 'light' });
};

export const hapticSliderEnd = (): void => {
  triggerHaptic({ type: 'selection' });
};

/**
 * Haptic feedback for button interactions
 */
export const hapticButtonPress = (): void => {
  triggerHaptic({ type: 'medium' });
};

/**
 * Performance-aware haptic feedback
 * Throttles haptic calls to prevent performance issues
 */
let lastHapticTime = 0;
const HAPTIC_THROTTLE_MS = 50; // Minimum time between haptic calls

export const throttledHaptic = (options: HapticOptions = {}): void => {
  const now = Date.now();
  if (now - lastHapticTime >= HAPTIC_THROTTLE_MS) {
    triggerHaptic(options);
    lastHapticTime = now;
  }
};