import React from "react";
import PropTypes from "prop-types";
import MoneyBag from "../../assets/money-bag.svg";
import Briefcase from "../../assets/briefcase.svg";
import Backpack from "../../assets/backpack.svg";
import Coins from "../../assets/gold_coins.svg";
import Key from "../../assets/key.svg";
import Crown from "../../assets/crown.svg";
import Wales from "../../assets/wales.svg";
import Accomplice from "../../assets/accomplice.svg";
import Iphone from "../../assets/iphone.svg";

const R = 32; // bubble radius
const STEP = 108; // distance between bubble centres (fits a ~14 char label)
// Labels are wider than their bubbles, so the first and last need room to
// overhang without being clipped by the viewBox.
const PAD = 30;
const CY = 38;
const MONO = "'Syne Mono', monospace";

const TONES = {
  neutral: { fill: "#fdf3e7", stroke: "#bb6108", arrow: "#bb6108" },
  good: { fill: "#e7f4ea", stroke: "#2e7d32", arrow: "#2e7d32" },
  bad: { fill: "#fdeceb", stroke: "#c8102e", arrow: "#c8102e" },
};

const INK = "#3a2a1a";
const MUTED = "#7a6a58";

/** A spiky little "your sack just exploded" mark. */
const BurstMark = ({ cx, cy }) => {
  const points = [];
  for (let i = 0; i < 16; i++) {
    const radius = i % 2 === 0 ? 17 : 8;
    const angle = (i * Math.PI) / 8 - Math.PI / 2;
    points.push(
      `${(cx + radius * Math.cos(angle)).toFixed(1)},${(
        cy +
        radius * Math.sin(angle)
      ).toFixed(1)}`
    );
  }
  return <polygon points={points.join(" ")} fill="#c8102e" />;
};

/**
 * A row of bubbles joined by arrows — the same visual language as the loop
 * diagram, reused for each step of the walkthrough.
 */
