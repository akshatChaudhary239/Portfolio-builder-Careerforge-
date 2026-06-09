'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Wireframe, MeshDistortMaterial, RoundedBox, Edges } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  category: string;
}

export default function ProfessionModel({ category }: Props) {
  if (category === 'Designer') return <DesignerModel />;
  if (category === 'Developer') return <DeveloperModel />;
  if (category === 'MBA / Business') return <BusinessModel />;
  if (category === 'Data Analyst') return <DataModel />;
  return <DefaultModel />;
}

function DesignerModel() {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.2;
      mesh.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={mesh}>
        <torusKnotGeometry args={[1.5, 0.5, 256, 64]} />
        <MeshTransmissionMaterial 
          backside
          samples={4}
          thickness={2}
          chromaticAberration={1}
          anisotropy={0.3}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor="#ffffff"
          color="#ffffff"
        />
      </mesh>
    </Float>
  );
}

function DeveloperModel() {
  const mesh = useRef<THREE.Mesh>(null);
  const mesh2 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.1;
      mesh.current.rotation.x -= delta * 0.05;
    }
    if (mesh2.current) {
      mesh2.current.rotation.y -= delta * 0.15;
      mesh2.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <group>
        <mesh ref={mesh}>
          <icosahedronGeometry args={[2, 1]} />
          <meshStandardMaterial color="#222222" wireframe transparent opacity={0.3} />
          <Wireframe fillOpacity={0} strokeOpacity={0.8} stroke={"var(--color-primary)" as any} thickness={0.02} />
        </mesh>
        <mesh ref={mesh2} scale={0.7}>
          <icosahedronGeometry args={[2, 0]} />
          <meshStandardMaterial color="#111111" wireframe />
          <Wireframe fillOpacity={0} strokeOpacity={0.4} stroke={"var(--color-secondary)" as any} thickness={0.04} />
        </mesh>
      </group>
    </Float>
  );
}

function BusinessModel() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.5;
      group.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={group}>
        <RoundedBox args={[1, 3, 1]} position={[-1.5, 0, 0]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
          <Edges scale={1} threshold={15} color="var(--color-primary)" />
        </RoundedBox>
        <RoundedBox args={[1, 4, 1]} position={[0, 0.5, 0]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color="#111111" metalness={0.9} roughness={0.1} />
          <Edges scale={1} threshold={15} color="var(--color-secondary)" />
        </RoundedBox>
        <RoundedBox args={[1, 2, 1]} position={[1.5, -0.5, 0]} radius={0.05} smoothness={4}>
          <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.1} />
          <Edges scale={1} threshold={15} color="var(--color-text)" />
        </RoundedBox>
      </group>
    </Float>
  );
}

function DataModel() {
  const mesh = useRef<THREE.Points>(null);
  const count = 1000;
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.05;
      mesh.current.rotation.z += delta * 0.02;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="var(--color-primary)" transparent opacity={0.6} sizeAttenuation />
      </points>
      <mesh>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color="#000000" wireframe transparent opacity={0.1} />
      </mesh>
    </Float>
  );
}

function DefaultModel() {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.2;
      mesh.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={mesh}>
        <sphereGeometry args={[2, 64, 64]} />
        <MeshDistortMaterial 
          color="var(--color-primary)"
          distort={0.4} 
          speed={2} 
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}
