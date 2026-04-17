import React, { useRef, useState, useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * GLBDentalChair
 *
 * Tự động đo bounding-box của GLB và scale cho chiều cao
 * bằng đúng TARGET_HEIGHT (≈ chiều cao ghế primitive trong scene).
 *
 * Điều chỉnh duy nhất bạn cần:
 *   TARGET_HEIGHT  — chiều cao mong muốn (units, tương đương meter trong scene)
 *   Y_FLOOR        — trục Y của mặt sàn trong scene (-0.5)
 */
const TARGET_HEIGHT = 2.55;  // units — xấp xỉ chiều cao ghế primitive ProDentalStation
const Y_FLOOR       = -0.5;  // trục Y mặt sàn (khớp với ProRoom)

export default function GLBDentalChair({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onClick,
}) {
  const { scene } = useGLTF("/models/dental_chair.glb");

  const [hovered, setHovered] = useState(false);
  const floatRef = useRef();

  /* ── Clone để tránh chia sẻ object giữa các instance ── */
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  /* ── Tự động tính scale + vertical offset ── */
  const { autoScale, autoYOffset } = useMemo(() => {
    // Tạm thời scale=1 để đo kích thước thật của model
    const box   = new THREE.Box3().setFromObject(clonedScene);
    const size  = new THREE.Vector3();
    box.getSize(size);

    const modelHeight = size.y || 1;              // chiều cao gốc ở scale=1
    const s = TARGET_HEIGHT / modelHeight;         // tỉ lệ cần scale

    // Sau khi scale, bottom của model ở đâu?
    // box.min.y * s = vị trí đáy model, ta muốn đặt vào Y_FLOOR
    const bottomAfterScale = box.min.y * s;
    const yOffset = Y_FLOOR - bottomAfterScale;    // dịch cho đáy nằm đúng sàn

    return { autoScale: s, autoYOffset: yOffset };
  }, [clonedScene]);

  /* ── Castà & receive shadow cho toàn bộ mesh ── */
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow    = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  /* ── Hover float ── */
  useFrame(({ clock }) => {
    if (!floatRef.current) return;
    floatRef.current.position.y = hovered
      ? Math.sin(clock.elapsedTime * 1.2) * 0.025
      : THREE.MathUtils.lerp(floatRef.current.position.y, 0, 0.08);
  });

  return (
    <group
      position={[position[0], autoYOffset, position[2]]}
      rotation={rotation}
    >
      {/* Hover glow ring */}
      {hovered && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, Y_FLOOR - autoYOffset + 0.02, 0]}>
          <ringGeometry args={[1.3, 1.52, 48]} />
          <meshBasicMaterial
            color="#5B8DB8"
            transparent
            opacity={0.28}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      <group
        ref={floatRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
      >
        <primitive
          object={clonedScene}
          scale={[autoScale, autoScale, autoScale]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/dental_chair.glb");
