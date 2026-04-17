import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────
   Shared constants (medical grade palette)
───────────────────────────────────────────────────── */
const C = {
  white:      "#F8F9FA",   // medical white body
  offWhite:   "#ECEEF0",   // slightly recessed surfaces
  cushion:    "#CFE8E2",   // muted mint — clinical, not game-y
  cushionH:   "#A8D5CC",   // hovered cushion
  metal:      "#B8C1CA",   // brushed aluminium
  metalDark:  "#8A929C",   // anodised steel
  accent:     "#5B8DB8",   // HD Dental steel blue
  screenBg:   "#0D2137",   // monitor/screen dark
  screenGlow: "#1565C0",   // screen lit
  led:        "#FFFDF0",   // warm ceiling LED
  ledGlow:    "#FFEFBC",
  redBadge:   "#E53935",
  green:      "#26A869",
};

/* ─────────────────────────────────────────────────────
   HoverGlow — ring on floor when device is hovered
───────────────────────────────────────────────────── */
function HoverGlow({ r = 1.2, color = C.accent }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
      <ringGeometry args={[r, r + 0.14, 48]} />
      <meshBasicMaterial color={color} transparent opacity={0.28} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────
   Clickable wrapper with gentle float on hover
───────────────────────────────────────────────────── */
function Interactive({ children, onClick, glowR = 1.2, glowColor = C.accent, floatAmp = 0.03 }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.position.y = hovered
      ? Math.sin(t * 1.2) * floatAmp
      : THREE.MathUtils.lerp(ref.current.position.y, 0, 0.08);
  });

  return (
    <group
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    >
      <group ref={ref}>
        {children(hovered)}
      </group>
      {hovered && <HoverGlow r={glowR} color={glowColor} />}
    </group>
  );
}

