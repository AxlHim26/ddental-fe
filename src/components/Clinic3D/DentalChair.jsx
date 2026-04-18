import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Clone } from '@react-three/drei';
import * as THREE from 'three';

/**
 * DentalChair — Central dental chair built from a GLB/GLTF model.
 * Replaces the primitive geometry model with a real 3D asset.
 */
export default function DentalChair({ onClick, modelPath, scale = 1, rotation = [0, 0, 0], position = [0, 0, 0] }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Default to a fallback model if none provided
  const path = modelPath || '/Models/dental_chair.glb';
  const { scene } = useGLTF(path);

  // Tự động chuẩn hóa kích thước (Normalize scale)
  const computedScale = useMemo(() => {
    try {
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim === 0) return scale;
      // Thông thường ghế nha dài khoảng 1.8m
      const targetSize = 1.8;
      return (targetSize / maxDim) * scale;
    } catch(e) {
      return scale;
    }
  }, [scene, scale]);

  // Gentle floating when hovered
  useFrame((state) => {
    if (groupRef.current && hovered) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.02;
    } else if (groupRef.current) {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.05);
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
    >
      {/* 3D Model Rendered Here */}
      <Clone 
        object={scene} 
        scale={computedScale} 
        rotation={rotation} 
        position={position}
        castShadow 
        receiveShadow 
      />

      {/* Glow halo when hovered */}
      {hovered && (
        <mesh position={[0, 0.1, 0]}>
          <ringGeometry args={[1.5, 1.8, 32]} />
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

// Preload common models so they load faster
useGLTF.preload('/Models/dental_chair.glb');
useGLTF.preload('/Models/ghe nha khoa.glb');
useGLTF.preload('/Models/ghe nha khoa 3.glb');
