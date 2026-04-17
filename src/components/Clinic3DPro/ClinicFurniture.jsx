import React from "react";

/**
 * ClinicFurniture.jsx
 * Nội thất phụ — KHÔNG có onClick / highlight khi click.
 * Tất cả vật thể ở đây chỉ là decor, không phải sản phẩm bán.
 */

/* ── shared material colors ── */
const C = {
  white:       "#F5F6F7",
  offWhite:    "#ECEDF0",
  lightGray:   "#D8DCE0",
  metal:       "#A8B4BE",
  metalDark:   "#7E8E9A",
  teal:        "#4DB6AC",
  accent:      "#4A8AB5",
  screenDark:  "#0D1A28",
  screenGlow:  "#1254B0",
  curtain:     "#AECDE2",   /* medical blue curtain */
  curtainLine: "#6D9FBF",
  wood:        "#C5A882",
  plant:       "#3E7C4C",
  plantDark:   "#2E5C36",
  soil:        "#6B4226",
  potClay:     "#9A6548",
  lead:        "#7A8C98",
};

/* ── one-liner helpers ── */
const Bx = ({ p, r = [0, 0, 0], a, c, m = 0, ru = 0.6 }) => (
  <mesh position={p} rotation={r} castShadow receiveShadow>
    <boxGeometry args={a} />
    <meshStandardMaterial color={c} metalness={m} roughness={ru} />
  </mesh>
);

/* ════════════════════════════════════════════════════════
   1. DOCTOR'S DESK — L-shape workstation + monitor + stool
════════════════════════════════════════════════════════ */
export function DoctorDesk({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main desk surface */}
      <Bx p={[0, 0.79, 0]}    a={[1.55, 0.055, 0.68]} c={C.white}    m={0.1}  ru={0.32} />
      <Bx p={[0, 0.39, 0]}    a={[1.55, 0.78,  0.64]} c={C.offWhite} m={0.04} ru={0.65} />
      {/* Side return arm */}
      <Bx p={[-0.92, 0.62, -0.52]} a={[0.62, 0.055, 0.48]} c={C.white}    m={0.1}  ru={0.32} />
      <Bx p={[-0.92, 0.31, -0.52]} a={[0.60, 0.62,  0.44]} c={C.offWhite} m={0.04} ru={0.65} />
      {/* Monitor */}
      <Bx p={[0.32, 1.18, -0.05]} a={[0.58, 0.42, 0.042]} c={C.screenDark} m={0.62} ru={0.28} />
      <mesh position={[0.32, 1.18, -0.022]}>
        <planeGeometry args={[0.50, 0.34]} />
        <meshStandardMaterial color={C.screenDark} emissive={C.screenGlow} emissiveIntensity={0.6} roughness={0.3} />
      </mesh>
      <Bx p={[0.32, 0.87, -0.04]} a={[0.065, 0.22, 0.065]} c={C.metalDark} m={0.8} ru={0.2} />
      {/* Keyboard */}
      <Bx p={[0.1, 0.80, 0.22]} a={[0.42, 0.018, 0.16]} c={C.lightGray} m={0} ru={0.88} />
      {/* Paper tray */}
      <Bx p={[-0.5, 0.81, 0.12]} a={[0.36, 0.025, 0.26]} c={C.metal} m={0.55} ru={0.4} />
      {/* Doctor stool */}
      <Bx p={[0.1, 0.38, 0.72]} a={[0.42, 0.08, 0.42]} c={C.curtain} m={0} ru={0.82} />
      <Bx p={[0.1, 0.16, 0.72]} a={[0.055, 0.46, 0.055]} c={C.metal}  m={0.82} ru={0.18} />
      {[[-0.17, -0.17], [-0.17, 0.17], [0.17, -0.17], [0.17, 0.17]].map(([x, z], i) => (
        <Bx key={i} p={[0.1 + x, -0.06, 0.72 + z]} a={[0.038, 0.16, 0.038]} c={C.metal} m={0.82} ru={0.18} />
      ))}
    </group>
  );
}