/* ════════════════════════════════════════════════════
   1. DENTAL TREATMENT STATION
   Chair + Overhead Lamp + Instrument Tray + Stool
════════════════════════════════════════════════════ */
export function ProDentalStation({ position = [0, 0, 0], rotation = [0, 0, 0], onClick }) {
  return (
    <group position={position} rotation={rotation}>
      <Interactive onClick={onClick} glowR={1.6} floatAmp={0.025}>
        {(hov) => (
          <group>
            {/* ── CHAIR BASE ── */}
            <mesh position={[0, -0.36, 0]} castShadow>
              <cylinderGeometry args={[0.7, 0.86, 0.2, 36]} />
              <meshStandardMaterial color={C.metal} metalness={0.88} roughness={0.14} />
            </mesh>
            {/* Hydraulic column */}
            <mesh position={[0, 0.08, 0]} castShadow>
              <cylinderGeometry args={[0.115, 0.13, 0.88, 20]} />
              <meshStandardMaterial color={C.metalDark} metalness={0.92} roughness={0.08} />
            </mesh>

            {/* ── SEAT ── */}
            <mesh position={[0, 0.58, 0.08]} castShadow>
              <boxGeometry args={[1.18, 0.09, 1.82]} />
              <meshStandardMaterial color={C.offWhite} metalness={0.3} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.70, 0.08]} castShadow>
              <boxGeometry args={[1.1, 0.14, 1.72]} />
              <meshStandardMaterial color={hov ? C.cushionH : C.cushion} roughness={0.88} />
            </mesh>

            {/* ── BACKREST ── */}
            <mesh position={[0, 1.42, -0.72]} rotation={[0.26, 0, 0]} castShadow>
              <boxGeometry args={[1.06, 1.22, 0.11]} />
              <meshStandardMaterial color={C.offWhite} metalness={0.3} roughness={0.4} />
            </mesh>
            <mesh position={[0, 1.42, -0.64]} rotation={[0.26, 0, 0]} castShadow>
              <boxGeometry args={[0.98, 1.14, 0.11]} />
              <meshStandardMaterial color={hov ? C.cushionH : C.cushion} roughness={0.88} />
            </mesh>

            {/* ── HEADREST ── */}
            <mesh position={[0, 2.18, -1.14]} rotation={[0.48, 0, 0]} castShadow>
              <boxGeometry args={[0.5, 0.3, 0.16]} />
              <meshStandardMaterial color={hov ? C.cushionH : C.cushion} roughness={0.9} />
            </mesh>

            {/* ── ARMRESTS ── */}
            {[-0.66, 0.66].map((x) => (
              <group key={x}>
                <mesh position={[x, 0.96, -0.08]} castShadow>
                  <boxGeometry args={[0.1, 0.06, 1.0]} />
                  <meshStandardMaterial color={C.metal} metalness={0.75} roughness={0.2} />
                </mesh>
              </group>
            ))}

            {/* ── FOOTREST ── */}
            <mesh position={[0, 0.47, 1.3]} rotation={[-0.16, 0, 0]} castShadow>
              <boxGeometry args={[0.82, 0.09, 0.58]} />
              <meshStandardMaterial color={hov ? C.cushionH : C.cushion} roughness={0.9} />
            </mesh>

            {/* ── OVERHEAD DENTAL LAMP ── */}
            {/* Vertical pole */}
            <mesh position={[0.6, 2.5, -0.55]} castShadow>
              <cylinderGeometry args={[0.035, 0.035, 2.1, 14]} />
              <meshStandardMaterial color={C.metal} metalness={0.82} roughness={0.18} />
            </mesh>
            {/* Horizontal arm */}
            <mesh position={[0.22, 3.54, -0.55]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.028, 0.028, 0.82, 14]} />
              <meshStandardMaterial color={C.metal} metalness={0.82} roughness={0.18} />
            </mesh>
            {/* Lamp head housing */}
            <mesh position={[-0.2, 3.54, -0.55]} castShadow>
              <cylinderGeometry args={[0.2, 0.26, 0.12, 28]} />
              <meshStandardMaterial color={C.white} metalness={0.4} roughness={0.35} />
            </mesh>
            {/* LED face */}
            <mesh position={[-0.2, 3.46, -0.55]} rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.18, 28]} />
              <meshStandardMaterial
                color={C.led}
                emissive={C.ledGlow}
                emissiveIntensity={hov ? 3.2 : 2.2}
              />
            </mesh>
            {/* Lamp pivot knuckle */}
            <mesh position={[0.6, 3.54, -0.55]}>
              <sphereGeometry args={[0.06, 14, 14]} />
              <meshStandardMaterial color={C.metalDark} metalness={0.9} roughness={0.1} />
            </mesh>

            {/* ── INSTRUMENT TRAY ARM ── */}
            <mesh position={[0.92, 0.72, -0.28]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.56, 12]} />
              <meshStandardMaterial color={C.metalDark} metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Tray disc */}
            <mesh position={[0.92, 1.0, -0.28]} castShadow>
              <cylinderGeometry args={[0.32, 0.32, 0.035, 28]} />
              <meshStandardMaterial color={C.metal} metalness={0.72} roughness={0.22} />
            </mesh>
            {/* 3 instruments */}
            {[-0.1, 0, 0.1].map((dx, i) => (
              <mesh key={i} position={[0.92 + dx, 1.06, -0.28 + (i - 1) * 0.09]} castShadow>
                <cylinderGeometry args={[0.018, 0.018, 0.2, 10]} />
                <meshStandardMaterial color={C.metal} metalness={0.92} roughness={0.08} />
              </mesh>
            ))}

            {/* ── DENTIST STOOL ── */}
            <group position={[-1.6, 0, 0.3]}>
              <mesh position={[0, 0.54, 0]} castShadow>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 24]} />
                <meshStandardMaterial color={C.cushion} roughness={0.85} />
              </mesh>
              <mesh position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 0.6, 12]} />
                <meshStandardMaterial color={C.metalDark} metalness={0.9} roughness={0.1} />
              </mesh>
              {/* 5-spoke base */}
              {[0, 72, 144, 216, 288].map((deg) => (
                <mesh key={deg} position={[
                  Math.cos(deg * Math.PI / 180) * 0.3,
                  -0.1,
                  Math.sin(deg * Math.PI / 180) * 0.3,
                ]} rotation={[0, (-deg * Math.PI) / 180, 0]}>
                  <boxGeometry args={[0.6, 0.04, 0.05]} />
                  <meshStandardMaterial color={C.metal} metalness={0.85} roughness={0.15} />
                </mesh>
              ))}
            </group>

          </group>
        )}
      </Interactive>
    </group>
  );
}

