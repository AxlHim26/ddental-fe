import React, { useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Microscope — A high-end surgical/dental operating microscope on a rolling stand.
 */
export default function Microscope({ onClick }) {
  const [hovered, setHovered] = useState(false);

  const metalColor = '#cbd5e1';
  const headColor = '#f8fafc';

  return (
    <group
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
    >
      {/* Base */}
      {[-0.3, 0.3].map((x) => 
        [-0.3, 0.3].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.05, z]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.1]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        ))
      )}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.7, 0.1, 0.7]} />
        <meshStandardMaterial color={metalColor} />
      </mesh>

      {/* Main post */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1.3]} />
        <meshStandardMaterial color={metalColor} roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Articulating Arm Base */}
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.12]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      {/* First Arm Segment */}
      <mesh position={[0.3, 1.6, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8]} />
        <meshStandardMaterial color={metalColor} roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Second Arm Segment */}
      <mesh position={[0.6, 1.75, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.6]} />
        <meshStandardMaterial color={metalColor} roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Microscope Head */}
      <group position={[0.6, 1.75, 0.6]}>
        {/* Main body */}
        <mesh rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.25, 0.3, 0.2]} />
          <meshStandardMaterial color={headColor} />
        </mesh>
        
        {/* Binocular Okulars */}
        <mesh position={[-0.06, 0.15, 0.1]} rotation={[-0.2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.1]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[0.06, 0.15, 0.1]} rotation={[-0.2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.1]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>

        {/* Objective Lens */}
        <mesh position={[0, -0.2, -0.05]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.08, 0.1]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        {/* Glass lens flare (emissive) */}
        <mesh position={[0, -0.26, -0.05]}>
          <cylinderGeometry args={[0.04, 0.04, 0.01]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={hovered ? 2 : 0} />
        </mesh>
      </group>

      {hovered && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.7, 32]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
