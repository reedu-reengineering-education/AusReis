"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Verwende es, wenn du utility classes hast

const ShinySVG = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let tick = 0;

  // SVG-Pfadpunkte
  const pathPoints = [
    { x: 236.41, y: 283.46 },
    { x: 142.28, y: 377.58 },
    { x: 236.41, y: 471.7 },
    { x: 424.64, y: 283.46 },
    { x: 236.41, y: 95.22 },
    { x: 142.28, y: 189.34 },
    { x: 236.41, y: 283.46 }, // Schließt den Pfad
  ];

  // Interpolation zwischen zwei Punkten
  const lerp = (start: number, end: number, t: number) =>
    (1 - t) * start + t * end;

  // Funktion zur Bewegung der Partikel entlang des SVG-Pfads
  const moveParticlesAlongPath = (ctx: CanvasRenderingContext2D) => {
    pathPoints.forEach((point, i) => {
      const nextPoint = pathPoints[(i + 1) % pathPoints.length]; // Nächster Punkt (schließt den Kreis)

      // Interpoliere zwischen aktuellem und nächstem Punkt
      const t = (tick % 200) / 150; // Zeitfaktor (Tick)
      const x = lerp(point.x, nextPoint.x, t);
      const y = lerp(point.y, nextPoint.y, t);

      // Zeichne das Partikel mit Glow-Effekt
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI); // Kreise als Partikel (Radius 4px)
      ctx.fillStyle = "rgba(235, 92, 55, 0.8)"; // Partikel in der Farbe #EB5C37
      ctx.shadowBlur = 15; // Glow-Radius
      ctx.shadowColor = "rgba(235, 92, 55, 0.6)"; // Glow-Farbe
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    });
  };

  const setup = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        resize(canvas, ctx);
        draw(canvas, ctx);
      }
    }
  };

  const resize = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const { innerWidth, innerHeight } = window;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Zeichnen der Partikel und Erzeugung des Spur-Effekts
  const draw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    tick++;

    // // Weißer Hintergrund für das gesamte Canvas
    // ctx.fillStyle = "rgba(255, 255, 255, 0.01)"; // Weißer Hintergrund
    // ctx.fillRect(0, 0, canvas.width, canvas.height); // Fülle das gesamte Canvas mit Weiß

    moveParticlesAlongPath(ctx); // Zeichne die Partikel entlang des Pfads
    window.requestAnimationFrame(() => draw(canvas, ctx)); // Loop für Animation
  };

  useEffect(() => {
    setup();
    window.addEventListener("resize", () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        resize(canvas, ctx);
      }
    });

    return () => {
      window.removeEventListener("resize", () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            resize(canvas, ctx);
          }
        }
      });
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      {/* Canvas für die Partikelanimation entlang des SVG-Pfads */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 flex justify-center items-center"
      >
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
      </motion.div>

      {/* Original SVG */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10"
      >
        <svg
          id="Ebene_1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 566.93 566.93"
          className="w-full h-full"
        >
          <polyline
            className="cls-1"
            fill="none"
            stroke="#EB5C37"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points="236.41 283.46 142.28 377.58 236.41 471.7 424.64 283.46 236.41 95.22 142.28 189.34 236.41 283.46"
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default ShinySVG;