/* ════════════════════════════════════════════════════
   2. PANORAMIC X-RAY UNIT
════════════════════════════════════════════════════ */
export function ProXRayMachine({ position = [0, 0, 0], rotation = [0, 0, 0], onClick }) {
  return (
    <group position={position} rotation={rotation}>
      <Interactive onClick={onClick} glowR={1.05} glowColor="#EF9A9A">
        {(hov) => (
          <group>
            {/* Floor pillar */}
            <mesh position={[0, 1.55, 0]} castShadow>
              <boxGeometry args={[0.2, 3.3, 0.2]} />
              <meshStandardMaterial color={C.white} metalness={0.3} roughness={0.5} />
            </mesh>
            {/* Pillar cap */}
            <mesh position={[0, 3.22, 0]}>
              <boxGeometry args={[0.26, 0.06, 0.26]} />
              <meshStandardMaterial color={C.metal} metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Horizontal rotating arm */}
            <mesh position={[0, 3.05, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.07, 0.07, 2.4, 18]} />
              <meshStandardMaterial color={C.offWhite} metalness={0.4} roughness={0.4} />
            </mesh>
            {/* C-arm vertical drop */}
            <mesh position={[0.95, 2.44, 0]} castShadow>
              <boxGeometry args={[0.1, 1.28, 0.1]} />
              <meshStandardMaterial color={C.offWhite} metalness={0.4} roughness={0.4} />
            </mesh>
            {/* X-ray head */}
            <mesh position={[0.95, 3.1, 0]} castShadow>
              <boxGeometry args={[0.52, 0.28, 0.36]} />
              <meshStandardMaterial color={C.white} metalness={0.3} roughness={0.5} />
            </mesh>
            {/* Detector plate */}
            <mesh position={[0.95, 1.78, 0]} castShadow>
              <boxGeometry args={[0.44, 0.07, 0.3]} />
              <meshStandardMaterial color="#2C3340" metalness={0.5} roughness={0.45} />
            </mesh>
            {/* Touch screen */}
            <mesh position={[-0.26, 2.82, 0.04]} castShadow>
              <boxGeometry args={[0.32, 0.48, 0.07]} />
              <meshStandardMaterial color="#1A2230" metalness={0.4} roughness={0.4} />
            </mesh>
            <mesh position={[-0.26, 2.82, 0.08]}>
              <planeGeometry args={[0.26, 0.4]} />
              <meshStandardMaterial
                color={C.screenBg}
                emissive={C.screenGlow}
                emissiveIntensity={hov ? 1.1 : 0.55}
              />
            </mesh>
            {/* Red brand badge */}
            <mesh position={[0, 0.06, 0.11]}>
              <boxGeometry args={[0.16, 0.055, 0.01]} />
              <meshStandardMaterial color={C.redBadge} emissive={C.redBadge} emissiveIntensity={0.35} />
            </mesh>
          </group>
        )}
      </Interactive>
    </group>
  );
}

/* ════════════════════════════════════════════════════
   3. RECEPTION DESK
════════════════════════════════════════════════════ */
export function ProReceptionDesk({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Counter body */}
      <mesh position={[0, 0.56, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 1.12, 1.0]} />
        <meshStandardMaterial color={C.white} roughness={0.52} metalness={0.08} />
      </mesh>
      {/* Counter top — thin darker slab */}
      <mesh position={[0, 1.14, 0]}>
        <boxGeometry args={[3.66, 0.058, 1.06]} />
        <meshStandardMaterial color={C.offWhite} metalness={0.38} roughness={0.3} />
      </mesh>
      {/* Front face accent stripe */}
      <mesh position={[0, 0.56, 0.515]}>
        <boxGeometry args={[3.6, 0.2, 0.02]} />
        <meshStandardMaterial color={C.accent} metalness={0.25} roughness={0.42} />
      </mesh>
      {/* HD Dental letterplate */}
      <mesh position={[0, 0.56, 0.528]}>
        <boxGeometry args={[1.4, 0.07, 0.015]} />
        <meshStandardMaterial color={C.white} emissive={C.white} emissiveIntensity={0.35} />
      </mesh>
      {/* Monitor */}
      <mesh position={[0.9, 1.54, -0.22]} castShadow>
        <boxGeometry args={[0.68, 0.48, 0.045]} />
        <meshStandardMaterial color="#1C2330" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.9, 1.54, -0.2]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshStandardMaterial color={C.screenBg} emissive={C.screenGlow} emissiveIntensity={0.65} />
      </mesh>
      {/* Monitor arm */}
      <mesh position={[0.9, 1.2, -0.22]}>
        <cylinderGeometry args={[0.035, 0.055, 0.28, 12]} />
        <meshStandardMaterial color={C.metalDark} metalness={0.75} roughness={0.2} />
      </mesh>
      {/* Keyboard */}
      <mesh position={[0.9, 1.165, 0.08]}>
        <boxGeometry args={[0.52, 0.022, 0.19]} />
        <meshStandardMaterial color="#C8CDD3" roughness={0.82} />
      </mesh>
    </group>
  );
}

