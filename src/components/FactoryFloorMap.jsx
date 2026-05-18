const ISO = {
  originX: 470,
  originY: 82,
  x: 39,
  y: 22,
};

const floor = {
  width: 16,
  depth: 10,
  thickness: 30,
};

const lineLayouts = {
  A: { x: 1.25, y: 7.35, w: 7.8, d: 0.72, order: 4, label: { x: 0.78, y: 9.45 }, robot: { x: 1.0, y: 8.45 }, gateAt: 0.72 },
  B: { x: 1.45, y: 5.05, w: 6.15, d: 0.72, order: 2, label: { x: 0.7, y: 4.25 }, robot: { x: 6.45, y: 6.05 }, gateAt: 0.58 },
  C: { x: 8.05, y: 1.15, w: 0.72, d: 4.3, order: 1, label: { x: 9.85, y: 0.42 }, robot: { x: 7.25, y: 2.05 }, gateAt: 0.5 },
  D: { x: 11.35, y: 3.0, w: 0.72, d: 4.35, order: 3, label: { x: 13.72, y: 7.88 }, robot: { x: 12.25, y: 7.25 }, gateAt: 0.56 },
};

const statusTokens = {
  alarm: {
    belt: "url(#beltAlarm)",
    side: "#8f1515",
    sideDark: "#641111",
    stroke: "#7f1d1d",
    label: "#ba1a1a",
    status: "불량",
    dot: "#ef4444",
  },
  normal: {
    belt: "url(#beltNormal)",
    side: "#415d6b",
    sideDark: "#2d4652",
    stroke: "#263f4a",
    label: "#ffffff",
    status: "정상",
    dot: "#22c55e",
  },
  wait: {
    belt: "url(#beltWait)",
    side: "#707986",
    sideDark: "#4f5966",
    stroke: "#4b5563",
    label: "#ffffff",
    status: "대기",
    dot: "#f59e0b",
  },
};

function iso(x, y, z = 0) {
  return [
    ISO.originX + (x - y) * ISO.x,
    ISO.originY + (x + y) * ISO.y - z,
  ];
}

function shiftDown(point, amount = floor.thickness) {
  return [point[0], point[1] + amount];
}

function poly(points) {
  return points.map(([x, y]) => `${Number(x.toFixed(1))},${Number(y.toFixed(1))}`).join(" ");
}

function rectPoints(x, y, w, d, z = 0) {
  return [
    iso(x, y, z),
    iso(x + w, y, z),
    iso(x + w, y + d, z),
    iso(x, y + d, z),
  ];
}

function formatTranslate([x, y]) {
  return `${Number(x.toFixed(1))} ${Number(y.toFixed(1))}`;
}

function getLineCode(line) {
  return String(line.id || line.code || "").replace(/[^A-D]/gi, "").slice(0, 1).toUpperCase();
}

function carBodyMetrics(horizontal) {
  return horizontal
    ? { w: 0.72, d: 0.34, cabin: { x: 0.27, y: 0.08, w: 0.24, d: 0.18 } }
    : { w: 0.34, d: 0.72, cabin: { x: 0.08, y: 0.27, w: 0.18, d: 0.24 } };
}

function IsoBlock({
  x,
  y,
  w,
  d,
  h,
  baseZ = 0,
  top = "#f8fafc",
  side = "#cbd5e1",
  sideDark = "#94a3b8",
  stroke = "#64748b",
  opacity = 1,
}) {
  const topFace = rectPoints(x, y, w, d, baseZ + h);
  const frontFace = [
    iso(x, y + d, baseZ + h),
    iso(x + w, y + d, baseZ + h),
    iso(x + w, y + d, baseZ),
    iso(x, y + d, baseZ),
  ];
  const rightFace = [
    iso(x + w, y, baseZ + h),
    iso(x + w, y + d, baseZ + h),
    iso(x + w, y + d, baseZ),
    iso(x + w, y, baseZ),
  ];

  return (
    <g opacity={opacity}>
      <polygon points={poly(frontFace)} fill={side} stroke={stroke} strokeWidth="1.3" />
      <polygon points={poly(rightFace)} fill={sideDark} stroke={stroke} strokeWidth="1.3" />
      <polygon points={poly(topFace)} fill={top} stroke={stroke} strokeWidth="1.6" />
    </g>
  );
}

