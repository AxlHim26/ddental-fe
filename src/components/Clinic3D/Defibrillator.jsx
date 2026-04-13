import React, { useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Defibrillator — A red emergency crash cart with a defibrillator unit.
 */
export default function Defibrillator({ onClick }) {
  const [hovered, setHovered] = useState(false);

  const cartColor = '#ef4444'; // Red crash cart
  const unitColor = '#f8fafc';

  return (
    <group
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
    >
      {/* Wheels */}
      {[[-0.3, -0.2], [0.3, -0.2], [-0.3, 0.2], [0.3, 0.2]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.05, pos[1]]} castShadow>
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      ))}

      {/* Cart Body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.7, 0.8, 0.5]} />
        <meshStandardMaterial color={cartColor} roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Drawers */}
      {[0.2, 0.45, 0.7].map((y, i) => (
        <mesh key={i} position={[0, y, 0.26]}>
          <boxGeometry args={[0.6, 0.2, 0.02]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
      ))}

      {/* Defibrillator Unit */}
      <group position={[0, 0.95, 0]}>
        <mesh>
          <boxGeometry args={[0.5, 0.3, 0.3]} />
          <meshStandardMaterial color={unitColor} />
        </mesh>
        
        {/* Screen */}
        <mesh position={[-0.05, 0.05, 0.16]}>
          <planeGeometry args={[0.3, 0.15]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#38bdf8" emissiveIntensity={0.5} />
        </mesh>

        {/* Paddles */}
        <mesh position={[0.3, 0.05, 0.1]}>
          <boxGeometry args={[0.1, 0.15, 0.1]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0.3, 0.05, -0.05]}>
          <boxGeometry args={[0.1, 0.15, 0.1]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      </group>

      {/* Handle */}
      <mesh position={[0.4, 0.8, 0]}>
        <boxGeometry args={[0.05, 0.05, 0.3]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>

      {hovered && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.9, 32]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