/* ════════════════════════════════════════════════════════
   2. WALL COUNTER — Work surface + upper cabinet + sink
════════════════════════════════════════════════════════ */
export function WallCounter({ position = [0, 0, 0], rotation = [0, 0, 0], length = 3.2 }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Counter top */}
      <Bx p={[0, 0.885, 0]} a={[length, 0.055, 0.58]} c={C.white}    m={0.12} ru={0.28} />
      {/* Body */}
      <Bx p={[0, 0.44,  0]} a={[length, 0.88,  0.56]} c={C.offWhite} m={0.04} ru={0.65} />
      {/* Drawer seam */}
      <Bx p={[0, 0.72, 0.278]} a={[length, 0.01, 0.01]} c={C.metal} m={0.7} ru={0.2} />
      {/* Drawer handles */}
      {[-length/4, length/4].map((x, i) => (
        <Bx key={i} p={[x, 0.67, 0.282]} a={[0.24, 0.04, 0.02]} c={C.metal} m={0.82} ru={0.18} />
      ))}
      {/* Upper cabinet */}
      <Bx p={[0, 2.18, -0.12]} a={[length, 0.74, 0.36]}          c={C.offWhite} m={0.04} ru={0.65} />
      <Bx p={[0, 2.56, -0.12]} a={[length + 0.02, 0.05, 0.38]}   c={C.white}    m={0.1}  ru={0.28} />
      {/* Cabinet door split */}
      <Bx p={[0, 2.18, -0.1+0.18+0.005]} a={[0.02, 0.72, 0.01]} c={C.lightGray} m={0} ru={0.7} />
      {/* Sink */}
      <mesh position={[length / 2 - 0.36, 0.878, -0.01]}>
        <boxGeometry args={[0.58, 0.038, 0.44]} />
        <meshStandardMaterial color={C.metal} metalness={0.78} roughness={0.2} />
      </mesh>
      {/* Faucet */}
      <Bx p={[length/2-0.36, 1.07, -0.16]} a={[0.038, 0.28, 0.038]} c={C.metal} m={0.88} ru={0.12} />
      <Bx p={[length/2-0.36, 1.22, -0.06]} a={[0.038, 0.038, 0.2]}  c={C.metal} m={0.88} ru={0.12} />
      {/* Teal accent rail */}
      <Bx p={[0, 0.918, 0.278]} a={[length, 0.038, 0.01]} c={C.teal} m={0.38} ru={0.42} />
    </group>
  );
}

/* ════════════════════════════════════════════════════════
   3. INSTRUMENT CART — Rolling stainless tray cart
════════════════════════════════════════════════════════ */
export function InstrumentCart({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Trays */}
      <Bx p={[0, 0.84, 0]} a={[0.50, 0.038, 0.38]} c={C.metal}  m={0.78} ru={0.2} />
      <Bx p={[0, 0.52, 0]} a={[0.48, 0.025, 0.36]} c={C.metal}  m={0.72} ru={0.25} />
      {/* Corner posts */}
      {[[-0.22,-0.17],[0.22,-0.17],[-0.22,0.17],[0.22,0.17]].map(([x,z],i)=>(
        <Bx key={i} p={[x, 0.42, z]} a={[0.024, 0.84, 0.024]} c={C.metal} m={0.9} ru={0.12} />
      ))}
      {/* Wheels */}
      {[[-0.22,-0.17],[0.22,-0.17],[-0.22,0.17],[0.22,0.17]].map(([x,z],i)=>(
        <mesh key={i} position={[x, -0.01, z]} rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.042, 0.042, 0.038, 12]} />
          <meshStandardMaterial color="#2A2A2A" metalness={0.5} roughness={0.6} />
        </mesh>
      ))}
      {/* Instruments on top tray */}
      {[-0.1, 0, 0.1].map((dx, i) => (
        <Bx key={i} p={[dx, 0.90, (i - 1) * 0.09]} a={[0.018, 0.2, 0.018]} c={C.metal} m={0.92} ru={0.08} />
      ))}
    </group>
  );
}

