import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  offsetX: number;
  offsetY: number;
  offsetVx: number;
  offsetVy: number;
  length: number;
  color: string;
};

const PARTICLE_COLORS = [
  "rgba(142, 152, 255, 0.70)", // indigo from the primary gradient
  "rgba(96, 107, 235, 0.7)", // deep blue from the primary gradient
  "rgba(142, 151, 197, 0.7)", // muted blue from the text gradient
  "rgba(171, 140, 149, 0.8)", // dusty rose from the text gradient
  "rgba(250, 113, 133, 0.8)", // soft rose from the page gradient
];
const POINTER_RADIUS = 300;

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const parent = canvas?.parentElement;
    if (!canvas || !context || !parent) return;

    let width = 0;
    let height = 0;
    let frameId = 0;
    let lastTime = 0;
    let pointerX = Number.POSITIVE_INFINITY;
    let pointerY = Number.POSITIVE_INFINITY;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let particles: Particle[] = [];

    const resize = () => {
      const bounds = parent.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const count = Math.min(
        100,
        Math.max(30, Math.round((width * height) / 11000)),
      );
      particles = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 5 + Math.random() * 12;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          offsetX: 0,
          offsetY: 0,
          offsetVx: 0,
          offsetVy: 0,
          length: 10 + Math.random() * 5,
          color:
            PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        };
      });

      if (reducedMotion) draw(0, false);
    };

    const draw = (time: number, animate = true) => {
      if (animate && lastTime === 0) lastTime = time;
      const delta = animate ? Math.min((time - lastTime) / 1000, 0.04) : 0;
      lastTime = time;
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;

      for (const particle of particles) {
        if (animate) {
          particle.x += particle.vx * delta;
          particle.y += particle.vy * delta;

          if (particle.x < -12) particle.x = width + 12;
          if (particle.x > width + 12) particle.x = -12;
          if (particle.y < -12) particle.y = height + 12;
          if (particle.y > height + 12) particle.y = -12;

          let forceX = 0;
          let forceY = 0;
          const dx = particle.x - pointerX;
          const dy = particle.y - pointerY;
          const distance = Math.hypot(dx, dy);
          if (distance < POINTER_RADIUS && distance > 0) {
            const strength = (1 - distance / POINTER_RADIUS) * 950;
            forceX = (dx / distance) * strength;
            forceY = (dy / distance) * strength;
          }

          // A damped spring returns the particle to its original moving path after it avoids the cursor.
          particle.offsetVx +=
            (forceX - particle.offsetX * 24 - particle.offsetVx * 7) * delta;
          particle.offsetVy +=
            (forceY - particle.offsetY * 24 - particle.offsetVy * 7) * delta;
          particle.offsetX += particle.offsetVx * delta;
          particle.offsetY += particle.offsetVy * delta;
        }

        const x = particle.x + particle.offsetX;
        const y = particle.y + particle.offsetY;
        const angle = Math.atan2(particle.vy, particle.vx);
        context.strokeStyle = particle.color;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(
          x - Math.cos(angle) * particle.length,
          y - Math.sin(angle) * particle.length,
        );
        context.stroke();
      }

      if (animate)
        frameId = window.requestAnimationFrame((nextTime) => draw(nextTime));
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointerX = event.clientX - bounds.left;
      pointerY = event.clientY - bounds.top;
    };
    const onPointerLeave = () => {
      pointerX = Number.POSITIVE_INFINITY;
      pointerY = Number.POSITIVE_INFINITY;
    };

    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", onPointerLeave);
    resize();
    if (!reducedMotion)
      frameId = window.requestAnimationFrame((time) => draw(time));

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", onPointerLeave);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particle-background"
      aria-hidden="true"
    />
  );
}
