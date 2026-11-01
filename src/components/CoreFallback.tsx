/**
 * Repli sans WebGL — même composition que la scène 3D, en SVG statique.
 *
 * Les trajectoires sont générées par la même logique de convergence que le
 * shader : couloirs réguliers qui se resserrent vers la porte de fin de
 * projet. L'identité visuelle est préservée sans aucun contexte GPU.
 */

const STRANDS = 22;
const W = 1200;
const H = 760;

function hash(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function path(i: number) {
  const lane = i / (STRANDS - 1) - 0.5;
  const depth = hash(i * 3.17) - 0.5;
  const pts: string[] = [];
  for (let s = 0; s <= 18; s++) {
    const t = s / 18;
    const x = 120 + t * (W - 260);
    const spread = 300 * (1 - 0.68 * t);
    const wobble = (hash(i * 7.3 + s * 1.9) - 0.5) * 26 * (1 - t) ** 2;
    const y = H / 2 + lane * spread + depth * 70 * (1 - 0.68 * t) + wobble;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M ${pts.join(' L ')}`;
}

function colour(i: number) {
  const dev = Math.abs(hash(i * 7.77) - 0.5) * 2;
  if (dev > 0.72) return '#f2605b';
  if (dev > 0.42) return '#f2a93b';
  return '#cdf564';
}

export function CoreFallback({ className = '' }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
      >
        <defs>
          <radialGradient id="cc-glow" cx="78%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#cdf564" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#06080a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cc-fade" x1="0" x2="1">
            <stop offset="0%" stopColor="#06080a" stopOpacity="1" />
            <stop offset="14%" stopColor="#06080a" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width={W} height={H} fill="#06080a" />
        <rect width={W} height={H} fill="url(#cc-glow)" />

        {/* Anneaux de pilotage */}
        <g fill="none" opacity="0.5">
          <ellipse cx={520} cy={H / 2} rx={330} ry={300} stroke="#cdf564" strokeWidth="1.1" opacity="0.5" />
          <ellipse
            cx={520}
            cy={H / 2}
            rx={395}
            ry={250}
            stroke="#f2a93b"
            strokeWidth="0.9"
            opacity="0.4"
            transform={`rotate(-14 520 ${H / 2})`}
          />
          <ellipse
            cx={520}
            cy={H / 2}
            rx={450}
            ry={190}
            stroke="#e9c9a0"
            strokeWidth="0.8"
            opacity="0.3"
            transform={`rotate(10 520 ${H / 2})`}
          />
        </g>

        {/* Faisceau de lignes budgétaires */}
        <g fill="none" strokeLinecap="round">
          {Array.from({ length: STRANDS }, (_, i) => (
            <path
              key={i}
              d={path(i)}
              stroke={colour(i)}
              strokeWidth={1.5}
              opacity={0.42 + hash(i * 2.2) * 0.3}
            />
          ))}
        </g>

        {/* Porte de fin de projet */}
        <g>
          <rect
            x={W - 168}
            y={H / 2 - 112}
            width={120}
            height={224}
            fill="#cdf564"
            opacity="0.05"
          />
          <rect
            x={W - 168}
            y={H / 2 - 112}
            width={120}
            height={224}
            fill="none"
            stroke="#cdf564"
            strokeWidth="1.6"
            opacity="0.85"
          />
        </g>

        <rect width={W} height={H} fill="url(#cc-fade)" />
      </svg>
    </div>
  );
}

export default CoreFallback;
