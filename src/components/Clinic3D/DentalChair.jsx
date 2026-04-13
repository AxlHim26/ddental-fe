import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * DentalChair — Central dental chair built from primitive geometries.
 * Includes seat, backrest, headrest, armrests, base pedestal, and footrest.
 */
export default function DentalChair({ onClick }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Gentle floating when hovered
  useFrame((state) => {
    if (groupRef.current && hovered) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.02;
    } else if (groupRef.current) {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.05);
    }
  });

  const chairColor = hovered ? '#f8fafc' : '#ffffff';
  const metalColor = '#9ca3af';
  const cushionColor = hovered ? '#6ee7b7' : '#a7f3d0'; // Mint green

  return (
    <group
      ref={groupRef}

      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
    >
      {/* Base pedestal */}
      <mesh position={[0, -0.3, 0]} castShadow>
        <cylinderGeometry args={[0.8, 1, 0.3, 32]} />
        <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Hydraulic column */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
        <meshStandardMaterial color="#6b7280" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Seat base frame */}
      <mesh position={[0, 0.65, 0.1]} castShadow>
        <boxGeometry args={[1.2, 0.12, 1.8]} />
        <meshStandardMaterial color={metalColor} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Seat cushion */}
      <mesh position={[0, 0.78, 0.1]} castShadow>
        <boxGeometry args={[1.1, 0.15, 1.7]} />
        <meshStandardMaterial color={cushionColor} roughness={0.8} />
      </mesh>

      {/* Backrest frame */}
      <mesh position={[0, 1.5, -0.7]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[1.1, 1.2, 0.12]} />
        <meshStandardMaterial color={metalColor} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Backrest cushion */}
      <mesh position={[0, 1.5, -0.63]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[1.0, 1.1, 0.12]} />
        <meshStandardMaterial color={cushionColor} roughness={0.8} />
      </mesh>

      {/* Headrest */}
      <mesh position={[0, 2.25, -1.1]} rotation={[0.5, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.35, 0.15]} />
        <meshStandardMaterial color={cushionColor} roughness={0.9} />
      </mesh>

      {/* Left armrest */}
      <mesh position={[-0.7, 1.0, -0.1]} castShadow>
        <boxGeometry args={[0.12, 0.08, 1.0]} />
        <meshStandardMaterial color={metalColor} metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Right armrest */}
      <mesh position={[0.7, 1.0, -0.1]} castShadow>
        <boxGeometry args={[0.12, 0.08, 1.0]} />
        <meshStandardMaterial color={metalColor} metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Footrest */}
      <mesh position={[0, 0.5, 1.3]} rotation={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.8, 0.1, 0.6]} />
        <meshStandardMaterial color={cushionColor} roughness={0.8} />
      </mesh>

      {/* Glow halo when hovered */}
      {hovered && (
        <mesh position={[0, 0.6, 0]}>
          <ringGeometry args={[1.2, 1.5, 32]} />
          <meshBasicMaterial
            color="#0ea5e9"
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
