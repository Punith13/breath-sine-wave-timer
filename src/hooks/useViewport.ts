import { useState, useEffect } from 'react';

export interface ViewportState {
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  devicePixelRatio: number;
}

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

const getDeviceType = (width: number) => {
  const isMobile = width < MOBILE_BREAKPOINT;
  const isTablet = width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT;
  const isDesktop = width >= TABLET_BREAKPOINT;
  
  return { isMobile, isTablet, isDesktop };
};

const getViewportState = (): ViewportState => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const orientation = width > height ? 'landscape' : 'portrait';
  const devicePixelRatio = window.devicePixelRatio || 1;
  const { isMobile, isTablet, isDesktop } = getDeviceType(width);

  return {
    width,
    height,
    orientation,
    isMobile,
    isTablet,
    isDesktop,
    devicePixelRatio,
  };
};

export const useViewport = (): ViewportState => {
  const [viewport, setViewport] = useState<ViewportState>(getViewportState);

  useEffect(() => {
    const handleResize = () => {
      setViewport(getViewportState());
    };

    const handleOrientationChange = () => {
      // Small delay to ensure dimensions are updated after orientation change
      setTimeout(() => {
        setViewport(getViewportState());
      }, 100);
    };

    // Add event listeners
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true });

    // Cleanup event listeners
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return viewport;
};