/* ════════════════════════════════════════════════════
   4. MEDICINE / SUPPLY CABINET
════════════════════════════════════════════════════ */
export function ProStorageCabinet({ position = [0, 0, 0], rotation = [0, 0, 0], onClick }) {
  return (
    <group position={position} rotation={rotation}>
      <Interactive onClick={onClick} glowR={0.82} glowColor="#90CAF9" floatAmp={0.015}>
        {(hov) => (
          <group>
            {/* Body */}
            <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.18, 2.2, 0.48]} />
              <meshStandardMaterial color={hov ? C.white : "#F4F5F6"} roughness={0.52} metalness={0.08} />
            </mesh>
            {/* Top accent bar */}
            <mesh position={[0, 2.22, 0]}>
              <boxGeometry args={[1.2, 0.055, 0.5]} />
              <meshStandardMaterial color={C.accent} metalness={0.3} roughness={0.42} />
            </mesh>
            {/* Door vertical split */}
            <mesh position={[0, 1.1, 0.245]}>
              <boxGeometry args={[0.022, 2.2, 0.012]} />
              <meshStandardMaterial color={C.metal} roughness={0.5} />
            </mesh>
            {/* Shelf lines */}
            {[0.18, 1.1, 2.02].map((y, i) => (
              <mesh key={i} position={[0, y, 0.1]}>
                <boxGeometry args={[1.12, 0.025, 0.42]} />
                <meshStandardMaterial color={C.offWhite} roughness={0.5} metalness={0.2} />
              </mesh>
            ))}
            {/* Handles */}
            {[-0.2, 0.2].map((x, i) => (
              <mesh key={i} position={[x, 1.1, 0.252]}>
                <boxGeometry args={[0.05, 0.24, 0.028]} />
                <meshStandardMaterial color={C.metal} metalness={0.88} roughness={0.12} />
              </mesh>
            ))}
          </group>
        )}
      </Interactive>
    </group>
  );
}

/* ════════════════════════════════════════════════════
   5. AUTOCLAVE / STERILIZATION UNIT
════════════════════════════════════════════════════ */
export function ProSterilizationUnit({ position = [0, 0, 0], rotation = [0, 0, 0], onClick }) {
  return (
    <group position={position} rotation={rotation}>
      <Interactive onClick={onClick} glowR={0.72} glowColor="#CE93D8" floatAmp={0.01}>
        {(hov) => (
          <group>
            {/* Body */}
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.68, 0.58, 0.62]} />
              <meshStandardMaterial color={hov ? C.white : "#F4F5F6"} roughness={0.5} metalness={0.12} />
            </mesh>
            {/* Door face */}
            <mesh position={[0, 0, 0.32]}>
              <boxGeometry args={[0.6, 0.5, 0.025]} />
              <meshStandardMaterial color={C.offWhite} metalness={0.32} roughness={0.42} />
            </mesh>
            {/* Circular door window */}
            <mesh position={[0, 0.04, 0.338]}>
              <circleGeometry args={[0.14, 28]} />
              <meshStandardMaterial color="#C8D8E4" metalness={0.45} roughness={0.35} />
            </mesh>
            {/* Handle bar */}
            <mesh position={[0.2, 0, 0.34]}>
              <boxGeometry args={[0.055, 0.22, 0.028]} />
              <meshStandardMaterial color={C.metalDark} metalness={0.88} roughness={0.12} />
            </mesh>
            {/* Status LED */}
            <mesh position={[-0.22, 0.22, 0.336]}>
              <sphereGeometry args={[0.025, 14, 14]} />
              <meshStandardMaterial
                color={C.green}
                emissive={C.green}
                emissiveIntensity={hov ? 4 : 2.5}
              />
            </mesh>
            {/* Bottom brand line */}
            <mesh position={[0, -0.22, 0.338]}>
              <boxGeometry args={[0.38, 0.035, 0.01]} />
              <meshStandardMaterial color={C.redBadge} emissive={C.redBadge} emissiveIntensity={0.3} />
            </mesh>
          </group>
        )}
      </Interactive>
    </group>
  );
}

/* ════════════════════════════════════════════════════
   6. WAITING CHAIR (no interaction)
════════════════════════════════════════════════════ */
export function ProWaitingChair({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh position={[0, 0.44, 0]} castShadow>
        <boxGeometry args={[0.56, 0.09, 0.56]} />
        <meshStandardMaterial color={C.cushion} roughness={0.78} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.84, -0.24]} rotation={[0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.56, 0.7, 0.08]} />
        <meshStandardMaterial color={C.cushion} roughness={0.78} />
      </mesh>
      {/* 4 legs */}
      {[[-0.22, -0.22], [-0.22, 0.22], [0.22, -0.22], [0.22, 0.22]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.2, z]} castShadow>
          <cylinderGeometry args={[0.024, 0.024, 0.46, 12]} />
          <meshStandardMaterial color={C.metalDark} metalness={0.82} roughness={0.18} />
        </mesh>
      ))}
    </group>
  );
}
