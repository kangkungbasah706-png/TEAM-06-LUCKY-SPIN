
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Prize, SpinMode } from '../types';
import { COLORS } from '../constants';

interface WheelProps {
  onFinished: (prize: Prize) => void;
  spinning: boolean;
  mode: SpinMode;
  prizes: Prize[];
}

export interface WheelHandle {
  spin: () => void;
}

const Wheel = forwardRef<WheelHandle, WheelProps>(({ onFinished, spinning, mode, prizes }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const isSpinningRef = useRef(false);
  const frameRef = useRef<number>(0);

  const drawWheel = (rotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = size / 2 - 20;

    ctx.clearRect(0, 0, size, size);

    const isExclusive = mode === 'EXCLUSIVE';
    
    ctx.shadowBlur = isExclusive ? 40 : 20;
    ctx.shadowColor = isExclusive ? COLORS.EXCLUSIVE_GLOW : COLORS.GOLD;

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate((rotation * Math.PI) / 180);

    const step = 360 / prizes.length;

    prizes.forEach((prize, i) => {
      const startAngle = (i * step * Math.PI) / 180;
      const endAngle = ((i + 1) * step * Math.PI) / 180;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.fillStyle = prize.color;
      ctx.fill();
      
      const grad = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
      grad.addColorStop(0, 'rgba(255,255,255,0.05)');
      grad.addColorStop(1, 'rgba(0,0,0,0.3)');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = isExclusive ? COLORS.EXCLUSIVE_GLOW : COLORS.GOLD;
      ctx.lineWidth = isExclusive ? 2 : 1;
      ctx.stroke();

      ctx.save();
      ctx.rotate(startAngle + (step * Math.PI) / 360);
      ctx.textAlign = 'right';
      ctx.fillStyle = prize.textColor;
      ctx.font = isExclusive ? 'bold 18px "Inter", sans-serif' : 'bold 16px "Inter", sans-serif';
      
      if (isExclusive) {
        ctx.shadowBlur = 5;
        ctx.shadowColor = COLORS.EXCLUSIVE_GLOW;
      }
      
      ctx.fillText(prize.label, radius - 40, 6);
      ctx.restore();
    });

    ctx.restore();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(center, center, radius + 5, 0, Math.PI * 2);
    const rimGrad = ctx.createLinearGradient(0, 0, size, size);
    rimGrad.addColorStop(0, COLORS.GOLD_DARK);
    rimGrad.addColorStop(0.5, COLORS.GOLD_LIGHT);
    rimGrad.addColorStop(1, COLORS.GOLD_DARK);
    ctx.strokeStyle = rimGrad;
    ctx.lineWidth = isExclusive ? 16 : 12;
    ctx.stroke();

    for (let i = 0; i < 24; i++) {
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate((i * 15 * Math.PI) / 180);
      ctx.beginPath();
      ctx.arc(radius + 5, 0, isExclusive ? 4 : 3, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? '#fff' : (isExclusive ? COLORS.EXCLUSIVE_GLOW : COLORS.GOLD_LIGHT);
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#fff';
      ctx.fill();
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(center, center, 45, 0, Math.PI * 2);
    const hubGrad = ctx.createRadialGradient(center, center, 5, center, center, 45);
    hubGrad.addColorStop(0, COLORS.GOLD_LIGHT);
    hubGrad.addColorStop(0.6, COLORS.GOLD_DARK);
    hubGrad.addColorStop(1, '#000');
    ctx.fillStyle = hubGrad;
    ctx.fill();
    ctx.strokeStyle = isExclusive ? COLORS.EXCLUSIVE_GLOW : '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  useImperativeHandle(ref, () => ({
    spin: () => {
      if (isSpinningRef.current) return;
      
      isSpinningRef.current = true;
      const startTime = performance.now();
      
      // Updated Durations: Min 10s
      // Reguler: 10,000ms - 12,000ms
      // Exclusive: 12,000ms - 15,000ms
      const duration = mode === 'EXCLUSIVE' 
        ? 12000 + Math.random() * 3000 
        : 10000 + Math.random() * 2000;
      
      const targetIndex = Math.floor(Math.random() * prizes.length);
      const segmentAngle = 360 / prizes.length;
      
      // Increased full spins for longer duration feel
      const fullSpins = mode === 'EXCLUSIVE' ? 18 + Math.floor(Math.random() * 10) : 15 + Math.floor(Math.random() * 8);
      const targetRotation = (fullSpins * 360) + (270 - (targetIndex * segmentAngle + (segmentAngle/2)));
      const startRotation = rotationRef.current;
      const diff = targetRotation - startRotation;

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing for long deceleration
        // Quintic ease out (p^5) provides a very smooth slowdown at the end
        const easeOut = 1 - Math.pow(1 - progress, 5);

        rotationRef.current = startRotation + diff * easeOut;
        drawWheel(rotationRef.current);

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        } else {
          isSpinningRef.current = false;
          onFinished(prizes[targetIndex]);
        }
      };

      frameRef.current = requestAnimationFrame(animate);
    }
  }));

  useEffect(() => {
    drawWheel(rotationRef.current);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  useEffect(() => {
    if (!isSpinningRef.current) drawWheel(rotationRef.current);
  }, [mode, prizes]);

  return (
    <div className="relative flex items-center justify-center">
      <div className={`absolute top-[-25px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center transition-all duration-500 ${mode === 'EXCLUSIVE' ? 'scale-110' : ''}`}>
        <div className="w-12 h-12 bg-black/40 blur-xl absolute top-4 rounded-full"></div>
        <div 
          className={`w-10 h-14 clip-path-pointer shadow-2xl border-t border-white/40 transition-colors duration-500 ${mode === 'EXCLUSIVE' ? 'bg-gradient-to-b from-purple-200 via-purple-600 to-indigo-900' : 'bg-gradient-to-b from-yellow-200 via-yellow-600 to-yellow-900'}`}
          style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}
        ></div>
        <div className={`w-5 h-5 rounded-full absolute top-0 shadow-lg border-2 ${mode === 'EXCLUSIVE' ? 'bg-white border-purple-600' : 'bg-white border-yellow-600'}`}></div>
      </div>

      <canvas 
        ref={canvasRef} 
        width={600} 
        height={600} 
        className="max-w-full h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)]"
      />

      <div className={`absolute inset-0 rounded-full border-[18px] border-transparent transition-all duration-1000 ${mode === 'EXCLUSIVE' ? 'shadow-[0_0_120px_rgba(224,167,255,0.4)]' : 'shadow-[0_0_80px_rgba(212,175,55,0.3)]'} pointer-events-none`}></div>
    </div>
  );
});

export default Wheel;
