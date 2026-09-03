"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export default function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group relative p-6 rounded-xl bg-white border border-[#DCE4E7] shadow-[0_8px_24px_rgba(7,29,43,0.07)] hover:shadow-[0_12px_32px_rgba(7,29,43,0.12)] hover:border-[#145A73]/40 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#145A73]/5 to-[#CBEA32]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#145A73]/15 to-[#10455B]/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-[#145A73]" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