function FloorShell() {
  const p00 = iso(0, 0);
  const pW0 = iso(floor.width, 0);
  const pWD = iso(floor.width, floor.depth);
  const p0D = iso(0, floor.depth);

  const floorTop = [p00, pW0, pWD, p0D];
  const rightSkirt = [pW0, pWD, shiftDown(pWD), shiftDown(pW0)];
  const frontSkirt = [p0D, pWD, shiftDown(pWD), shiftDown(p0D)];

  return (
    <g>
      <polygon points={poly(rightSkirt)} fill="#d1c7af" />
      <polygon points={poly(frontSkirt)} fill="#bfb49e" />
      <polygon points={poly(floorTop)} fill="url(#floorGradient)" stroke="#f8fafc" strokeWidth="4" />

      {Array.from({ length: floor.width - 1 }, (_, index) => index + 1).map((x) => (
        <line
          key={`grid-x-${x}`}
          x1={iso(x, 0)[0]}
          y1={iso(x, 0)[1]}
          x2={iso(x, floor.depth)[0]}
          y2={iso(x, floor.depth)[1]}
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.08"
        />
      ))}
      {Array.from({ length: floor.depth - 1 }, (_, index) => index + 1).map((y) => (
        <line
          key={`grid-y-${y}`}
          x1={iso(0, y)[0]}
          y1={iso(0, y)[1]}
          x2={iso(floor.width, y)[0]}
          y2={iso(floor.width, y)[1]}
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.08"
        />
      ))}
    </g>
  );
}

function MachineBlocks() {
  return (
    <g>
      <IsoBlock x={10.0} y={0.75} w={1.25} d={0.9} h={44} top="#0f6ea8" side="#075985" sideDark="#0c4a6e" stroke="#075985" />
      <IsoBlock x={9.45} y={7.75} w={1.15} d={0.8} h={36} top="#e2e8f0" side="#cbd5e1" sideDark="#94a3b8" stroke="#64748b" />
      <IsoBlock x={4.75} y={8.75} w={1.4} d={0.48} h={16} top="#f8fafc" side="#cbd5e1" sideDark="#94a3b8" stroke="#64748b" />
      <IsoBlock x={6.35} y={8.7} w={1.35} d={0.48} h={16} top="#f8fafc" side="#cbd5e1" sideDark="#94a3b8" stroke="#64748b" />
    </g>
  );
}

function CarBody({ x, y, horizontal, alarm }) {
  const body = carBodyMetrics(horizontal);
  const bodyTop = alarm ? "#fee2e2" : "#f8fafc";
  const bodySide = alarm ? "#fecaca" : "#cbd5e1";
  const bodyDark = alarm ? "#fca5a5" : "#94a3b8";
  const glass = alarm ? "#fecaca" : "#93c5fd";
  const wheelA = horizontal ? iso(x + 0.14, y + body.d, 20) : iso(x + body.w, y + 0.14, 20);
  const wheelB = horizontal ? iso(x + body.w - 0.14, y + body.d, 20) : iso(x + body.w, y + body.d - 0.14, 20);

  return (
    <g>
      <IsoBlock
        x={x}
        y={y}
        w={body.w}
        d={body.d}
        h={8}
        baseZ={16}
        top={bodyTop}
        side={bodySide}
        sideDark={bodyDark}
        stroke={alarm ? "#dc2626" : "#64748b"}
      />
      <IsoBlock
        x={x + body.cabin.x}
        y={y + body.cabin.y}
        w={body.cabin.w}
        d={body.cabin.d}
        h={7}
        baseZ={24}
        top={glass}
        side="#60a5fa"
        sideDark="#2563eb"
        stroke={alarm ? "#dc2626" : "#2563eb"}
      />
      <circle cx={wheelA[0]} cy={wheelA[1]} r="4" fill="#111827" />
      <circle cx={wheelB[0]} cy={wheelB[1]} r="4" fill="#111827" />
      <circle cx={wheelA[0]} cy={wheelA[1]} r="1.7" fill="#cbd5e1" />
      <circle cx={wheelB[0]} cy={wheelB[1]} r="1.7" fill="#cbd5e1" />
    </g>
  );
}

