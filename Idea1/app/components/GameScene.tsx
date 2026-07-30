import styles from "./game-scene.module.css";

export type Variant = "dog" | "rocket" | "cat";

const PALETTE: Record<
  Variant,
  { skyTop: string; skyBot: string; groundTop: string; groundBot: string; tuft: string; hill: string }
> = {
  dog: {
    skyTop: "#7EC8FF",
    skyBot: "#CFEAFF",
    groundTop: "#6FD873",
    groundBot: "#3FA94F",
    tuft: "#33994A",
    hill: "#A8E5A0",
  },
  rocket: {
    skyTop: "#2B1D5E",
    skyBot: "#5B3D9E",
    groundTop: "#7C5BC4",
    groundBot: "#4F3388",
    tuft: "#8E6FD6",
    hill: "#432C7A",
  },
  cat: {
    skyTop: "#FFB88C",
    skyBot: "#FFE0C2",
    groundTop: "#3FC7B4",
    groundBot: "#22998C",
    tuft: "#1B8579",
    hill: "#7BDCCB",
  },
};

function Dog() {
  return (
    <g className={styles.hero}>
      <g stroke="#7A4A24" strokeWidth="15" strokeLinecap="round">
        <path className={styles.legBack} d="M472 232 v30" />
        <path className={styles.legFront} d="M528 232 v30" />
      </g>
      <path
        className={styles.tail}
        d="M448 196 q-30 -10 -34 -42"
        stroke="#8B5628"
        strokeWidth="15"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="496" cy="204" rx="54" ry="35" fill="#8B5628" />
      <circle cx="552" cy="176" r="33" fill="#9A6330" />
      <path d="M534 152 q-8 -32 18 -32 q11 14 4 35 z" fill="#71431F" />
      <ellipse cx="580" cy="184" rx="19" ry="14" fill="#B67B44" />
      <circle cx="592" cy="180" r="6" fill="#2B2A45" />
      <circle cx="558" cy="168" r="6" fill="#2B2A45" />
      <circle cx="560" cy="166" r="2" fill="#FFFFFF" />
      <path
        d="M528 192 q10 14 28 13"
        stroke="#FF6B5A"
        strokeWidth="11"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function Rocket() {
  return (
    <g className={styles.hero}>
      {/* flame */}
      <path
        className={styles.flame}
        d="M452 200 q-34 4 -46 -14 q30 2 46 -12 z"
        fill="#FF9F45"
      />
      <path
        className={styles.flame}
        d="M456 198 q-22 3 -30 -10 q20 1 30 -8 z"
        fill="#FFD84D"
      />
      {/* fins */}
      <path d="M488 176 q-22 -30 -6 -40 q18 12 24 32 z" fill="#C7457A" />
      <path d="M488 212 q-22 30 -6 40 q18 -12 24 -32 z" fill="#C7457A" />
      {/* body */}
      <path
        d="M462 194 q0 -34 46 -46 q52 12 74 46 q-22 34 -74 46 q-46 -12 -46 -46 z"
        fill="#F2F4FB"
      />
      <path d="M540 160 q28 12 42 34 q-14 22 -42 34 z" fill="#DDE2F0" />
      {/* window */}
      <circle cx="536" cy="194" r="18" fill="#2B2A45" />
      <circle cx="536" cy="194" r="13" fill="#6EE0F5" />
      <circle cx="531" cy="189" r="4" fill="#FFFFFF" opacity="0.8" />
      <path d="M462 194 h-16" stroke="#C7457A" strokeWidth="8" strokeLinecap="round" />
    </g>
  );
}

function Cat() {
  return (
    <g className={styles.hero}>
      <g stroke="#4A4458" strokeWidth="13" strokeLinecap="round">
        <path className={styles.legBack} d="M474 234 v28" />
        <path className={styles.legFront} d="M530 234 v28" />
      </g>
      <path
        className={styles.tail}
        d="M448 200 q-34 -4 -30 -46"
        stroke="#5A5370"
        strokeWidth="13"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="496" cy="208" rx="52" ry="31" fill="#5A5370" />
      <circle cx="550" cy="182" r="30" fill="#665E7E" />
      <path d="M530 160 l-4 -26 l24 14 z" fill="#4A4458" />
      <path d="M568 158 l14 -22 l4 26 z" fill="#4A4458" />
      <ellipse cx="574" cy="192" rx="15" ry="11" fill="#847AA0" />
      <path d="M582 188 l4 -3 M582 194 l4 3" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="560" cy="176" r="6" fill="#B9F06E" />
      <circle cx="561" cy="174" r="2" fill="#2B2A45" />
      <circle cx="540" cy="178" r="5" fill="#B9F06E" />
    </g>
  );
}

const CHARACTER: Record<Variant, () => React.ReactElement> = {
  dog: Dog,
  rocket: Rocket,
  cat: Cat,
};

const PICKUP: Record<Variant, { fill: string; stroke: string; inner: string }> = {
  dog: { fill: "#FFC633", stroke: "#DFA010", inner: "#FFE79E" },
  rocket: { fill: "#6EE0F5", stroke: "#2FA8C4", inner: "#CBF6FF" },
  cat: { fill: "#FF7BA8", stroke: "#D14A7C", inner: "#FFD0E1" },
};

export default function GameScene({
  compact = false,
  variant = "dog",
}: {
  compact?: boolean;
  variant?: Variant;
}) {
  const p = PALETTE[variant];
  const pick = PICKUP[variant];
  const Character = CHARACTER[variant];
  const uid = variant;

  return (
    <svg
      className={compact ? `${styles.scene} ${styles.compact}` : styles.scene}
      viewBox="0 0 1200 380"
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label={`A game world with a ${variant} collecting things`}
    >
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.skyTop} />
          <stop offset="100%" stopColor={p.skyBot} />
        </linearGradient>
        <linearGradient id={`gr-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.groundTop} />
          <stop offset="100%" stopColor={p.groundBot} />
        </linearGradient>
      </defs>

      <rect width="1200" height="380" fill={`url(#sky-${uid})`} />

      {variant === "rocket" && (
        <g fill="#FFFFFF">
          <circle cx="150" cy="70" r="3" opacity="0.9" />
          <circle cx="330" cy="44" r="2.4" opacity="0.7" />
          <circle cx="520" cy="86" r="3.2" opacity="0.85" />
          <circle cx="760" cy="52" r="2.6" opacity="0.75" />
          <circle cx="980" cy="92" r="3" opacity="0.9" />
          <circle cx="1120" cy="48" r="2.4" opacity="0.7" />
        </g>
      )}

      <ellipse cx="170" cy="330" rx="290" ry="118" fill={p.hill} />
      <ellipse cx="620" cy="345" rx="250" ry="100" fill={p.hill} opacity="0.85" />
      <ellipse cx="1050" cy="325" rx="300" ry="122" fill={p.hill} />

      {variant === "dog" && (
        <>
          <g>
            <rect x="288" y="212" width="13" height="42" rx="6" fill="#8B5E3C" />
            <circle cx="294" cy="200" r="34" fill="#57C25F" />
            <circle cx="272" cy="212" r="23" fill="#4CB554" />
            <circle cx="316" cy="212" r="23" fill="#63CD6B" />
          </g>
          <g>
            <rect x="922" y="222" width="11" height="36" rx="5" fill="#8B5E3C" />
            <circle cx="927" cy="212" r="27" fill="#57C25F" />
            <circle cx="909" cy="221" r="18" fill="#4CB554" />
            <circle cx="945" cy="221" r="18" fill="#63CD6B" />
          </g>
        </>
      )}

      <path d="M0 252 h1200 v128 h-1200 z" fill={`url(#gr-${uid})`} />
      <g stroke={p.tuft} strokeWidth="5" strokeLinecap="round" opacity="0.6">
        <path d="M60 252 v-13" />
        <path d="M198 252 v-10" />
        <path d="M402 252 v-14" />
        <path d="M742 252 v-13" />
        <path d="M1064 252 v-14" />
        <path d="M1160 252 v-11" />
      </g>

      <g className={styles.coins}>
        {[
          [690, 170],
          [786, 142],
          [884, 176],
        ].map(([x, y]) => (
          <g key={x} transform={`translate(${x} ${y})`}>
            <circle r="19" fill={pick.fill} stroke={pick.stroke} strokeWidth="5" />
            <circle r="7" fill={pick.inner} />
          </g>
        ))}
      </g>

      <g className={styles.dust} fill="#FFFFFF" opacity="0.5">
        <circle cx="392" cy="246" r="11" />
        <circle cx="366" cy="240" r="8" />
        <circle cx="344" cy="247" r="6" />
      </g>

      <Character />
    </svg>
  );
}