/* ════════════════════════════════════════════════════════
   4. PRIVACY CURTAIN — Medical curtain on ceiling rail
════════════════════════════════════════════════════════ */
export function PrivacyCurtain({ position = [0, 0, 0], rotation = [0, 0, 0], width = 2.0, height = 2.6 }) {
  const railY = -0.5 + height + 0.08;
  return (
    <group position={position} rotation={rotation}>
      {/* Rail */}
      <Bx p={[0, railY, 0]} a={[width + 0.2, 0.055, 0.055]} c={C.metal} m={0.86} ru={0.14} />
      {/* Curtain panel */}
      <mesh position={[0, railY - height/2, 0]} receiveShadow>
        <boxGeometry args={[width, height, 0.038]} />
        <meshStandardMaterial color={C.curtain} roughness={0.92} transparent opacity={0.78} />
      </mesh>
      {/* Vertical stripes */}
      {[-0.55, 0, 0.55].map((x, i) => (
        <Bx key={i} p={[x, railY - height/2, 0.022]} a={[0.055, height, 0.008]} c={C.curtainLine} m={0} ru={0.95} />
      ))}
      {/* Rings on rail */}
      {[-0.48, -0.24, 0, 0.24, 0.48].map((t, i) => (
        <mesh key={i} position={[t * width, railY + 0.01, 0]}>
          <torusGeometry args={[0.032, 0.011, 8, 12]} />
          <meshStandardMaterial color={C.metal} metalness={0.86} roughness={0.14} />
        </mesh>
      ))}
    </group>
  );
}

/* ════════════════════════════════════════════════════════
   5. PLANT — Decorative corner plant in ceramic pot
════════════════════════════════════════════════════════ */
export function PlantDecor({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Pot */}
      <mesh position={[0, -0.29, 0]} castShadow>
        <cylinderGeometry args={[0.21, 0.16, 0.32, 16]} />
        <meshStandardMaterial color={C.potClay} roughness={0.82} />
      </mesh>
      {/* Soil surface */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.205, 0.205, 0.038, 16]} />
        <meshStandardMaterial color={C.soil} roughness={0.95} />
      </mesh>
      {/* Stems */}
      {[[0, 0], [0.09, 0.05], [-0.08, 0.07], [0.03, -0.06]].map(([dx, dz], i) => (
        <mesh key={i} position={[dx, 0.12 + i * 0.04, dz]} castShadow>
          <cylinderGeometry args={[0.013, 0.013, 0.32 + i * 0.1, 8]} />
          <meshStandardMaterial color="#5E8844" roughness={0.9} />
        </mesh>
      ))}
      {/* Leaf clusters */}
      {[
        [0, 0.42, 0],    [0.14, 0.36, 0.04],
        [-0.12, 0.40, 0.07], [0.05, 0.50, -0.05],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0.15 * i, i * 1.1, 0.1 * i]} castShadow>
          <sphereGeometry args={[0.11 + i * 0.015, 8, 6]} />
          <meshStandardMaterial color={[C.plant, "#4E9258", C.plantDark, "#5BA068"][i]} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/* ════════════════════════════════════════════════════════
   6. LEAD SCREEN — Radiation protection, X-ray room
════════════════════════════════════════════════════════ */
export function LeadScreen({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Shield panel */}
      <Bx p={[0, 1.35, 0]} a={[1.45, 2.7, 0.1]} c={C.lead} m={0.3} ru={0.62} />
      {/* Lead-glass window */}
      <mesh position={[0, 1.76, 0.06]}>
        <boxGeometry args={[0.92, 0.66, 0.042]} />
        <meshPhysicalMaterial transmission={0.72} roughness={0.06} ior={1.52} thickness={0.28} color="#C4D8E8" transparent opacity={0.6} />
      </mesh>
      {/* Window frame */}
      {[[-0.48, 0], [0.48, 0], [0, 0.36], [0, -0.36]].map(([x, y], i) => (
        <Bx key={i} p={[x, 1.76 + y, 0.08]}
          a={[i < 2 ? 0.055 : 0.94, i < 2 ? 0.68 : 0.055, 0.055]}
          c={C.metal} m={0.86} ru={0.14} />
      ))}
      {/* Handle */}
      <Bx p={[-0.57, 1.22, 0.08]} a={[0.055, 0.28, 0.055]} c={C.metal} m={0.86} ru={0.14} />
      {/* Feet */}
      {[-0.56, 0.56].map((x, i) => (
        <Bx key={i} p={[x, -0.06, 0]} a={[0.24, 0.12, 0.52]} c="#8A9AA6" m={0.4} ru={0.62} />
      ))}
      {/* Warning stripe */}
      <Bx p={[0, 2.72, 0]} a={[1.45, 0.05, 0.1]} c="#F9A825" m={0} ru={0.6} />
    </group>
  );
}

