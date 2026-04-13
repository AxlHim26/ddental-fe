import React, { useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * DentalPrinter — A desktop 3D printer for dental applications (crowns, models)
 * sits on a minimal cabinet base.
 */
export default function DentalPrinter({ onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
    >
      {/* Cabinet Base */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[1.2, 0.9, 0.8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[1.3, 0.05, 0.9]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      {/* Printer Machine */}
      <group position={[0, 0.95, 0]}>
        {/* Base of printer */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.6, 0.2, 0.5]} />
          <meshStandardMaterial color="#334155" />
        </mesh>

        {/* Transparent Orange Cover */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[0.55, 0.5, 0.45]} />
          <meshPhysicalMaterial 
            color="#fb923c" 
            transmission={0.8} 
            opacity={1} 
            thickness={0.02} 
            roughness={0.1} 
          />
        </mesh>

        {/* Resin tank & build plate inside */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.4, 0.05, 0.3]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.3, 0.02, 0.2]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        {/* Z Axis rod */}
        <mesh position={[0, 0.45, -0.15]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>

        {/* Touchscreen interface */}
        <mesh position={[0, 0.1, 0.26]} rotation={[-0.2, 0, 0]}>
          <planeGeometry args={[0.15, 0.1]} />
          <meshStandardMaterial color="#ffffff" emissive="#3b82f6" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {hovered && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1.0, 32]} />
          <meshBasicMaterial color="#fb923c" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
