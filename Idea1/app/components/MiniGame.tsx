"use client";

import { useEffect, useRef } from "react";
import type { Variant } from "./GameScene";
import styles from "./mini-game.module.css";

export type Knobs = {
  jump: number;
  speed: number;
  coins: number;
  gravity: number;
};

const SKIN: Record<
  Variant,
  { sky: string; ground: string; body: string; head: string; pickup: string; pickupRing: string }
> = {
  dog: {
    sky: "#BFE6FF",
    ground: "#4FBB5C",
    body: "#8B5628",
    head: "#9A6330",
    pickup: "#FFC633",
    pickupRing: "#DFA010",
  },
  rocket: {
    sky: "#3A2673",
    ground: "#6B4CB0",
    body: "#F2F4FB",
    head: "#DDE2F0",
    pickup: "#6EE0F5",
    pickupRing: "#2FA8C4",
  },
  cat: {
    sky: "#FFD6B8",
    ground: "#33BCA9",
    body: "#5A5370",
    head: "#665E7E",
    pickup: "#FF7BA8",
    pickupRing: "#D14A7C",
  },
};

type Coin = { x: number; y: number; got: boolean };

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
  const scoreRef = useRef(0);
  const onScoreRef = useRef(onScore);

  knobsRef.current = knobs;
  onScoreRef.current = onScore;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const skin = SKIN[variant];
    let raf = 0;
    let w = 0;
    let h = 0;

    // world state
    const GROUND = 46; // px from bottom
    let y = 0; // height above ground
    let vy = 0;
    let onGround = true;
    let coins: Coin[] = [];
    let t = 0;
    scoreRef.current = 0;
    onScoreRef.current(0);

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    size();
    const ro = new ResizeObserver(size);
    ro.observe(canvas);

    function seedCoins() {
      const n = Math.max(1, Math.round(knobsRef.current.coins));
      coins = Array.from({ length: n }, (_, i) => ({
        x: w + 120 + i * (240 / Math.max(1, n / 3)),
        y: 40 + ((i * 37) % 70),
        got: false,
      }));
    }
    seedCoins();

    function jump() {
      if (!onGround) return;
      vy = knobsRef.current.jump;
      onGround = false;
    }

    function onKey(e: KeyboardEvent) {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    }
    function onPointer() {
      jump();
    }

    window.addEventListener("keydown", onKey);
    canvas.addEventListener("pointerdown", onPointer);

    function frame() {
      const k = knobsRef.current;
      t += 1;

      // physics
      vy -= k.gravity;
      y += vy;
      if (y <= 0) {
        y = 0;
        vy = 0;
        onGround = true;
      }

      // coins drift left, wrap around
      for (const c of coins) {
        c.x -= k.speed;
        if (c.x < -30) {
          c.x = w + 40 + Math.random() * 260;
          c.y = 40 + Math.random() * 70;
          c.got = false;
        }
      }

      // collision
      const px = 74;
      const py = h - GROUND - 22 - y;
      for (const c of coins) {
        if (c.got) continue;
        const cy = h - GROUND - c.y;
        if (Math.abs(c.x - px) < 26 && Math.abs(cy - py) < 28) {
          c.got = true;
          scoreRef.current += 1;
          onScoreRef.current(scoreRef.current);
        }
      }

      // ---- draw ----
      ctx!.clearRect(0, 0, w, h);

      ctx!.fillStyle = skin.sky;
      ctx!.fillRect(0, 0, w, h);

      if (variant === "rocket") {
        ctx!.fillStyle = "#FFFFFF";
        for (let i = 0; i < 14; i++) {
          const sx = (i * 97 + ((t * 0.4) % w)) % w;
          const sy = (i * 53) % (h - GROUND - 20);
          ctx!.globalAlpha = 0.4 + ((i % 3) * 0.2);
          ctx!.fillRect(w - sx, sy, 2, 2);
        }
        ctx!.globalAlpha = 1;
      }

      // ground
      ctx!.fillStyle = skin.ground;
      ctx!.fillRect(0, h - GROUND, w, GROUND);

      // ground stripes so speed is visible
      ctx!.fillStyle = "rgba(0,0,0,0.10)";
      const stripe = (t * k.speed) % 64;
      for (let x = -64; x < w + 64; x += 64) {
        ctx!.fillRect(x - stripe, h - GROUND + 16, 30, 5);
      }

      // coins
      for (const c of coins) {
        if (c.got) continue;
        const cy = h - GROUND - c.y;
        ctx!.beginPath();
        ctx!.arc(c.x, cy, 11, 0, Math.PI * 2);
        ctx!.fillStyle = skin.pickup;
        ctx!.fill();
        ctx!.lineWidth = 4;
        ctx!.strokeStyle = skin.pickupRing;
        ctx!.stroke();
      }

      // character
      const bob = onGround ? Math.sin(t * 0.35) * 2 : 0;
      const cx = px;
      const cyy = h - GROUND - 18 - y + bob;

      if (variant === "rocket") {
        ctx!.fillStyle = "#FF9F45";
        ctx!.beginPath();
        ctx!.ellipse(cx - 26, cyy, 12 + Math.sin(t) * 3, 6, 0, 0, Math.PI * 2);
        ctx!.fill();
      }

      ctx!.fillStyle = skin.body;
      roundRect(ctx!, cx - 22, cyy - 12, 40, 24, 12);
      ctx!.fill();

      ctx!.fillStyle = skin.head;
      ctx!.beginPath();
      ctx!.arc(cx + 22, cyy - 10, 13, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.fillStyle = "#24223D";
      ctx!.beginPath();
      ctx!.arc(cx + 26, cyy - 13, 3, 0, Math.PI * 2);
      ctx!.fill();

      // legs
      if (onGround) {
        ctx!.strokeStyle = skin.body;
        ctx!.lineWidth = 6;
        ctx!.lineCap = "round";
        const swing = Math.sin(t * 0.35) * 7;
        ctx!.beginPath();
        ctx!.moveTo(cx - 12, cyy + 10);
        ctx!.lineTo(cx - 12 + swing, cyy + 20);
        ctx!.moveTo(cx + 8, cyy + 10);
        ctx!.lineTo(cx + 8 - swing, cyy + 20);
        ctx!.stroke();
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("pointerdown", onPointer);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      aria-label="Playable demo game. Press space or tap to jump."
    />
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
