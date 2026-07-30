import type { Variant } from "@/app/components/GameScene";

type Ctx = CanvasRenderingContext2D;

export type Skin = {
  sky: [string, string];
  ground: string;
  groundDark: string;
  stars: boolean;
};

export const SKINS: Record<Variant, Skin> = {
  dog: {
    sky: ["#8FD3FF", "#CFEAFF"],
    ground: "#4FBB5C",
    groundDark: "#3A9B47",
    stars: false,
  },
  rocket: {
    sky: ["#241A52", "#5B3D9E"],
    ground: "#6B4CB0",
    groundDark: "#4E3488",
    stars: true,
  },
  cat: {
    sky: ["#FFB88C", "#FFE3C6"],
    ground: "#33BCA9",
    groundDark: "#249287",
    stars: false,
  },
};

function ellipse(c: Ctx, x: number, y: number, rx: number, ry: number, fill: string) {
  c.beginPath();
  c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  c.fillStyle = fill;
  c.fill();
}

function circle(c: Ctx, x: number, y: number, r: number, fill: string) {
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fillStyle = fill;
  c.fill();
}

/* ------------------------------------------------------------------ */
/* characters. Drawn around (0,0) sitting on the ground, facing right. */
/* ------------------------------------------------------------------ */

function dog(c: Ctx, t: number, grounded: boolean) {
  const swing = grounded ? Math.sin(t * 0.35) * 8 : 4;

  // tail, wags
  c.save();
  c.translate(-26, -22);
  c.rotate(Math.sin(t * 0.5) * 0.35 - 0.5);
  c.strokeStyle = "#7A4A24";
  c.lineWidth = 7;
  c.lineCap = "round";
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(-14, -8);
  c.stroke();
  c.restore();

  // legs
  c.strokeStyle = "#6E401F";
  c.lineWidth = 7;
  c.lineCap = "round";
  c.beginPath();
  c.moveTo(-12, -10);
  c.lineTo(-12 + swing, 0);
  c.moveTo(8, -10);
  c.lineTo(8 - swing, 0);
  c.stroke();

  ellipse(c, -4, -22, 24, 15, "#8B5628"); // body
  circle(c, 20, -34, 14, "#9A6330"); // head

  // ear
  c.beginPath();
  c.moveTo(12, -44);
  c.quadraticCurveTo(8, -58, 20, -57);
  c.quadraticCurveTo(23, -50, 20, -42);
  c.fillStyle = "#71431F";
  c.fill();

  ellipse(c, 31, -31, 8, 6, "#B67B44"); // snout
  circle(c, 36, -33, 2.6, "#24223D"); // nose
  circle(c, 23, -37, 2.6, "#24223D"); // eye
  circle(c, 23.8, -37.8, 1, "#FFF");

  // collar
  c.strokeStyle = "#FF6B5A";
  c.lineWidth = 5;
  c.beginPath();
  c.moveTo(8, -30);
  c.quadraticCurveTo(13, -24, 20, -24);
  c.stroke();
}

function rocket(c: Ctx, t: number) {
  // flame, flickers
  const f = 1 + Math.sin(t * 0.9) * 0.28;
  c.save();
  c.translate(-30, -26);
  c.scale(f, 1);
  c.beginPath();
  c.moveTo(0, -7);
  c.quadraticCurveTo(-22, 0, 0, 7);
  c.fillStyle = "#FF9F45";
  c.fill();
  c.beginPath();
  c.moveTo(0, -4);
  c.quadraticCurveTo(-13, 0, 0, 4);
  c.fillStyle = "#FFD84D";
  c.fill();
  c.restore();

  // fins
  c.fillStyle = "#C7457A";
  c.beginPath();
  c.moveTo(-14, -34);
  c.quadraticCurveTo(-26, -50, -12, -50);
  c.quadraticCurveTo(-6, -43, -4, -34);
  c.fill();
  c.beginPath();
  c.moveTo(-14, -18);
  c.quadraticCurveTo(-26, -2, -12, -2);
  c.quadraticCurveTo(-6, -9, -4, -18);
  c.fill();

  // body, nose to the right
  c.beginPath();
  c.moveTo(-22, -26);
  c.quadraticCurveTo(-22, -44, 6, -50);
  c.quadraticCurveTo(34, -42, 42, -26);
  c.quadraticCurveTo(34, -10, 6, -2);
  c.quadraticCurveTo(-22, -8, -22, -26);
  c.fillStyle = "#F2F4FB";
  c.fill();

  // shaded nose
  c.beginPath();
  c.moveTo(18, -46);
  c.quadraticCurveTo(36, -40, 42, -26);
  c.quadraticCurveTo(36, -12, 18, -6);
  c.fillStyle = "#DCE1F0";
  c.fill();

  circle(c, 14, -26, 9, "#24223D"); // window
  circle(c, 14, -26, 6.5, "#6EE0F5");
  circle(c, 11.6, -28.4, 2, "rgba(255,255,255,0.85)");
}

