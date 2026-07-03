'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera, OrbitControls, ContactShadows } from '@react-three/drei';
import ProfessionModel from '../models/ProfessionModel';

export default function EtherealHero({ profile }: { profile: CareerProfile }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={container} className="relative h-screen w-full overflow-hidden bg-[#fafafa] text-[#222222]">
      <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;300;400;500;700&display=swap');`}} />

      {/* Floating orbs for ethereal background */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[150px] opacity-60 animate-blob pointer-events-none" />
      <div className="absolute top-1/4 right-[-5%] w-[600px] h-[600px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[150px] opacity-50 animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute bottom-[-20%] left-1/3 w-[700px] h-[700px] bg-pink-300 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-blob animation-delay-4000 pointer-events-none" />

      {/* 3D Canvas Layer */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0 h-screen pointer-events-none mix-blend-multiply">
        <Canvas gl={{ antialias: true, alpha: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
          <ambientLight intensity={1.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="white" />
          <directionalLight position={[-10, 10, 5]} intensity={1} color="white" />
          
          <group position={[0, 0.5, 0]}>
            <ProfessionModel category={profile.professionCategory || ''} />
          </group>
          
          <ContactShadows position={[0, -2, 0]} opacity={0.3} scale={15} blur={3} far={4} color="var(--color-secondary)" />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
        </Canvas>
      </motion.div>

      {/* Glassmorphism gradient */}
      <div className="absolute inset-0 z-10 bg-white/10 backdrop-blur-[2px] pointer-events-none" />

      {/* Content Layer */}
      <div className="relative z-20 h-screen flex flex-col items-center justify-center text-center px-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <motion.div
          initial={{ opacity: 0, filter: "blur(20px)", y: 30 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="bg-white/20 backdrop-blur-2xl border border-white/50 p-12 md:p-20 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.05)] w-full max-w-4xl"
        >
          <span className="text-sm tracking-[0.4em] uppercase text-gray-500 font-medium mb-8 block">
            {profile.professionCategory || 'Digital Creator'}
          </span>
          <h1 className="text-6xl md:text-8xl font-light tracking-tight leading-[0.9] text-gray-900 bg-clip-text text-transparent bg-gradient-to-br from-gray-900 via-gray-600 to-gray-400 pb-4">
            {profile.personalInfo.fullName}
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-gray-500 font-light max-w-2xl mx-auto tracking-wide">
            {(profile as any).title || 'Crafting seamless, human-centric experiences in a digital world.'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