/* ════════════════════════════════════════════════════════
   7. CONTROL CONSOLE — Operator station in X-ray room
════════════════════════════════════════════════════════ */
export function ControlConsole({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Body */}
      <Bx p={[0, 0.52, 0]} a={[1.25, 1.04, 0.62]} c={C.offWhite} m={0.06} ru={0.65} />
      {/* Slanted control panel face */}
      <mesh position={[0, 1.1, 0.12]} rotation={[-0.36, 0, 0]} castShadow>
        <boxGeometry args={[1.22, 0.54, 0.048]} />
        <meshStandardMaterial color="#1C2D3E" metalness={0.42} roughness={0.4} />
      </mesh>
      {/* Main screen */}
      <mesh position={[0, 1.16, 0.2]} rotation={[-0.36, 0, 0]}>
        <planeGeometry args={[0.85, 0.36]} />
        <meshStandardMaterial color={C.screenDark} emissive="#1040B0" emissiveIntensity={0.7} roughness={0.3} />
      </mesh>
      {/* Button LEDs */}
      {[[-0.32, "#E53935"], [-0.12, "#43A047"], [0.08, "#FFB300"], [0.28, "#90CAF9"]].map(([x, col], i) => (
        <mesh key={i} position={[x, 0.92, 0.29]} rotation={[-0.36, 0, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.022, 12]} />
          <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.65} />
        </mesh>
      ))}
      {/* Teal top accent */}
      <Bx p={[0, 1.055, 0]} a={[1.25, 0.04, 0.62]} c={C.teal} m={0.35} ru={0.42} />
    </group>
  );
}

/* ════════════════════════════════════════════════════════
   8. COFFEE TABLE — Waiting area center table
════════════════════════════════════════════════════════ */
export function CoffeeTable({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Table top */}
      <Bx p={[0, 0.45, 0]} a={[0.95, 0.048, 0.58]} c={C.lightGray} m={0.15} ru={0.35} />
      {/* Magazines */}
      <Bx p={[-0.1, 0.478, 0.04]} r={[0, -0.15, 0]} a={[0.28, 0.014, 0.2]} c={C.accent} m={0} ru={0.95} />
      <Bx p={[0.12, 0.485, 0.02]} r={[0, 0.2, 0]}   a={[0.28, 0.014, 0.2]} c="#E53935"  m={0} ru={0.95} />
      {/* Legs */}
      {[[-0.4, -0.23], [0.4, -0.23], [-0.4, 0.23], [0.4, 0.23]].map(([x, z], i) => (
        <Bx key={i} p={[x, 0.22, z]} a={[0.04, 0.46, 0.04]} c={C.metal} m={0.86} ru={0.14} />
      ))}
    </group>
  );
}

/* ════════════════════════════════════════════════════════
   9. MEDICAL CABINET (small wall-mount style)
════════════════════════════════════════════════════════ */
export function SmallCabinet({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <Bx p={[0, 0, 0]}       a={[0.58, 0.58, 0.26]} c={C.offWhite} m={0.06} ru={0.62} />
      <Bx p={[0, 0, 0.132]}   a={[0.54, 0.54, 0.01]} c={C.white}    m={0.1}  ru={0.3}  />
      <Bx p={[0, 0, 0.138]}   a={[0.02, 0.54, 0.01]} c={C.metal}    m={0.8}  ru={0.2}  />
      {/* Handle */}
      <Bx p={[0.16, 0, 0.145]} a={[0.048, 0.2, 0.02]} c={C.metal}   m={0.88} ru={0.12} />
      {/* Red cross */}
      <Bx p={[0, 0, 0.14]} a={[0.16, 0.04, 0.005]} c="#E53935" m={0} ru={0.7} />
      <Bx p={[0, 0, 0.14]} a={[0.04, 0.16, 0.005]} c="#E53935" m={0} ru={0.7} />
    </group>
  );
}
