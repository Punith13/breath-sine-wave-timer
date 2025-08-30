import  { useRef, useEffect, useState, useCallback } from "react";
import { useResponsiveCanvas, useViewport } from "./hooks";
// import { useBreathCounter, useCycleDetection } from "./hooks";
import { MobileSlider, MobileButton } from "./components";
import "./components/MobileSlider.css";
import "./components/MobileButton.css";
import "./components/BreathCounter.css";

const BreathTimer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offsetRef = useRef(0);
  const amplitudeRef = useRef(100);
  const speedRef = useRef(2);
  const animationIdRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);

  const [tempAmplitude, setTempAmplitude] = useState(100);
  const [tempSpeed, setTempSpeed] = useState(2);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isOrientationChanging, setIsOrientationChanging] = useState(false);

  const frequency = 0.01;
  
  // Get responsive canvas dimensions and viewport state
  const canvasDimensions = useResponsiveCanvas();
  const viewport = useViewport();
  const previousOrientationRef = useRef(viewport.orientation);

  // Initialize breath counter
  // const breathCounter = useBreathCounter(21);

  // Initialize cycle detection with counter integration
  // const cycleDetection = useCycleDetection({
  //   frequency,
  //   speedRef,
  //   onCycleComplete: breathCounter.incrementCounter,
  //   canvasWidth: canvasDimensions.displayWidth,
  // });

  // Animation function that maintains state across orientation changes
  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas physical dimensions for crisp rendering
    canvas.width = canvasDimensions.width;
    canvas.height = canvasDimensions.height;
    
    // Set canvas display dimensions
    canvas.style.width = `${canvasDimensions.displayWidth}px`;
    canvas.style.height = `${canvasDimensions.displayHeight}px`;
    
    // Scale context for device pixel ratio
    ctx.scale(canvasDimensions.scaleFactor, canvasDimensions.scaleFactor);

    const width = canvasDimensions.displayWidth;
    const height = canvasDimensions.displayHeight;
    
    // Calculate scaling factors based on original 800x300 canvas
    const heightScale = height / 300;
    
    // Scale ball position and size proportionally to canvas dimensions
    const ballRadius = Math.max(6, Math.min(width * 0.02, height * 0.05)); // Responsive to both width and height
    const ballX = width - (ballRadius * 2.5); // Position ball with proportional margin

    let flashVisible = false;
    let flashColor = "";
    let lastFlashTime = 0;

    const draw = () => {
      // Check if animation should continue
      if (!isAnimatingRef.current) return;

      ctx.clearRect(0, 0, width, height);

      // Scale amplitude proportionally to canvas height while respecting user setting
      const scaledAmplitude = amplitudeRef.current * heightScale;
      
      // Draw sine wave with scaled frequency to maintain wave count across different widths
      const scaledFrequency = frequency * (800 / width); // Maintain consistent wave frequency
      ctx.beginPath();
      for (let x = 0; x <= ballX; x++) {
        const y = height / 2 + scaledAmplitude * Math.sin(scaledFrequency * (x + offsetRef.current));
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "#0077ff";
      ctx.lineWidth = Math.max(1, Math.min(width * 0.0025, height * 0.006)); // Scale line width to both dimensions
      ctx.stroke();

      const ballY = height / 2 + scaledAmplitude * Math.sin(scaledFrequency * (ballX + offsetRef.current));

      // Draw red leading ball with proportional size
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#e60000";
      ctx.fill();
      ctx.lineWidth = Math.max(1, ballRadius * 0.2); // Scale stroke width proportionally to ball size
      ctx.strokeStyle = "#990000";
      ctx.stroke();

      // Flashing ball at center of red ball with proportional size
      if (flashVisible) {
        ctx.beginPath();
        ctx.arc(ballX, ballY, Math.max(2, ballRadius * 0.3), 0, Math.PI * 2);
        ctx.fillStyle = flashColor;
        ctx.fill();
      }

      // Occasionally toggle flash - use time-based instead of frame-based for consistency
      const currentTime = Date.now();
      if (!lastFlashTime) lastFlashTime = currentTime;
      
      if (currentTime - lastFlashTime > 1000) { // Flash every 1 second
        lastFlashTime = currentTime;
        flashVisible = true;
        flashColor = `#fff`;
        setTimeout(() => {
          flashVisible = false;
        }, 150);
      }

      // Update cycle detection
      // cycleDetection.updatePhase();

      offsetRef.current += speedRef.current;
      animationIdRef.current = requestAnimationFrame(draw);
    };

    // Start the animation and activate counter
    isAnimatingRef.current = true;
    // breathCounter.setActive(true);
    draw();
  }, [canvasDimensions]);

  // Stop animation function
  const stopAnimation = useCallback(() => {
    isAnimatingRef.current = false;
    // breathCounter.setActive(false);
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
  }, []);

  // Handle initial load
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsInitialLoad(false);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  // Handle orientation changes
  useEffect(() => {
    if (previousOrientationRef.current !== viewport.orientation && !isInitialLoad) {
      setIsOrientationChanging(true);
      
      const timeoutId = setTimeout(() => {
        setIsOrientationChanging(false);
      }, 500);

      previousOrientationRef.current = viewport.orientation;
      
      return () => clearTimeout(timeoutId);
    } else {
      previousOrientationRef.current = viewport.orientation;
    }
  }, [viewport.orientation, isInitialLoad]);

  // Handle canvas dimension changes (including orientation changes)
  useEffect(() => {
    // Stop current animation
    stopAnimation();
    
    // Reset cycle detection when canvas dimensions change
    // cycleDetection.resetCycle();
    
    // Small delay to ensure DOM has updated after orientation change
    const timeoutId = setTimeout(() => {
      startAnimation();
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      stopAnimation();
    };
  }, [canvasDimensions, startAnimation, stopAnimation]);

  const applyChanges = () => {
    amplitudeRef.current = tempAmplitude;
    speedRef.current = tempSpeed;
    
    // Reset cycle detection when speed changes to maintain timing accuracy
    // Amplitude changes don't affect cycle timing, only speed does
    // cycleDetection.resetCycle();
  };

  return (
    <div className={`app-container ${isInitialLoad ? 'no-transition' : ''} ${isOrientationChanging ? 'orientation-changing' : ''}`}>
      <canvas
        ref={canvasRef}
        className="rounded shadow-lg border"
      ></canvas>

      <div className="controls-container">
        {/* <BreathCounter
          count={breathCounter.count}
          maxCount={21}
          position="controls"
        /> */}

        <MobileSlider
          label="Amplitude"
          value={tempAmplitude}
          min={50}
          max={150}
          step={1}
          onChange={setTempAmplitude}
        />

        <MobileSlider
          label="Speed"
          value={tempSpeed}
          min={0}
          max={3}
          step={0.1}
          onChange={setTempSpeed}
        />

        <MobileButton
          onClick={applyChanges}
          variant="primary"
          size="large"
        >
          Apply Changes
        </MobileButton>
      </div>
    </div>
  );
};

export default BreathTimer;
