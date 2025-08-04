import React, { useRef, useEffect, useState } from "react";

const BreathTimer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offsetRef = useRef(0);
  const amplitudeRef = useRef(100);
  const speedRef = useRef(2);

  const [tempAmplitude, setTempAmplitude] = useState(100);
  const [tempSpeed, setTempSpeed] = useState(2);

  const frequency = 0.01;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const ballX = width - 40;

    let flashTimer = 0;
    let flashVisible = false;
    let flashColor = "";

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw sine wave
      ctx.beginPath();
      for (let x = 0; x <= ballX; x++) {
        const y = height / 2 + amplitudeRef.current * Math.sin(frequency * (x + offsetRef.current));
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "#0077ff";
      ctx.lineWidth = 2;
      ctx.stroke();

      const ballY = height / 2 + amplitudeRef.current * Math.sin(frequency * (ballX + offsetRef.current));

      // Draw red leading ball
      ctx.beginPath();
      ctx.arc(ballX, ballY, 16, 0, Math.PI * 2);
      ctx.fillStyle = "#e60000";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#990000";
      ctx.stroke();

      // Flashing ball at center of red ball
      if (flashVisible) {
        ctx.beginPath();
        ctx.arc(ballX, ballY, 4, 0, Math.PI * 2);
        ctx.fillStyle = flashColor;
        ctx.fill();
      }

      // Occasionally toggle flash
      flashTimer++;
      if (flashTimer > 60) { // roughly every 1 second at 60fps
        flashTimer = 0;
        flashVisible = true;
        flashColor = `#fff`;
        setTimeout(() => {
          flashVisible = false;
        }, 150);
      }

      offsetRef.current += speedRef.current;
      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  const applyChanges = () => {
    amplitudeRef.current = tempAmplitude;
    speedRef.current = tempSpeed;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-6">
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        className="rounded shadow-lg border"
      ></canvas>

      <div className="w-3/4 max-w-md space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Amplitude ({tempAmplitude})</label>
          <input
            type="range"
            min="50"
            max="150"
            step="1"
            value={tempAmplitude}
            onChange={(e) => setTempAmplitude(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Speed ({tempSpeed})</label>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={tempSpeed}
            onChange={(e) => setTempSpeed(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <button
          onClick={applyChanges}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};

export default BreathTimer;
