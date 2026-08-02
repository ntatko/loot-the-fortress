import React from "react";
import MoneyBag from "../../assets/money-bag.svg";
import Backpack from "../../assets/backpack.svg";
import Coins from "../../assets/gold_coins.svg";
import Key from "../../assets/key.svg";
import Crown from "../../assets/crown.svg";

const SIZE = 320;
const CENTER = SIZE / 2;
const RING = 108; // distance from the middle out to each step
const NODE = 36; // radius of a step bubble
const GAP = 26; // degrees of clear air between a bubble and an arrow

const ACCENT = "#bb6108";
const INK = "#3a2a1a";
const BUBBLE = "#fdf3e7";

const point = (degrees, radius = RING) => {
  const radians = (degrees * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER + radius * Math.sin(radians),
  };
};

// Four steps, evenly spaced, starting at the top and running clockwise.
const STEPS = [
  { angle: -90, label: "Shop", image: MoneyBag },
  { angle: 0, label: "Bag", image: Backpack },
  { angle: 90, label: "Loot", image: Coins },
  { angle: 180, label: "Escape", image: Key },
];

/** The whole game in one picture: shop, bag, loot, escape, round again. */
const GameLoopDiagram = () => (
  <svg
    viewBox={`0 0 ${SIZE} ${SIZE}`}
    role="img"
    aria-label="The loop: shop, bag, loot, escape, and repeat until you can buy the crown"
    style={{
      display: "block",
      width: "100%",
      maxWidth: "19rem",
      height: "auto",
      margin: "0 auto 0.5rem",
      // The modal is a flex column, which would otherwise squash a square SVG.
      flexShrink: 0,
    }}
  >
    <defs>
      <marker
        id="game-loop-arrowhead"
        viewBox="0 0 10 10"
        refX="7"
        refY="5"
        markerWidth="5"
        markerHeight="5"
        orient="auto"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill={ACCENT} />
      </marker>
    </defs>

    {STEPS.map((step) => {
      const from = point(step.angle + GAP);
      const to = point(step.angle + 90 - GAP);
      return (
        <path
          key={`arrow-${step.label}`}
          d={`M ${from.x.toFixed(2)} ${from.y.toFixed(2)} A ${RING} ${RING} 0 0 1 ${to.x.toFixed(
            2
          )} ${to.y.toFixed(2)}`}
          fill="none"
          stroke={ACCENT}
          strokeWidth="4"
          strokeLinecap="round"
          markerEnd="url(#game-loop-arrowhead)"
        />
      );
    })}

    {STEPS.map((step) => {
      const { x, y } = point(step.angle);
      return (
        <g key={step.label}>
          <circle cx={x} cy={y} r={NODE} fill={BUBBLE} stroke={ACCENT} strokeWidth="3" />
          <image href={step.image} x={x - 14} y={y - 24} width="28" height="28" />
          <text
            x={x}
            y={y + 23}
            textAnchor="middle"
            fontFamily="'Syne Mono', monospace"
            fontSize="13"
            fontWeight="bold"
            fill={INK}
          >
            {step.label}
          </text>
        </g>
      );
    })}

    {/* What the whole loop is for. */}
    <image href={Crown} x={CENTER - 18} y={CENTER - 30} width="36" height="36" />
    <text
      x={CENTER}
      y={CENTER + 22}
      textAnchor="middle"
      fontFamily="'Syne Mono', monospace"
      fontSize="12"
      fill={INK}
    >
      until you can
    </text>
    <text
      x={CENTER}
      y={CENTER + 37}
      textAnchor="middle"
      fontFamily="'Syne Mono', monospace"
      fontSize="12"
      fontWeight="bold"
      fill={INK}
    >
      buy the crown
    </text>
  </svg>
);

export default GameLoopDiagram;