const Flow = ({ items, title }) => {
  const width = PAD * 2 + R * 2 + (items.length - 1) * STEP;
  const height = 122;
  const centreOf = (index) => PAD + R + index * STEP;
  const arrowId = `flow-arrow-${items.map((i) => i.tone || "n").join("")}-${items.length}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={title}
      style={{
        display: "block",
        width: "100%",
        maxWidth: `${width / 16}rem`,
        height: "auto",
        margin: "0.25rem auto 0.75rem",
        flexShrink: 0,
      }}
    >
      <defs>
        <marker
          id={arrowId}
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={TONES.neutral.arrow} />
        </marker>
      </defs>

      {items.slice(0, -1).map((item, index) => (
        <line
          key={`arrow-${index}`}
          x1={centreOf(index) + R + 5}
          y1={CY}
          x2={centreOf(index + 1) - R - 11}
          y2={CY}
          stroke={TONES.neutral.arrow}
          strokeWidth="4"
          strokeLinecap="round"
          markerEnd={`url(#${arrowId})`}
        />
      ))}

      {items.map((item, index) => {
        const cx = centreOf(index);
        const tone = TONES[item.tone || "neutral"];
        const lines = Array.isArray(item.label) ? item.label : [item.label];

        return (
          <g key={item.key || index}>
            <circle cx={cx} cy={CY} r={R} fill={tone.fill} stroke={tone.stroke} strokeWidth="3" />
            {item.burst && <BurstMark cx={cx} cy={CY} />}
            {item.image && (
              <image href={item.image} x={cx - 16} y={CY - 16} width="32" height="32" />
            )}
            {item.text && (
              <text
                x={cx}
                y={CY + 9}
                textAnchor="middle"
                fontFamily={MONO}
                fontSize="24"
                fontWeight="bold"
                fill={tone.stroke}
              >
                {item.text}
              </text>
            )}
            {lines.map((line, lineIndex) => (
              <text
                key={`${index}-${lineIndex}`}
                x={cx}
                y={CY + R + 18 + lineIndex * 15}
                textAnchor="middle"
                fontFamily={MONO}
                fontSize="12"
                fontWeight={lineIndex === 0 ? "bold" : "normal"}
                fill={lineIndex === 0 ? INK : MUTED}
              >
                {line}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
};

Flow.propTypes = {
  items: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export const ShopGraphic = () => (
  <Flow
    title="Spend gold at the shop to get a sack"
    items={[
      { image: Coins, label: ["your gold", "spend it"] },
      { image: MoneyBag, label: ["a sack", "to fill"] },
    ]}
  />
);

/** The three sacks, drawn as what actually separates them: burst risk. */
export const BagOddsGraphic = () => {
  const sacks = [
    { image: MoneyBag, name: "burlap sack", chance: 1 / 5, odds: "1 in 5" },
    { image: Briefcase, name: "leather sack", chance: 1 / 16, odds: "1 in 16" },
    { image: Backpack, name: "backpack", chance: 1 / 64, odds: "1 in 64" },
  ];
  const trackX = 172;
  const trackWidth = 116;
  const worst = sacks[0].chance;

  return (
    <svg
      viewBox="0 0 360 152"
      role="img"
      aria-label="Burst chance per coin: burlap sack 1 in 5, leather sack 1 in 16, backpack 1 in 64"
      style={{
        display: "block",
        width: "100%",
        maxWidth: "22rem",
        height: "auto",
        margin: "0.25rem auto 0.75rem",
        flexShrink: 0,
      }}
    >
      <text x="8" y="14" fontFamily={MONO} fontSize="12" fill={MUTED}>
        chance it bursts, per coin
      </text>

      {sacks.map((sack, index) => {
        const cy = 42 + index * 40;
        return (
          <g key={sack.name}>
            <image href={sack.image} x="8" y={cy - 16} width="32" height="32" />
            <text x="48" y={cy + 5} fontFamily={MONO} fontSize="14" fontWeight="bold" fill={INK}>
              {sack.name}
            </text>
            <rect
              x={trackX}
              y={cy - 7}
              width={trackWidth}
              height="14"
              rx="7"
              fill="#00000014"
            />
            <rect
              x={trackX}
              y={cy - 7}
              width={Math.max(6, (sack.chance / worst) * trackWidth)}
              height="14"
              rx="7"
              fill="#bb6108"
            />
            <text x="298" y={cy + 5} fontFamily={MONO} fontSize="13" fill={INK}>
              {sack.odds}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export const LootGraphic = () => (
  <Flow
    title="Each tap adds a coin, until the sack bursts and you lose the lot"
    items={[
      { image: MoneyBag, label: ["tap Loot", "again"] },
      { image: Coins, label: ["+1 gold", "each time"] },
      { burst: true, tone: "bad", label: ["or it bursts", "haul gone"] },
    ]}
  />
);

export const EscapeGraphic = () => (
  <>
    <Flow
      title="Answer the trivia question correctly and you keep the whole haul"
      items={[
        { image: Key, tone: "good", label: "right answer" },
        { image: Coins, tone: "good", label: "keep it all" },
      ]}
    />
    <Flow
      title="Answer wrongly and you hand over half the haul"
      items={[
        { image: Key, tone: "bad", label: "wrong answer" },
        { text: "½", tone: "bad", label: ["hand half", "over"] },
      ]}
    />
  </>
);

export const CrownGraphic = () => (
  <Flow
    title="Bank enough gold and you can buy the crown"
    items={[
      { image: Coins, label: ["100 gold", "banked"] },
      { image: Crown, tone: "good", label: ["buy the", "crown"] },
    ]}
  />
);

export const AccompliceGraphic = () => (
  <Flow
    title="Every accomplice loots alongside you, multiplying the haul"
    items={[
      { image: Coins, label: ["you loot", "+1 gold"] },
      { image: Accomplice, label: ["accomplices", "loot too"] },
      { image: Coins, tone: "good", label: ["your haul", "multiplies"] },
    ]}
  />
);

export const IphoneGraphic = () => (
  <Flow
    title="Get the trivia question wrong with an iphone and you keep the haul anyway"
    items={[
      { image: Key, tone: "bad", label: ["wrong answer", "caught"] },
      { image: Iphone, label: ["your iphone", "saves you"] },
      { image: Coins, tone: "good", label: ["keep it all", "anyway"] },
    ]}
  />
);

export const WalesGraphic = () => (
  <Flow
    title="Buy Wales, then fill it with 3.2 million accomplices"
    items={[
      { image: Coins, label: ["1 million", "gold"] },
      { image: Wales, label: ["you own", "wales"] },
      { image: Accomplice, tone: "good", label: ["fill it with", "3.2 million"] },
    ]}
  />
);

export const WorldGraphic = () => (
  <Flow
    title="Send a delegation abroad, the country goes Welsh, its people join you"
    items={[
      { image: Accomplice, label: ["send a", "delegation"] },
      { image: Wales, label: ["it goes", "Welsh"] },
      { image: Accomplice, tone: "good", label: ["they all", "join you"] },
    ]}
  />
);
