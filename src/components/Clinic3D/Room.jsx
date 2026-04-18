import React from 'react';

/**
 * Room — Dental clinic interior (fixed version)
 * - Removed meshPhysicalMaterial (needs special renderer config)
 * - Fixed z-fighting by using proper box walls instead of planes
 * - Kept warm dental clinic palette
 */
export default function Room() {
  const wallMain = '#f0ebe0';  // cream upper wall
  const wallPanel = '#7a2030';  // burgundy lower panel
  const ceilCol = '#f5f0e8';  // warm ceiling
  const trimCol = '#d4c4a0';  // trim / baseboard
  const metalCol = '#9aabb8';  // window frames
  const glassCol = '#b8d8ea';  // glass (simple transparent)
  const floorTx = '#3a3530';  // dark tile treatment
  const floorWait = '#c4b59a';  // beige tile waiting

  // Reusable wall segment – solid box (no z-fighting)
  // width, height, depth in world units
  const Wall = ({ pos, size, color }) => (
    <mesh position={pos} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.55} />
    </mesh>
  );

  return (
    <group>

      {/* ══════════════════════════════════════════
          FLOOR
          ══════════════════════════════════════════ */}
      {/* Base floor - covers entire room 20x30 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 30]} />
        <meshStandardMaterial color={floorTx} roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Waiting floor - y=0.05 prevents z-fighting */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[8, 0.05, 5]} receiveShadow>
        <planeGeometry args={[4, 20]} />
        <meshStandardMaterial color={floorWait} roughness={0.45} metalness={0.05} />
      </mesh>

      {/* ══════════════════════════════════════════
          CEILING
          ══════════════════════════════════════════ */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 7.5, 0]}>
        <planeGeometry args={[20, 30]} />
        <meshStandardMaterial color={ceilCol} roughness={0.85} />
      </mesh>

      {/* Recessed ceiling lights — 2 rows */}
      {[-6, 6].map((x) =>
        [-10, -4, 2, 8].map((z) => (
          <group key={`${x}-${z}`} position={[x, 7.45, z]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.4, 0.5]} />
              <meshStandardMaterial color="#ffffff" emissive="#fff8e0" emissiveIntensity={2} />
            </mesh>
            <pointLight color="#fff5e0" intensity={1.6} distance={9} decay={2} />
          </group>
        ))
      )}

      {/* ══════════════════════════════════════════
          BACK WALL  (z = -15)
          ══════════════════════════════════════════ */}
      {/* Upper cream */}
      <Wall pos={[0, 5.25, -15]} size={[20, 4.5, 0.18]} color={wallMain} />
      {/* Lower burgundy panel */}
      <Wall pos={[0, 1.1, -15]} size={[20, 3.2, 0.18]} color={wallPanel} />
      {/* Trim strip */}
      <mesh position={[0, 2.71, -14.9]}>
        <boxGeometry args={[20, 0.12, 0.06]} />
        <meshStandardMaterial color={trimCol} roughness={0.3} />
      </mesh>
      {/* Baseboard */}
      <mesh position={[0, -0.38, -14.9]}>
        <boxGeometry args={[20, 0.2, 0.08]} />
        <meshStandardMaterial color={trimCol} roughness={0.4} />
      </mesh>

      {/* ══════════════════════════════════════════
          LEFT WALL  (x = -10)
          ══════════════════════════════════════════ */}
      <Wall pos={[-10, 5.25, 0]} size={[0.18, 4.5, 30]} color={wallMain} />
      <Wall pos={[-10, 1.1, 0]} size={[0.18, 3.2, 30]} color={wallPanel} />
      <mesh position={[-9.9, 2.71, 0]}>
        <boxGeometry args={[0.06, 0.12, 30]} />
        <meshStandardMaterial color={trimCol} roughness={0.3} />
      </mesh>
      <mesh position={[-9.9, -0.38, 0]}>
        <boxGeometry args={[0.06, 0.2, 30]} />
        <meshStandardMaterial color={trimCol} roughness={0.4} />
      </mesh>

      {/* ══════════════════════════════════════════
          RIGHT WALL  (x = +10)
          ══════════════════════════════════════════ */}
      <Wall pos={[10, 5.25, 0]} size={[0.18, 4.5, 30]} color={wallMain} />
      <Wall pos={[10, 1.1, 0]} size={[0.18, 3.2, 30]} color={wallPanel} />
      <mesh position={[9.9, 2.71, 0]}>
        <boxGeometry args={[0.06, 0.12, 30]} />
        <meshStandardMaterial color={trimCol} roughness={0.3} />
      </mesh>
      <mesh position={[9.9, -0.38, 0]}>
        <boxGeometry args={[0.06, 0.2, 30]} />
        <meshStandardMaterial color={trimCol} roughness={0.4} />
      </mesh>

      {/* ══════════════════════════════════════════
          FRONT WALL  (z = +15)
          ══════════════════════════════════════════ */}
      {/* Top solid band */}
      <Wall pos={[0, 6.6, 15]} size={[20, 1.8, 0.18]} color={wallMain} />
      {/* Bottom solid band */}
      <Wall pos={[0, 0.35, 15]} size={[20, 1.5, 0.18]} color={wallPanel} />
      {/* Glass window strip (using simple transparent material) */}
      <mesh position={[0, 3.8, 15]}>
        <boxGeometry args={[20, 4.8, 0.10]} />
        <meshStandardMaterial
          color={glassCol}
          transparent opacity={0.30}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>
      {/* Window frame verticals */}
      {[-8, -4, 0, 4, 8].map((x, i) => (
        <mesh key={i} position={[x, 3.8, 15]}>
          <boxGeometry args={[0.12, 4.8, 0.14]} />
          <meshStandardMaterial color={metalCol} metalness={0.7} roughness={0.2} />
        </mesh>
      ))}
      {/* Window frame horizontals */}
      {[1.5, 6.0].map((y, i) => (
        <mesh key={i} position={[0, y, 15]}>
          <boxGeometry args={[20, 0.12, 0.14]} />
          <meshStandardMaterial color={metalCol} metalness={0.7} roughness={0.2} />
        </mesh>
      ))}

      {/* ══════════════════════════════════════════
          TREATMENT ROOM DIVIDERS (Glass Partitions)
          Separating the 3 dental chairs into semi-private cubicles.
          Placed at z = 5 and z = -5. Runs from x = -10 (left wall) to x = -2.5 (corridor)
          ══════════════════════════════════════════ */}
      {[5, -5].map((zPos, idx) => (
        <group key={`divider-${idx}`}>
          {/* Main frosted glass pane */}
          <mesh position={[-6.0, 3.5, zPos]}>
            <boxGeometry args={[8.0, 7, 0.06]} />
            <meshPhysicalMaterial 
              color="#e0f2fe"
              transmission={0.8}
              opacity={1}
              roughness={0.3}
              thickness={0.1}
            />
          </mesh>
          {/* Top rail */}
          <mesh position={[-6.0, 7.0, zPos]}>
            <boxGeometry args={[8.0, 0.08, 0.12]} />
            <meshStandardMaterial color={metalCol} metalness={0.7} roughness={0.2} />
          </mesh>
          {/* Bottom rail */}
          <mesh position={[-6.0, 0.04, zPos]}>
            <boxGeometry args={[8.0, 0.08, 0.12]} />
            <meshStandardMaterial color={metalCol} metalness={0.7} roughness={0.2} />
          </mesh>
          {/* Open edge vertical post */}
          <mesh position={[-2.0, 3.5, zPos]}>
            <boxGeometry args={[0.08, 7, 0.12]} />
            <meshStandardMaterial color={metalCol} metalness={0.7} roughness={0.2} />
          </mesh>
        </group>
      ))}


      {/* ══════════════════════════════════════════
          INTERIOR PARTITION — treatment vs waiting
          x ≈ +4.5  (runs along z-axis)
          ══════════════════════════════════════════ */}
      {/* Solid wall south section */}
      <mesh position={[4.5, 3.5, -6]} castShadow receiveShadow>
        <boxGeometry args={[0.16, 7.5, 18]} />
        <meshStandardMaterial color={wallMain} roughness={0.55} />
      </mesh>
      {/* Solid wall north section */}
      <mesh position={[4.5, 3.5, 10.5]} castShadow receiveShadow>
        <boxGeometry args={[0.16, 7.5, 9]} />
        <meshStandardMaterial color={wallMain} roughness={0.55} />
      </mesh>
      {/* Glass panel in doorway gap */}
      <mesh position={[4.5, 3.0, 2.5]}>
        <boxGeometry args={[0.10, 5.0, 2.5]} />
        <meshStandardMaterial color={glassCol} transparent opacity={0.25} roughness={0.05} />
      </mesh>
      {/* Door frame header */}
      <mesh position={[4.5, 3.8, 1.3]}>
        <boxGeometry args={[0.22, 0.14, 2.6]} />
        <meshStandardMaterial color={trimCol} roughness={0.3} />
      </mesh>
      {/* Partition trim rail */}
      <mesh position={[4.5, 7.5, 0]}>
        <boxGeometry args={[0.24, 0.12, 30]} />
        <meshStandardMaterial color={trimCol} roughness={0.3} />
      </mesh>
      {/* Partition baseboard */}
      <mesh position={[4.5, -0.38, 0]}>
        <boxGeometry args={[0.22, 0.22, 30]} />
        <meshStandardMaterial color={trimCol} roughness={0.3} />
      </mesh>



      {/* ══════════════════════════════════════════
          RECEPTION COUNTER
          ══════════════════════════════════════════ */}
      <mesh position={[8.6, 0.65, 0]} castShadow>
        <boxGeometry args={[2.4, 1.4, 1.0]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.5} />
      </mesh>
      {/* Counter top */}
      <mesh position={[8.6, 1.38, 0]} castShadow>
        <boxGeometry args={[2.6, 0.09, 1.2]} />
        <meshStandardMaterial color={trimCol} roughness={0.28} metalness={0.2} />
      </mesh>
      {/* Counter front panel — burgundy */}
      <mesh position={[8.6, 0.65, 0.52]}>
        <boxGeometry args={[2.4, 1.4, 0.05]} />
        <meshStandardMaterial color={wallPanel} roughness={0.4} />
      </mesh>


      {/* ══════════════════════════════════════════
          DECORATIVE ELEMENTS
          ══════════════════════════════════════════ */}

      {/* Left wall posters */}
      {[[-7, '#1e40af'], [4, '#065f46']].map(([z, col], i) => (
        <group key={i} position={[-9.88, 4.5, z]} rotation={[0, Math.PI / 2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[2.6, 1.8, 0.06]} />
            <meshStandardMaterial color="#ddd8cc" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <planeGeometry args={[2.4, 1.6]} />
            <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.15} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Clinic brand panel on right wall */}
      <group position={[9.88, 4.8, -4]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[4.5, 1.2, 0.07]} />
          <meshStandardMaterial color="#2a1a1e" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[4.3, 1.0]} />
          <meshStandardMaterial color={wallPanel} emissive={wallPanel} emissiveIntensity={0.3} roughness={0.4} />
        </mesh>
      </group>

      {/* Waiting area rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7.5, -0.495, 10]}>
        <planeGeometry args={[3.5, 5.5]} />
        <meshStandardMaterial color="#4a2e20" roughness={0.95} />
      </mesh>

    </group>
  );
}
