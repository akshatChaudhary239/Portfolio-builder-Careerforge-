'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';
import { Canvas } from '@react-three/fiber';
import { Environment, OrthographicCamera, OrbitControls } from '@react-three/drei';
import ProfessionModel from '../models/ProfessionModel';

export default function BrutalistHero({ profile }: { profile: CareerProfile }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const marqueeX1 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const marqueeX2 = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);

  const repeatedCategory = (profile.professionCategory || 'Professional ').repeat(10);

  return (
    <section ref={container} className="relative h-screen w-full overflow-hidden bg-[#dfdfdf] text-[#050505] border-b-[10px] border-[#050505]">
      <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&display=swap');`}} />

      {/* Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#050505_2px,transparent_2px),linear-gradient(to_bottom,#050505_2px,transparent_2px)] bg-[size:100px_100px]" />

      {/* 3D Canvas Layer */}
      <motion.div style={{ y }} className="absolute right-0 bottom-0 z-0 h-screen w-full md:w-1/2 pointer-events-none mix-blend-difference opacity-100">
        <Canvas gl={{ antialias: false, alpha: true }}>
          <OrthographicCamera makeDefault position={[5, 5, 5]} zoom={100} />
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 5]} intensity={3} color="white" />
          <directionalLight position={[-10, -10, -5]} intensity={2} color="var(--color-primary)" />
          <Environment preset="warehouse" />
          <group scale={1.5}>
            <ProfessionModel category={profile.professionCategory || ''} />
          </group>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={3} />
        </Canvas>
      </motion.div>

      {/* Massive Background Marquee */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center pointer-events-none overflow-hidden mix-blend-overlay opacity-30" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        <motion.div style={{ x: marqueeX1 }} className="whitespace-nowrap flex text-[15vw] font-black uppercase tracking-tighter leading-[0.8] mb-8">
          {repeatedCategory}
        </motion.div>
        <motion.div style={{ x: marqueeX2 }} className="whitespace-nowrap flex text-[15vw] font-black uppercase tracking-tighter leading-[0.8] text-transparent [-webkit-text-stroke:4px_#050505]">
          {repeatedCategory}
        </motion.div>
      </div>

      {/* Content Layer */}
      <div className="relative z-20 h-full flex flex-col justify-end px-6 lg:px-12 pb-12 lg:pb-24 pointer-events-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        <div className="flex flex-col border-[10px] border-[#050505] bg-[var(--color-primary)] w-fit p-6 lg:p-12 shadow-[16px_16px_0px_0px_rgba(5,5,5,1)]">
          <span className="text-xl md:text-3xl font-black uppercase tracking-widest text-[#050505] mb-2 block border-b-[5px] border-[#050505] pb-2 w-fit">
            {profile.professionCategory || 'Professional'}
          </span>
          <h1 className="text-[12vw] md:text-[8vw] font-black tracking-tighter leading-[0.85] uppercase text-[#050505] break-words">
            {profile.personalInfo.fullName}
          </h1>
        </div>
      </div>
    </section>
  );
}
