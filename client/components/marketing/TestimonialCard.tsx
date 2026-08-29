"use client";

import { motion } from "framer-motion";

interface TestimonialCardProps {
  name: string;
  role: string;
  school: string;
  quote: string;
  index: number;
  color: string;
}

export default function TestimonialCard({ name, role, school, quote, index, color }: TestimonialCardProps) {
  const initials = name.split(' ').map(n => n[0]).join('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      viewport={{ once: true }}
      className="relative p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10"
    >
      <div className="absolute top-6 right-6 text-6xl text-blue-500/10 font-serif">&quot;</div>
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: color }}
          >
            {initials}
          </div>
          <div>
            <h4 className="text-text-primary font-semibold">{name}</h4>
            <p className="text-sm text-text-secondary">{role}</p>
            <p className="text-xs text-text-tertiary">{school}</p>
          </div>
        </div>
        <p className="text-text-secondary leading-relaxed italic">&quot;{quote}&quot;</p>
      </div>
    </motion.div>
  );
}
