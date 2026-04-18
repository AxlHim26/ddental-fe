import React from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export default function LogoSign({ position, rotation, scale = 1 }) {
  // Load the logo texture from the public folder
  const texture = useLoader(THREE.TextureLoader, '/images/logo.png');

  // The HD Dental logo is horizontal, let's use a 16:9 or 2.5:1 ratio roughly.
  // We'll use 2.5 width and 1 height.
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[2.5, 1]} />
      <meshBasicMaterial 
        map={texture} 
        transparent={true} 
        side={THREE.DoubleSide} 
      />
    </mesh>
  );
}