function ConveyorItems({ layout, alarm }) {
  const horizontal = layout.w > layout.d;
  const count = horizontal ? 4 : 3;
  const body = carBodyMetrics(horizontal);
  const edgePadding = 0.42;
  const start = horizontal
    ? {
        x: layout.x + edgePadding,
        y: layout.y + (layout.d - body.d) / 2,
      }
    : {
        x: layout.x + (layout.w - body.w) / 2,
        y: layout.y + layout.d - body.d - edgePadding,
      };
  const end = horizontal
    ? {
        x: layout.x + layout.w - body.w - edgePadding,
        y: start.y,
      }
    : {
        x: start.x,
        y: layout.y + edgePadding,
      };
  const slot = {
    x: (end.x - start.x) / count,
    y: (end.y - start.y) / count,
  };
  const slotStart = iso(start.x, start.y);
  const slotEnd = iso(start.x + slot.x, start.y + slot.y);
  const travel = [slotEnd[0] - slotStart[0], slotEnd[1] - slotStart[1]];
  const duration = alarm ? 2.1 : horizontal ? 2.8 : 2.6;

  return (
    <g>
      {Array.from({ length: count }, (_, index) => (
        <g key={`${layout.x}-${layout.y}-${index}`}>
          <animateTransform
            attributeName="transform"
            type="translate"
            from="0 0"
            to={formatTranslate(travel)}
            dur={`${duration}s`}
            repeatCount="indefinite"
          />
          <CarBody
            x={start.x + slot.x * index}
            y={start.y + slot.y * index}
            horizontal={horizontal}
            alarm={alarm}
          />
        </g>
      ))}
    </g>
  );
}

function InspectionGate({ layout, alarm }) {
  const horizontal = layout.w > layout.d;
  const zBase = 18;
  const zTop = 84;
  const x = horizontal ? layout.x + layout.w * layout.gateAt : layout.x + layout.w / 2;
  const y = horizontal ? layout.y + layout.d / 2 : layout.y + layout.d * layout.gateAt;
  const postA = horizontal ? iso(x, layout.y - 0.16, zBase) : iso(layout.x - 0.16, y, zBase);
  const postB = horizontal ? iso(x, layout.y + layout.d + 0.16, zBase) : iso(layout.x + layout.w + 0.16, y, zBase);
  const postATop = horizontal ? iso(x, layout.y - 0.16, zTop) : iso(layout.x - 0.16, y, zTop);
  const postBTop = horizontal ? iso(x, layout.y + layout.d + 0.16, zTop) : iso(layout.x + layout.w + 0.16, y, zTop);

  return (
    <g>
      <line x1={postA[0]} y1={postA[1]} x2={postATop[0]} y2={postATop[1]} stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
      <line x1={postB[0]} y1={postB[1]} x2={postBTop[0]} y2={postBTop[1]} stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
      <line x1={postATop[0]} y1={postATop[1]} x2={postBTop[0]} y2={postBTop[1]} stroke={alarm ? "#dc2626" : "#38bdf8"} strokeWidth="9" strokeLinecap="round" />
      <circle cx={postBTop[0]} cy={postBTop[1]} r="7" fill={alarm ? "#dc2626" : "#22c55e"} className={alarm ? "factory-alarm-dot" : ""} />
    </g>
  );
}

function Robot({ x, y, alarm }) {
  const baseCenter = iso(x + 0.28, y + 0.28, 22);
  const joint = iso(x + 0.1, y - 0.08, 70);
  const hand = iso(x + 0.58, y - 0.12, 50);

  return (
    <g>
      <IsoBlock x={x} y={y} w={0.56} d={0.56} h={22} top="#f8fafc" side="#cbd5e1" sideDark="#94a3b8" stroke="#64748b" />
      <circle cx={baseCenter[0]} cy={baseCenter[1]} r="13" fill="#f59e0b" stroke="#b45309" strokeWidth="4" />
      <line x1={baseCenter[0]} y1={baseCenter[1]} x2={joint[0]} y2={joint[1]} stroke="#fbbf24" strokeWidth="13" strokeLinecap="round" />
      <line x1={joint[0]} y1={joint[1]} x2={hand[0]} y2={hand[1]} stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" />
      <circle cx={joint[0]} cy={joint[1]} r="7" fill="#334155" />
      <rect x={hand[0] - 18} y={hand[1] - 7} width="36" height="14" rx="4" fill={alarm ? "#dc2626" : "#334155"} />
    </g>
  );
}

