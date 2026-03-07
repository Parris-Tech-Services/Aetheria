import React, { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  text?: string;
  size: number;
};

export function JuiceOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle resize
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Animation loop
    let animationId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt;
        
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        p.x += p.vx * dt * 60;
        p.y += p.vy * dt * 60;
        // Gravity
        if (!p.text) p.vy += 0.5 * dt * 60; 

        ctx.globalAlpha = p.life / p.maxLife;

        if (p.text) {
          ctx.font = 'bold 24px Cinzel';
          ctx.fillStyle = p.color;
          ctx.textAlign = 'center';
          ctx.shadowColor = 'black';
          ctx.shadowBlur = 4;
          ctx.fillText(p.text, p.x, p.y);
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1.0;

      animationId = requestAnimationFrame(render);
    };
    animationId = requestAnimationFrame(render);

    // Event listener for juice triggers
    const handleJuice = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { type, amount } = customEvent.detail;
      
      // Center of screen approximation since we don't know exact screen coords of grid tiles easily
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 - 50;

      if (type === 'damage' || type === 'miss') {
        // Floating text
        particlesRef.current.push({
          x: cx + (Math.random() * 40 - 20),
          y: cy,
          vx: (Math.random() * 2 - 1),
          vy: -3,
          life: 1.5,
          maxLife: 1.5,
          color: type === 'miss' ? '#888' : '#ff3333',
          text: `-${amount}`,
          size: 0
        });

        // Blood splatters if damage
        if (type === 'damage') {
          for(let i=0; i<15; i++) {
            particlesRef.current.push({
              x: cx,
              y: cy,
              vx: (Math.random() * 10 - 5),
              vy: (Math.random() * -10),
              life: Math.random() * 0.5 + 0.5,
              maxLife: 1.0,
              color: '#aa0000',
              size: Math.random() * 4 + 2
            });
          }
        }
      } else if (type === 'heal') {
         particlesRef.current.push({
          x: cx,
          y: cy,
          vx: 0,
          vy: -2,
          life: 2.0,
          maxLife: 2.0,
          color: '#33ff33',
          text: `+${amount}`,
          size: 0
        });
        // Gold sparkles
        for(let i=0; i<20; i++) {
            particlesRef.current.push({
              x: cx + (Math.random() * 60 - 30),
              y: cy + (Math.random() * 60 - 30),
              vx: 0,
              vy: -1,
              life: Math.random() * 1.0 + 0.5,
              maxLife: 1.5,
              color: '#ffd700',
              size: Math.random() * 3 + 1
            });
          }
      }
    };

    window.addEventListener('game-juice', handleJuice);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('game-juice', handleJuice);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-50 mix-blend-screen"
    />
  );
}
