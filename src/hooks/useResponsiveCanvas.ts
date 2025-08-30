import { useMemo } from 'react';
import { useViewport } from './useViewport';
import type { ViewportState } from './useViewport';

export interface CanvasDimensions {
  width: number;
  height: number;
  scaleFactor: number;
  displayWidth: number;
  displayHeight: number;
}

interface CanvasConfig {
  baseWidth: number;
  baseHeight: number;
  minWidth: number;
  maxWidth: number;
  aspectRatio: number;
  marginPercentage: number;
}

const DEFAULT_CONFIG: CanvasConfig = {
  baseWidth: 800,
  baseHeight: 300,
  minWidth: 280,
  maxWidth: 1200,
  aspectRatio: 800 / 300, // 2.67:1
  marginPercentage: 0.05, // 5% margin on each side
};

const calculateCanvasDimensions = (
  viewport: ViewportState,
  config: CanvasConfig = DEFAULT_CONFIG
): CanvasDimensions => {
  const { width: viewportWidth, height: viewportHeight, isMobile, isTablet, devicePixelRatio } = viewport;
  
  // Calculate available width considering margins
  const availableWidth = viewportWidth * (1 - config.marginPercentage * 2);
  
  // Determine optimal width based on device type and constraints
  let canvasWidth: number;
  
  if (isMobile) {
    // On mobile, use most of the available width but respect min/max
    canvasWidth = Math.min(Math.max(availableWidth, config.minWidth), config.maxWidth);
    
    // For very small screens, reduce width further
    if (viewportWidth < 480) {
      canvasWidth = Math.min(canvasWidth, viewportWidth * 0.95);
    }
  } else if (isTablet) {
    // On tablets, use a reasonable portion of available width
    canvasWidth = Math.min(availableWidth * 0.8, config.maxWidth);
  } else {
    // On desktop, use base width or available width, whichever is smaller
    canvasWidth = Math.min(config.baseWidth, availableWidth);
  }
  
  // Calculate height maintaining aspect ratio
  let canvasHeight = canvasWidth / config.aspectRatio;
  
  // Ensure height doesn't exceed reasonable viewport percentage
  const maxHeight = viewportHeight * 0.6; // Max 60% of viewport height
  if (canvasHeight > maxHeight) {
    canvasHeight = maxHeight;
    canvasWidth = canvasHeight * config.aspectRatio;
  }
  
  // For mobile portrait mode, reduce height proportionally if needed
  if (isMobile && viewport.orientation === 'portrait' && viewportHeight < 600) {
    const reducedHeight = Math.min(canvasHeight, viewportHeight * 0.4);
    if (reducedHeight < canvasHeight) {
      canvasHeight = reducedHeight;
      canvasWidth = canvasHeight * config.aspectRatio;
    }
  }
  
  // Calculate scale factor for high-DPI displays
  const scaleFactor = devicePixelRatio;
  
  // Physical canvas dimensions (for crisp rendering)
  const physicalWidth = Math.round(canvasWidth * scaleFactor);
  const physicalHeight = Math.round(canvasHeight * scaleFactor);
  
  return {
    width: physicalWidth,
    height: physicalHeight,
    scaleFactor,
    displayWidth: canvasWidth,
    displayHeight: canvasHeight,
  };
};

export const useResponsiveCanvas = (config?: Partial<CanvasConfig>): CanvasDimensions => {
  const viewport = useViewport();
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  
  const dimensions = useMemo(() => {
    return calculateCanvasDimensions(viewport, mergedConfig);
  }, [viewport.width, viewport.height, viewport.orientation, viewport.devicePixelRatio, mergedConfig]);
  
  return dimensions;
};