function cat(c: Ctx, t: number, grounded: boolean) {
  const swing = grounded ? Math.sin(t * 0.4) * 8 : 4;

  // curled tail
  c.save();
  c.translate(-24, -24);
  c.rotate(Math.sin(t * 0.3) * 0.22);
  c.strokeStyle = "#4A4458";
  c.lineWidth = 6;
  c.lineCap = "round";
  c.beginPath();
  c.moveTo(0, 0);
  c.quadraticCurveTo(-16, -4, -14, -20);
  c.stroke();
  c.restore();

  // legs
  c.strokeStyle = "#4A4458";
  c.lineWidth = 6;
  c.lineCap = "round";
  c.beginPath();
  c.moveTo(-10, -10);
  c.lineTo(-10 + swing, 0);
  c.moveTo(10, -10);
  c.lineTo(10 - swing, 0);
  c.stroke();

  ellipse(c, -2, -20, 22, 13, "#5A5370"); // body
  circle(c, 20, -32, 13, "#665E7E"); // head

  // pointed ears
  c.fillStyle = "#4A4458";
  c.beginPath();
  c.moveTo(11, -41);
  c.lineTo(9, -54);
  c.lineTo(21, -47);
  c.closePath();
  c.fill();
  c.beginPath();
  c.moveTo(27, -44);
  c.lineTo(34, -54);
  c.lineTo(31, -40);
  c.closePath();
  c.fill();

  ellipse(c, 31, -29, 7, 5, "#847AA0"); // muzzle

  // whiskers
  c.strokeStyle = "rgba(255,255,255,0.8)";
  c.lineWidth = 1.4;
  c.beginPath();
  c.moveTo(35, -31);
  c.lineTo(41, -33);
  c.moveTo(35, -28);
  c.lineTo(41, -26);
  c.stroke();

  // green eyes
  circle(c, 25, -35, 3.2, "#B9F06E");
  circle(c, 25.6, -35.8, 1.2, "#24223D");
  circle(c, 15, -35, 2.8, "#B9F06E");
  circle(c, 15.5, -35.7, 1.1, "#24223D");
}

export function drawCharacter(
  c: Ctx,
  variant: Variant,
  x: number,
  y: number,
  t: number,
  grounded: boolean
) {
  c.save();
  c.translate(x, y);
  if (variant === "dog") dog(c, t, grounded);
  else if (variant === "rocket") rocket(c, t);
  else cat(c, t, grounded);
  c.restore();
}

/* ------------------------------------------------------------------ */
/* pickups. Genuinely different shapes, not recoloured circles.        */
/* ------------------------------------------------------------------ */

export function drawPickup(c: Ctx, variant: Variant, x: number, y: number, t: number) {
  c.save();
  c.translate(x, y);

  if (variant === "dog") {
    // coin, spins by squashing horizontally
    const s = Math.abs(Math.cos(t * 0.06)) * 0.85 + 0.15;
    c.scale(s, 1);
    circle(c, 0, 0, 11, "#FFC633");
    c.lineWidth = 3.5;
    c.strokeStyle = "#DFA010";
    c.beginPath();
    c.arc(0, 0, 11, 0, Math.PI * 2);
    c.stroke();
    circle(c, 0, 0, 4.5, "#FFE79E");
  } else if (variant === "rocket") {
    // crystal, a faceted diamond
    c.rotate(Math.sin(t * 0.04) * 0.3);
    c.beginPath();
    c.moveTo(0, -13);
    c.lineTo(9, 0);
    c.lineTo(0, 13);
    c.lineTo(-9, 0);
    c.closePath();
    c.fillStyle = "#6EE0F5";
    c.fill();
    c.strokeStyle = "#2FA8C4";
    c.lineWidth = 2.5;
    c.stroke();
    c.beginPath();
    c.moveTo(0, -13);
    c.lineTo(0, 13);
    c.moveTo(-9, 0);
    c.lineTo(9, 0);
    c.strokeStyle = "rgba(255,255,255,0.55)";
    c.lineWidth = 1.6;
    c.stroke();
  } else {
    // fish, body plus tail fin
    c.rotate(Math.sin(t * 0.07) * 0.18);
    c.beginPath();
    c.ellipse(1, 0, 11, 7, 0, 0, Math.PI * 2);
    c.fillStyle = "#FF7BA8";
    c.fill();
    c.beginPath();
    c.moveTo(-9, 0);
    c.lineTo(-18, -7);
    c.lineTo(-18, 7);
    c.closePath();
    c.fillStyle = "#E85E92";
    c.fill();
    circle(c, 6, -2, 2.2, "#FFF");
    circle(c, 6.6, -2, 1.1, "#24223D");
  }

  c.restore();
}
