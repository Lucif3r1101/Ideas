"use client";

import { useEffect, useRef } from "react";
import type { Variant } from "./GameScene";
import { SKINS, drawCharacter, drawPickup } from "@/lib/sprites";
import styles from "./mini-game.module.css";

export type Knobs = {
  jump: number;
  speed: number;
  coins: number;
  gravity: number;
};

type Pickup = { x: number; y: number; got: boolean };

export default function MiniGame({
  variant,
  knobs,
  onScore,
}: {
  variant: Variant;
  knobs: Knobs;
  onScore: (n: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const knobsRef = useRef(knobs);
  const onScoreRef = useRef(onScore);

  knobsRef.current = knobs;
  onScoreRef.current = onScore;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const skin = SKINS[variant];
    const flies = variant === "rocket";
    const GROUND = 44;

    let raf = 0;
    let w = 0;
    let h = 0;
    let y = flies ? 60 : 0; // height above ground
    let vy = 0;
    let grounded = !flies;
    let pickups: Pickup[] = [];
    let t = 0;
    let score = 0;

    onScoreRef.current(0);

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      const n = Math.max(1, Math.round(knobsRef.current.coins));
      pickups = Array.from({ length: n }, (_, i) => ({
        x: w + 100 + i * (Math.max(w, 400) / n),
        y: 44 + ((i * 41) % 78),
        got: false,
      }));
    }

    size();
    const ro = new ResizeObserver(size);
    ro.observe(canvas);

    let lastCount = Math.round(knobs.coins);

    function jump() {
      if (flies) {
        vy = knobsRef.current.jump * 0.62;
        grounded = false;
        return;
      }
      if (!grounded) return;
      vy = knobsRef.current.jump;
      grounded = false;
    }

    function onKey(e: KeyboardEvent) {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    }
    window.addEventListener("keydown", onKey);
    canvas.addEventListener("pointerdown", jump);

    function frame() {
      const k = knobsRef.current;
      t += 1;

      // re-seed if the count knob moved
      const want = Math.round(k.coins);
      if (want !== lastCount) {
        lastCount = want;
        seed();
      }

      // physics
      vy -= k.gravity;
      y += vy;

      if (flies) {
        // the rocket floats, it never rests on the floor
        if (y < 26) {
          y = 26;
          vy = 0;
        }
        if (y > h - GROUND - 60) {
          y = h - GROUND - 60;
          vy = 0;
        }
      } else if (y <= 0) {
        y = 0;
        vy = 0;
        grounded = true;
      }

      for (const p of pickups) {
        p.x -= k.speed;
        if (p.x < -40) {
          p.x = w + 40 + Math.random() * 200;
          p.y = 44 + Math.random() * 78;
          p.got = false;
        }
      }

      const px = 78;
      const py = h - GROUND - y;

      for (const p of pickups) {
        if (p.got) continue;
        const py2 = h - GROUND - p.y;
        if (Math.abs(p.x - px) < 30 && Math.abs(py2 - (py - 26)) < 32) {
          p.got = true;
          score += 1;
          onScoreRef.current(score);
        }
      }

      /* ---------------- draw ---------------- */
      const g = ctx!.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, skin.sky[0]);
      g.addColorStop(1, skin.sky[1]);
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, w, h);

      if (skin.stars) {
        ctx!.fillStyle = "#FFFFFF";
        for (let i = 0; i < 18; i++) {
          const sx = (i * 137 + t * 0.5) % (w + 40);
          const sy = (i * 61) % Math.max(1, h - GROUND - 30);
          ctx!.globalAlpha = 0.35 + ((i % 4) * 0.18);
          ctx!.fillRect(w - sx, sy, 2, 2);
        }
        ctx!.globalAlpha = 1;
      }

      ctx!.fillStyle = skin.ground;
      ctx!.fillRect(0, h - GROUND, w, GROUND);
      ctx!.fillStyle = skin.groundDark;
      const stripe = (t * k.speed) % 70;
      for (let x = -70; x < w + 70; x += 70) {
        ctx!.fillRect(x - stripe, h - GROUND + 15, 34, 5);
      }

      for (const p of pickups) {
        if (p.got) continue;
        drawPickup(ctx!, variant, p.x, h - GROUND - p.y, t);
      }

      const bob = grounded && !flies ? Math.sin(t * 0.35) * 2 : 0;
      drawCharacter(ctx!, variant, px, py + bob, t, grounded);

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("pointerdown", jump);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      aria-label="Playable demo. Press space or tap to jump."
    />
  );
}
