import React from 'react';

/**
 * Reception — Front desk reception area
 */
export default function Reception() {
  const deskColor = '#ffffff';

  return (
    <group>
      {/* === RECEPTION DESK === */}
      <group position={[0, 0, 0]}>
        {/* Desk front panel */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[3.5, 1.2, 0.15]} />
          <meshStandardMaterial color={deskColor} roughness={0.4} />
        </mesh>

        {/* Desk top surface */}
        <mesh position={[0, 1.2, -0.3]} castShadow>
          <boxGeometry args={[3.6, 0.06, 0.8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.1} />
        </mesh>

        {/* Desk side left */}
        <mesh position={[-1.75, 0.6, -0.3]} castShadow>
          <boxGeometry args={[0.1, 1.2, 0.8]} />
          <meshStandardMaterial color={deskColor} roughness={0.4} />
        </mesh>

        {/* Desk side right */}
        <mesh position={[1.75, 0.6, -0.3]} castShadow>
          <boxGeometry args={[0.1, 1.2, 0.8]} />
          <meshStandardMaterial color={deskColor} roughness={0.4} />
        </mesh>

        {/* Front accent strip */}
        <mesh position={[0, 0.95, 0.08]}>
          <boxGeometry args={[3.4, 0.04, 0.01]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.8} />
        </mesh>

        {/* Computer monitor on desk */}
        <mesh position={[-0.8, 1.6, -0.4]} castShadow>
          <boxGeometry args={[0.7, 0.45, 0.04]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </mesh>
        <mesh position={[-0.8, 1.6, -0.375]}>
          <planeGeometry args={[0.6, 0.35]} />
          <meshStandardMaterial color="#0f172a" emissive="#1e3a5f" emissiveIntensity={0.5} />
        </mesh>
        {/* Monitor stand */}
        <mesh position={[-0.8, 1.3, -0.4]}>
          <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}
