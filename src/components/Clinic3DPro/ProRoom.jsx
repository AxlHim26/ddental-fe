import React from "react";

/**
 * ClinicFloorPlan — Mặt bằng phòng khám nha khoa 4 khu vực:
 *
 *   ┌───────────────────────────────────────────┐
 *   │         PHÒNG X-QUANG / CBCT              │ z:-13→-4
 *   ├──────────────────┬────────────────────────┤
 *   │  PHÒNG ĐIỀU TRỊ  │  PHÒNG ĐIỀU TRỊ 2      │ z:-4→4
 *   │       1          │                        │
 *   ├──────────────────┴────────────────────────┤
 *   │     TIẾP ĐÓN + KHU CHỜ KHÁCH             │ z:4→11
 *   └───────────────────────────────────────────┘
 *        (LỐI VÀO — phía camera)
 *
 * Tọa độ: x ∈ [-10, 10], z ∈ [-13, 11], sàn y = -0.5
 */
export default function ProRoom() {

  /* ── palette ── */
  const WALL   = "#F5F6F7";
  const WALL2  = "#F0F1F2";   /* inner partition */
  const FLOOR  = "#E3E5E7";
  const FLOOR2 = "#EEF0F0";   /* treatment room floor (slightly lighter) */
  const CEIL   = "#FFFFFF";
  const TRIM   = "#CDD1D5";
  const METAL  = "#AEBAC4";
  const ACCENT = "#4A8AB5";   /* steel-blue accent rail */
  const TEAL   = "#4DB6AC";   /* teal accent (waiting area) */

  /* ── dimensions ── */
  const W      = 20;   /* total width   x: -10 → 10 */
  const H      = 6.5;  /* room height */
  const Y      = -0.5; /* floor Y */
  const YC     = Y + H;    /* ceiling Y = 6.0 */
  const YM     = Y + H/2;  /* mid Y    = 2.75 */

  /* ── zone Z boundaries ── */
  const Z_BACK  = -13; /* back wall */
  const Z_P2    = -4;  /* partition 2: imaging / treatment */
  const Z_P1    =  4;  /* partition 1: treatment / reception */
  const Z_FRONT =  11; /* front opening (no wall) */

  /* ── doorway helpers ── */
  const DH  = Y + 2.65; /* door height */
  const DW  = 2.0;      /* door width (half = 1.0) */

  /* ── reusable mesh ── */
  const B = ({ p, r=[0,0,0], a, c, m=0, ru=0.6 }) => (
    <mesh position={p} rotation={r} castShadow receiveShadow>
      <boxGeometry args={a} />
      <meshStandardMaterial color={c} metalness={m} roughness={ru} />
    </mesh>
  );
  const P = ({ p, r, w, h, c, ru=0.75 }) => (
    <mesh position={p} rotation={r} receiveShadow>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial color={c} roughness={ru} />
    </mesh>
  );

  /* helper: doorway in a wall (3 segments + frame) */
  const Doorway = ({ wallX, wallZ, wallW, wallThk, facing, doorZ1, doorZ2 }) => {
    /* facing: "z"=wall normal along z, "x"=wall normal along x */
    const fullH    = H;
    const lintelH  = YC - DH;
    const sideH    = fullH;
    const d1 = doorZ1;
    const d2 = doorZ2;
    const middle = (d1 + d2) / 2;

    if (facing === "z") {
      /* wall runs along X axis, normal faces Z */
      const leftW  = d1 - (-W/2);   /* left of door, measuring from left wall */
      const rightW = W/2 - d2;
      const gapW   = d2 - d1;
      return (
        <group>
          {/* left segment */}
          {leftW > 0 && <B p={[(-W/2 + d1)/2, YM, wallZ]} a={[leftW, fullH, wallThk]} c={WALL2} />}
          {/* right segment */}
          {rightW > 0 && <B p={[(d2 + W/2)/2, YM, wallZ]} a={[rightW, fullH, wallThk]} c={WALL2} />}
          {/* lintel */}
          <B p={[middle, (DH + YC)/2, wallZ]} a={[gapW, lintelH, wallThk]} c={WALL2} />
          {/* door frame */}
          {[d1 - 0.04, d2 + 0.04].map((xf, i) => (
            <B key={i} p={[xf, Y + DH/2 - Y/2, wallZ]} a={[0.08, DH - Y, 0.12]} c={METAL} m={0.8} ru={0.2} />
          ))}
          <B p={[middle, DH + 0.04, wallZ]} a={[gapW + 0.08, 0.08, 0.12]} c={METAL} m={0.8} ru={0.2} />
        </group>
      );
    }

    /* facing === "x" — wall runs along Z axis, normal faces X */
    const botH  = DH - Y;
    const topH  = YC - DH;
    const segZ1 = Z_BACK;
    const beforeL = d1 - segZ1;
    const afterL  = (Z_P1) - d2;
    const gapW2   = d2 - d1;
    return (
      <group>
        <B p={[wallX, YM, (segZ1 + d1)/2]} a={[wallThk, fullH, beforeL]} c={WALL2} />
        <B p={[wallX, YM, (d2 + Z_P1)/2]} a={[wallThk, fullH, afterL]} c={WALL2} />
        <B p={[wallX, (DH+YC)/2, (d1+d2)/2]} a={[wallThk, topH, gapW2]} c={WALL2} />
        {[d1 - 0.04, d2 + 0.04].map((zf, i) => (
          <B key={i} p={[wallX, Y + botH/2, zf]} a={[0.12, botH, 0.08]} c={METAL} m={0.8} ru={0.2} />
        ))}
        <B p={[wallX, DH + 0.04, (d1+d2)/2]} a={[0.12, 0.08, gapW2 + 0.08]} c={METAL} m={0.8} ru={0.2} />
      </group>
    );
  };

  return (
    <group>

      {/* ══════════════════════════════════════════
          FLOOR — 3 zones, slightly different tones
      ══════════════════════════════════════════ */}
      {/* Reception floor */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0, Y, (Z_P1+Z_FRONT)/2]} receiveShadow>
        <planeGeometry args={[W, Z_FRONT-Z_P1]} />
        <meshStandardMaterial color={FLOOR2} roughness={0.22} metalness={0.05} envMapIntensity={0.6} />
      </mesh>
      {/* Treatment floor */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0, Y, (Z_P2+Z_P1)/2]} receiveShadow>
        <planeGeometry args={[W, Z_P1-Z_P2]} />
        <meshStandardMaterial color={FLOOR} roughness={0.2} metalness={0.07} envMapIntensity={0.7} />
      </mesh>
      {/* Imaging floor */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0, Y, (Z_BACK+Z_P2)/2]} receiveShadow>
        <planeGeometry args={[W, Z_P2-Z_BACK]} />
        <meshStandardMaterial color="#DADCDE" roughness={0.18} metalness={0.08} envMapIntensity={0.8} />
      </mesh>
      {/* Tile grid overlay */}
      {[[0, (Z_P1+Z_FRONT)/2, W, Z_FRONT-Z_P1],
        [0, (Z_P2+Z_P1)/2, W, Z_P1-Z_P2],
        [0, (Z_BACK+Z_P2)/2, W, Z_P2-Z_BACK]
      ].map(([x,z,w,d], i) => (
        <mesh key={i} rotation={[-Math.PI/2,0,0]} position={[x, Y+0.005, z]}>
          <planeGeometry args={[w, d, Math.round(w), Math.round(d)]} />
          <meshStandardMaterial color="#B8BCBF" roughness={1} wireframe transparent opacity={0.07} />
        </mesh>
      ))}

      {/* ══════════════════════════════════════════
          CEILING
      ══════════════════════════════════════════ */}
      <mesh position={[0, YC, 0]} rotation={[Math.PI/2,0,0]}>
        <planeGeometry args={[W, Z_FRONT-Z_BACK]} />
        <meshStandardMaterial color={CEIL} roughness={0.95} />
      </mesh>

      {/* ══════════════════════════════════════════
          OUTER WALLS
      ══════════════════════════════════════════ */}
      {/* Back wall */}
      <P p={[0, YM, Z_BACK]} r={[0,0,0]} w={W} h={H} c={WALL} />
      <P p={[0, Y+0.55, Z_BACK+0.01]} r={[0,0,0]} w={W} h={1.1} c={WALL2} />
      <B p={[0, Y+1.12, Z_BACK+0.015]} a={[W, 0.04, 0.04]} c={ACCENT} m={0.4} ru={0.4} />
      {/* HD Dental sign on back wall */}
      <B p={[0, 4.2, Z_BACK+0.05]} a={[3.4, 0.56, 0.06]} c="#1C2B3A" m={0.7} ru={0.3} />
      <mesh position={[0, 4.2, Z_BACK+0.09]}>
        <planeGeometry args={[2.8, 0.26]} />
        <meshStandardMaterial color="#E53935" emissive="#E53935" emissiveIntensity={0.55} roughness={0.3} />
      </mesh>

      {/* Left wall */}
      <P p={[-W/2, YM, (Z_BACK+Z_FRONT)/2]} r={[0,Math.PI/2,0]} w={Z_FRONT-Z_BACK} h={H} c={WALL} />
      <P p={[-W/2+0.01, Y+0.55, (Z_BACK+Z_FRONT)/2]} r={[0,Math.PI/2,0]} w={Z_FRONT-Z_BACK} h={1.1} c={WALL2} />
      <B p={[-W/2+0.02, Y+1.12, (Z_BACK+Z_FRONT)/2]} r={[0,Math.PI/2,0]} a={[Z_FRONT-Z_BACK, 0.04, 0.04]} c={TEAL} m={0.4} ru={0.4} />

      {/* Right wall (with windows in treatment zone) */}
      <P p={[W/2, YM, (Z_BACK+Z_FRONT)/2]} r={[0,-Math.PI/2,0]} w={Z_FRONT-Z_BACK} h={H} c={WALL} />
      <P p={[W/2-0.01, Y+0.55, (Z_BACK+Z_FRONT)/2]} r={[0,-Math.PI/2,0]} w={Z_FRONT-Z_BACK} h={1.1} c={WALL2} />
      <B p={[W/2-0.02, Y+1.12, (Z_BACK+Z_FRONT)/2]} r={[0,Math.PI/2,0]} a={[Z_FRONT-Z_BACK, 0.04, 0.04]} c={TEAL} m={0.4} ru={0.4} />
      {/* Windows on right wall – treatment zone */}
      {[-1, 3].map((z, i) => (
        <group key={i} position={[W/2-0.07, 3.2, z]}>
          <mesh rotation={[0,-Math.PI/2,0]}>
            <planeGeometry args={[3.2, 2.5]} />
            <meshPhysicalMaterial transmission={0.83} roughness={0.04} ior={1.5} thickness={0.3} color="#D5EDF8" transparent opacity={0.46} />
          </mesh>
          {/* window frame */}
          {[[-1.64,0],[1.64,0]].map(([oz],j)=>(
            <B key={j} p={[0,0,z+oz]} r={[0,-Math.PI/2,0]} a={[0.07, 2.5, 0.09]} c={METAL} m={0.85} ru={0.15}/>
          ))}
          {[[-1.3],[1.3]].map(([oy],j)=>(
            <B key={j} p={[0,oy,z]} r={[0,-Math.PI/2,0]} a={[3.2, 0.07, 0.09]} c={METAL} m={0.85} ru={0.15}/>
          ))}
        </group>
      ))}

      {/* ══════════════════════════════════════════
          PARTITION 1 — Reception / Treatment  z=4
          Door: x = -1.0 to 1.0 (width 2m, centered)
      ══════════════════════════════════════════ */}
      <group>
        {/* left segment x: -10 → -1 */}
        <B p={[(-W/2 + -DW)/2, YM, Z_P1]} a={[W/2-DW, H, 0.16]} c={WALL2} />
        {/* right segment x: 1 → 10 */}
        <B p={[(DW + W/2)/2, YM, Z_P1]} a={[W/2-DW, H, 0.16]} c={WALL2} />
        {/* lintel above door */}
        <B p={[0, (DH+YC)/2, Z_P1]} a={[DW*2, YC-DH, 0.16]} c={WALL2} />
        {/* door frame */}
        {[-DW-0.04, DW+0.04].map((xf,i)=>(
          <B key={i} p={[xf, Y+(DH-Y)/2, Z_P1]} a={[0.08, DH-Y, 0.13]} c={METAL} m={0.82} ru={0.18}/>
        ))}
        <B p={[0, DH+0.04, Z_P1]} a={[DW*2+0.08, 0.08, 0.13]} c={METAL} m={0.82} ru={0.18}/>
        {/* wainscot on partition */}
        <B p={[-W/4-DW/2, Y+1.12, Z_P1-0.09]} a={[W/2-DW, 0.04, 0.04]} c={ACCENT} m={0.4} ru={0.4}/>
        <B p={[ W/4+DW/2, Y+1.12, Z_P1-0.09]} a={[W/2-DW, 0.04, 0.04]} c={ACCENT} m={0.4} ru={0.4}/>
      </group>

      {/* ══════════════════════════════════════════
          PARTITION 2 — Treatment / Imaging  z=-4
          Two doors: left x=[-7,-4.5], right x=[4.5,7]
      ══════════════════════════════════════════ */}
      <group>
        {/* 3 wall segments between doors */}
        <B p={[(-W/2 + -7)/2, YM, Z_P2]} a={[W/2-7, H, 0.16]} c={WALL2} />
        <B p={[(-4.5+4.5)/2, YM, Z_P2]} a={[9.0, H, 0.16]} c={WALL2} />
        <B p={[(7 + W/2)/2, YM, Z_P2]} a={[W/2-7, H, 0.16]} c={WALL2} />
        {/* lintels above doors */}
        {[[-5.75, 2.5], [5.75, 2.5]].map(([cx, w], i)=>(
          <B key={i} p={[cx, (DH+YC)/2, Z_P2]} a={[w, YC-DH, 0.16]} c={WALL2}/>
        ))}
        {/* door frames */}
        {[-7,-4.5, 4.5,7].map((xf,i)=>(
          <B key={i} p={[xf, Y+(DH-Y)/2, Z_P2]} a={[0.08, DH-Y, 0.13]} c={METAL} m={0.82} ru={0.18}/>
        ))}
        {/* door headers */}
        {[[-5.75, 2.5],[5.75, 2.5]].map(([cx,w],i)=>(
          <B key={i} p={[cx, DH+0.04, Z_P2]} a={[w+0.08, 0.08, 0.13]} c={METAL} m={0.82} ru={0.18}/>
        ))}
        {/* wainscot */}
        <B p={[(-W/2-7+0.25)/2+(-W/2)/2, Y+1.12, Z_P2-0.09]} a={[W/2-7, 0.04, 0.04]} c={ACCENT} m={0.4} ru={0.4}/>
        <B p={[0, Y+1.12, Z_P2-0.09]} a={[9.0, 0.04, 0.04]} c={ACCENT} m={0.4} ru={0.4}/>
        <B p={[(7+W/2-0.25)/2+(W/2)/2, Y+1.12, Z_P2-0.09]} a={[W/2-7, 0.04, 0.04]} c={ACCENT} m={0.4} ru={0.4}/>
      </group>

      {/* ══════════════════════════════════════════
          CENTER WALL — splits Treatment 1 and 2
          x=0, z: Z_P2 → Z_P1  with door z=0.5→2.5
      ══════════════════════════════════════════ */}
      <group>
        {/* back segment z: -4 → 0.5 */}
        <B p={[0, YM, (Z_P2+0.5)/2]} a={[0.16, H, 0.5-Z_P2]} c={WALL2}/>
        {/* front segment z: 2.5 → 4 */}
        <B p={[0, YM, (2.5+Z_P1)/2]} a={[0.16, H, Z_P1-2.5]} c={WALL2}/>
        {/* lintel z: 0.5 → 2.5 */}
        <B p={[0, (DH+YC)/2, (0.5+2.5)/2]} a={[0.16, YC-DH, 2.0]} c={WALL2}/>
        {/* door frame */}
        {[0.46, 2.54].map((zf,i)=>(
          <B key={i} p={[0, Y+(DH-Y)/2, zf]} a={[0.13, DH-Y, 0.08]} c={METAL} m={0.82} ru={0.18}/>
        ))}
        <B p={[0, DH+0.04, 1.5]} a={[0.13, 0.08, 2.08]} c={METAL} m={0.82} ru={0.18}/>
        {/* accent rails on center wall */}
        <B p={[0.09, Y+1.12, (Z_P2+0.5)/2]} r={[0,Math.PI/2,0]} a={[0.5-Z_P2, 0.04, 0.04]} c={TEAL} m={0.4} ru={0.4}/>
        <B p={[0.09, Y+1.12, (2.5+Z_P1)/2]} r={[0,Math.PI/2,0]} a={[Z_P1-2.5, 0.04, 0.04]} c={TEAL} m={0.4} ru={0.4}/>
      </group>

      {/* ══════════════════════════════════════════
          CEILING LED PANELS per room
      ══════════════════════════════════════════ */}
      {/* Reception area lights */}
      {[-5,0,5].map(x=> (
        <group key={`r${x}`} position={[x, YC-0.02, (Z_P1+Z_FRONT)/2]}>
          <B p={[0,0,0]} r={[Math.PI/2,0,0]} a={[0.2,2.0,0.06]} c="#D8DADC" ru={0.6}/>
          <mesh position={[0,-0.02,0]} rotation={[Math.PI/2,0,0]}>
            <planeGeometry args={[0.12,1.85]}/>
            <meshStandardMaterial color="#FFF" emissive="#F8FCFF" emissiveIntensity={5} roughness={1}/>
          </mesh>
        </group>
      ))}
      {/* Treatment room 1 (left) lights */}
      {[-7,-3].map(x=>(
        <group key={`t1${x}`} position={[x, YC-0.02, (Z_P2+Z_P1)/2]}>
          <B p={[0,0,0]} r={[Math.PI/2,0,0]} a={[0.2,2.0,0.06]} c="#D8DADC" ru={0.6}/>
          <mesh position={[0,-0.02,0]} rotation={[Math.PI/2,0,0]}>
            <planeGeometry args={[0.12,1.85]}/>
            <meshStandardMaterial color="#FFF" emissive="#FDFEFF" emissiveIntensity={5} roughness={1}/>
          </mesh>
        </group>
      ))}
      {/* Treatment room 2 (right) lights */}
      {[3,7].map(x=>(
        <group key={`t2${x}`} position={[x, YC-0.02, (Z_P2+Z_P1)/2]}>
          <B p={[0,0,0]} r={[Math.PI/2,0,0]} a={[0.2,2.0,0.06]} c="#D8DADC" ru={0.6}/>
          <mesh position={[0,-0.02,0]} rotation={[Math.PI/2,0,0]}>
            <planeGeometry args={[0.12,1.85]}/>
            <meshStandardMaterial color="#FFF" emissive="#FDFEFF" emissiveIntensity={5} roughness={1}/>
          </mesh>
        </group>
      ))}
      {/* Imaging room lights */}
      {[-6,0,6].map(x=>(
        <group key={`img${x}`} position={[x, YC-0.02, (Z_BACK+Z_P2)/2]}>
          <B p={[0,0,0]} r={[Math.PI/2,0,0]} a={[0.2,2.2,0.06]} c="#D8DADC" ru={0.6}/>
          <mesh position={[0,-0.02,0]} rotation={[Math.PI/2,0,0]}>
            <planeGeometry args={[0.12,2.0]}/>
            <meshStandardMaterial color="#FFF" emissive="#EEF7FF" emissiveIntensity={4.5} roughness={1}/>
          </mesh>
        </group>
      ))}

      {/* ══════════════════════════════════════════
          CROWN MOLDING + SKIRTING
      ══════════════════════════════════════════ */}
      {[
        {p:[0,       YC-0.02, Z_BACK+0.06],  r:[0,0,0],          a:[W,0.05,0.12]},
        {p:[0,       YC-0.02, Z_FRONT-0.06], r:[0,0,0],          a:[W,0.05,0.12]},
        {p:[-W/2+0.06,YC-0.02,0],            r:[0,Math.PI/2,0], a:[Z_FRONT-Z_BACK,0.05,0.12]},
        {p:[ W/2-0.06,YC-0.02,0],            r:[0,Math.PI/2,0], a:[Z_FRONT-Z_BACK,0.05,0.12]},
      ].map(({p,r,a},i)=><B key={i} p={p} r={r} a={a} c={TRIM} m={0.1} ru={0.5}/>)}
      {[
        {p:[0,       Y+0.07, Z_BACK+0.04],  r:[0,0,0],          w:W},
        {p:[-W/2+0.04,Y+0.07,0],            r:[0,Math.PI/2,0], w:Z_FRONT-Z_BACK},
        {p:[ W/2-0.04,Y+0.07,0],            r:[0,Math.PI/2,0], w:Z_FRONT-Z_BACK},
      ].map(({p,r,w},i)=><B key={i} p={p} r={r} a={[w,0.14,0.06]} c={TRIM} m={0.1} ru={0.55}/>)}

      {/* ══════════════════════════════════════════
          ROOM SIGN PLAQUES on partitions
      ══════════════════════════════════════════ */}
      {/* "PHÒNG ĐIỀU TRỊ 1" on center wall, facing left */}
      <mesh position={[-0.11, 3.5, 0]} rotation={[0, -Math.PI/2, 0]}>
        <planeGeometry args={[1.8, 0.28]} />
        <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={0.18} roughness={0.4} />
      </mesh>
      {/* "PHÒNG ĐIỀU TRỊ 2" on center wall, facing right */}
      <mesh position={[0.11, 3.5, 0]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[1.8, 0.28]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.18} roughness={0.4} />
      </mesh>
      {/* "X-QUANG" sign on partition 2, facing reception */}
      <mesh position={[0, 4.0, Z_P2+0.1]}>
        <planeGeometry args={[2.0, 0.28]} />
        <meshStandardMaterial color="#5E6AD2" emissive="#5E6AD2" emissiveIntensity={0.2} roughness={0.4} />
      </mesh>
      {/* "TIẾP ĐÓN" sign on partition 1, facing entry */}
      <mesh position={[0, 4.0, Z_P1+0.1]}>
        <planeGeometry args={[2.0, 0.28]} />
        <meshStandardMaterial color={TEAL} emissive={TEAL} emissiveIntensity={0.18} roughness={0.4} />
      </mesh>

    </group>
  );
}