function LineLabel({ layout, code, line, tokens, alarm }) {
  const anchor = iso(layout.label.x, layout.label.y, 32);

  return (
    <g transform={`translate(${anchor[0]} ${anchor[1]})`}>
      <rect x="-58" y="-28" width="146" height="52" rx="9" fill={alarm ? "#ba1a1a" : "#ffffff"} stroke={alarm ? "#fee2e2" : "#cbd5e1"} strokeWidth="2" />
      <circle cx="-35" cy="-2" r="6" fill={tokens.dot} className={alarm ? "factory-alarm-dot" : ""} />
      <text x="-22" y="-5" fill={alarm ? "#ffffff" : "#0f172a"} fontSize="16" fontWeight="900">
        {code} 라인
      </text>
      <text x="-22" y="14" fill={alarm ? "#fee2e2" : "#64748b"} fontSize="11" fontWeight="800">
        {tokens.status} / 불량 {line.defectCount}건
      </text>
    </g>
  );
}

function LineBelt({ line, onSelect }) {
  const code = getLineCode(line);
  const layout = lineLayouts[code] || lineLayouts.A;
  const tokens = statusTokens[line.status] || statusTokens.normal;
  const alarm = line.status === "alarm";
  const clickable = alarm && line.inspectionId;
  const topFace = rectPoints(layout.x, layout.y, layout.w, layout.d, 18);

  return (
    <g
      role={clickable ? "button" : "img"}
      tabIndex={clickable ? 0 : undefined}
      aria-label={`${line.name} ${tokens.status}`}
      className={clickable ? "cursor-pointer factory-line-clickable" : ""}
      onClick={() => clickable && onSelect?.(line)}
      onKeyDown={(event) => {
        if (clickable && (event.key === "Enter" || event.key === " ")) onSelect?.(line);
      }}
    >
      <polygon points={poly(rectPoints(layout.x + 0.06, layout.y + 0.06, layout.w, layout.d, 0))} fill="#000" opacity="0.16" />
      {alarm && <polygon points={poly(topFace)} fill="#ef4444" opacity="0.38" filter="url(#alarmGlow)" className="factory-line-pulse" />}
      <IsoBlock
        x={layout.x}
        y={layout.y}
        w={layout.w}
        d={layout.d}
        h={18}
        top={tokens.belt}
        side={tokens.side}
        sideDark={tokens.sideDark}
        stroke={tokens.stroke}
      />
      <polygon points={poly(topFace)} fill="none" stroke={alarm ? "#fee2e2" : "#dbeafe"} strokeWidth="2" opacity="0.5" />
      <ConveyorItems layout={layout} alarm={alarm} />
      <InspectionGate layout={layout} alarm={alarm} />
      <Robot x={layout.robot.x} y={layout.robot.y} alarm={alarm} />
      <LineLabel layout={layout} code={code} line={line} tokens={tokens} alarm={alarm} />
    </g>
  );
}

export default function FactoryFloorMap({ lines, onLineSelect }) {
  const hasAlarm = lines.some((line) => line.status === "alarm");
  const orderedLines = [...lines].sort((a, b) => {
    const aCode = getLineCode(a);
    const bCode = getLineCode(b);
    return (lineLayouts[aCode]?.order || 0) - (lineLayouts[bCode]?.order || 0);
  });

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-[#e7eef3] shadow-sm ${
        hasAlarm
          ? "border-error ring-4 ring-error/20 active-pulse"
          : "border-outline-variant/30"
      }`}
    >
      <svg
        className="block h-full min-h-[360px] w-full md:min-h-[560px] xl:min-h-[620px]"
        viewBox="0 0 1180 720"
        role="img"
        aria-label="공장 라인 모니터링 도면"
      >
        <defs>
          <linearGradient id="floorGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3f4044" />
            <stop offset="100%" stopColor="#272b30" />
          </linearGradient>
          <linearGradient id="beltNormal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#89a5b4" />
            <stop offset="100%" stopColor="#526f7e" />
          </linearGradient>
          <linearGradient id="beltAlarm" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
          <linearGradient id="beltWait" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#7c8796" />
          </linearGradient>
          <filter id="alarmGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0.85 0 0.1 0 0 0 0 0 0.1 0 0 0 0 0 0.72 0" />
            <feBlend in="SourceGraphic" />
          </filter>
        </defs>

        <rect width="1180" height="720" fill="#e7eef3" />
        <ellipse cx="594" cy="652" rx="410" ry="38" fill="#0f172a" opacity="0.1" />
        <FloorShell />
        <MachineBlocks />
        {orderedLines.map((line) => (
          <LineBelt key={line.id} line={line} onSelect={onLineSelect} />
        ))}
      </svg>
    </div>
  );
}
