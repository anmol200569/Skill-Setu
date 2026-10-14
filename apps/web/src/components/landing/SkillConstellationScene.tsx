import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

// Constellation of skill nodes connected to a central career goal node
function ConstellationMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  // Generate nodes representing skills connecting to a career goal
  const { nodes, connections } = useMemo(() => {
    // Center node = Career Goal
    const centerNode: [number, number, number] = [0, 0, 0];

    // Surrounding nodes = Verified Skills
    const skillPositions: Array<{ pos: [number, number, number]; size: number; color: string; speed: number }> = [
      { pos: [-2.2, 1.2, -0.5], size: 0.16, color: '#C2410C', speed: 1.1 },
      { pos: [2.1, 1.0, -0.3], size: 0.18, color: '#FB923C', speed: 0.9 },
      { pos: [-1.8, -1.3, 0.4], size: 0.15, color: '#F97316', speed: 1.2 },
      { pos: [1.9, -1.1, 0.5], size: 0.17, color: '#EA580C', speed: 0.8 },
      { pos: [0.0, 2.0, -0.2], size: 0.20, color: '#FDBA74', speed: 1.0 },
      { pos: [0.2, -2.1, -0.4], size: 0.16, color: '#FED7AA', speed: 1.3 },
      { pos: [-2.8, -0.2, -0.8], size: 0.14, color: '#FB923C', speed: 0.95 },
      { pos: [2.7, -0.1, -0.7], size: 0.15, color: '#C2410C', speed: 1.05 },
      { pos: [-1.0, 1.8, 0.8], size: 0.13, color: '#FED7AA', speed: 1.15 },
      { pos: [1.1, 1.7, 0.7], size: 0.14, color: '#F97316', speed: 0.85 },
    ];

    // Bridge lines from each skill node to the center goal, plus cross-connections
    const linePairs: Array<[[number, number, number], [number, number, number]]> = [];
    skillPositions.forEach((skill) => {
      linePairs.push([centerNode, skill.pos]);
    });
    // Add 4 cross bridge lines between adjacent skills
    linePairs.push([skillPositions[0].pos, skillPositions[4].pos]);
    linePairs.push([skillPositions[4].pos, skillPositions[1].pos]);
    linePairs.push([skillPositions[2].pos, skillPositions[5].pos]);
    linePairs.push([skillPositions[5].pos, skillPositions[3].pos]);

    return { nodes: skillPositions, connections: linePairs };
  }, []);

  // Subtle rotation and mouse parallax
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Gentle continuous rotation
    groupRef.current.rotation.y += delta * 0.15;
    groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.08;

    // Smooth mouse parallax
    const targetX = (state.pointer.x * Math.PI) / 10;
    const targetY = (state.pointer.y * Math.PI) / 10;
    groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.03;
    groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.03;
  });

  return (
    <group ref={groupRef}>
      {/* Central Career Goal Node (Golden Terracotta Halo) */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Sphere args={[0.32, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#C2410C"
            emissive="#FB923C"
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.6}
          />
        </Sphere>
      </Float>

      {/* Outer Skill Nodes */}
      {nodes.map((node, i) => (
        <Float key={i} speed={node.speed * 1.5} rotationIntensity={0.3} floatIntensity={0.4}>
          <Sphere args={[node.size, 24, 24]} position={node.pos}>
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.4}
              roughness={0.3}
              metalness={0.5}
            />
          </Sphere>
        </Float>
      ))}

      {/* Constellation Bridge Connecting Lines */}
      {connections.map((pair, idx) => (
        <Line
          key={idx}
          points={pair}
          color="#C2410C"
          opacity={0.35}
          transparent
          lineWidth={1.2}
        />
      ))}
    </group>
  );
}

export function SkillConstellationScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 48 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      className="w-full h-full pointer-events-auto"
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#FED7AA" />
      <pointLight position={[-10, -10, -5]} intensity={0.6} color="#FB923C" />
      <ConstellationMesh />
    </Canvas>
  );
}
export default SkillConstellationScene;
