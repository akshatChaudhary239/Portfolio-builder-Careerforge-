'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CareerProfile } from '@/db/local-db';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import ProfessionModel from '../models/ProfessionModel';

export default function CinematicHero({ profile }: { profile: CareerProfile }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <section ref={container} className="relative h-[120vh] w-full overflow-hidden bg-[#050505] text-[#f5f5f5]">
      <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap');`}} />

      {/* 3D Canvas Layer */}
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0 h-screen pointer-events-none">
        <Canvas gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} color="var(--color-primary)" />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} color="var(--color-secondary)" />
          <ProfessionModel category={profile.professionCategory || ''} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </motion.div>

      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,1)_100%)] pointer-events-none h-screen" />
      <div className="absolute inset-0 z-10 bg-black/40 pointer-events-none h-screen" />

      {/* Content Layer */}
      <motion.div style={{ opacity, y: useTransform(scrollYProgress, [0, 1], ["0%", "30%"]), fontFamily: "'Cormorant Garamond', serif" }} className="relative z-20 h-screen flex flex-col items-center justify-center text-center px-6 mix-blend-difference">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <span className="text-sm tracking-[0.8em] uppercase text-[var(--color-primary)] font-medium mb-8 block drop-shadow-lg">
            {profile.professionCategory || 'Visionary'}
          </span>
          <h1 className="text-7xl md:text-[10rem] font-medium tracking-tighter leading-[0.85] uppercase text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] italic">
            {profile.personalInfo.fullName}
          </h1>
          <p className="mt-12 text-xl md:text-3xl text-white/70 font-light max-w-3xl mx-auto drop-shadow-md tracking-wide">
            {(profile as any).title || 'Designing the future of digital experiences through interactive storytelling.'}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
