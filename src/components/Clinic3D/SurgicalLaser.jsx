import React, { useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * SurgicalLaser — A high-tech surgical laser machine.
 */
export default function SurgicalLaser({ onClick }) {
  const [hovered, setHovered] = useState(false);

  const bodyColor = '#f8fafc';
  const accentColor = '#38bdf8';

  return (
    <group
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
    >
      {/* Base */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.45, 0.3, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Main column */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, 1.2, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Glowing accents */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.21, 0.21, 0.05, 16]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={hovered ? 2 : 0.5} />
      </mesh>

      {/* Control Panel / Screen */}
      <mesh position={[0, 1.5, 0.15]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.6, 0.4, 0.1]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      <mesh position={[0, 1.5, 0.21]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[0.55, 0.35]} />
        <meshStandardMaterial color="#0f172a" emissive="#1e3a8a" emissiveIntensity={0.8} />
      </mesh>

      {/* Articulated Arm Group */}
      <group position={[0, 1.6, -0.1]}>
        {/* Base joint */}
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        
        {/* First segment */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>

        {/* Second joint */}
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>

        {/* Second segment (Horizontal) */}
        <mesh position={[0, 0.8, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>

        {/* Laser Head */}
        <mesh position={[0, 0.6, 0.8]}>
          <cylinderGeometry args={[0.08, 0.05, 0.4, 16]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
        <mesh position={[0, 0.4, 0.8]}>
          <cylinderGeometry args={[0.02, 0.02, 0.05, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={hovered ? 3 : 0} />
        </mesh>
      </group>

      {/* Hover Selection Ring */}
      {hovered && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.8, 32]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
