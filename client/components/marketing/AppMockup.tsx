"use client";

import { motion } from "framer-motion";

interface AppMockupProps {
  children: React.ReactNode;
  title?: string;
}

export default function AppMockup({ children, title }: AppMockupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative"
    >
      {/* Phone frame */}
      <div className="relative w-[280px] mx-auto">
        {/* Phone body */}
        <div className="bg-[#FFFFFF] rounded-[40px] p-2 border border-[#DCE4E7] shadow-[0_0_60px-rgba(20, 90, 115,0.15)]">
          {/* Screen */}
          <div className="bg-[#0B3344] rounded-[32px] overflow-hidden">
            {/* Notch */}
            <div className="h-6 bg-[#FFFFFF] flex justify-center items-center">
              <div className="w-20 h-4 bg-black rounded-full" />
            </div>
            {/* Content */}
            <div className="p-4">
              {title && (
                <div className="text-xs text-white/70 mb-2 text-center">{title}</div>
              )}
              {children}
            </div>
          </div>
        </div>
        {/* Phone shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-[40px] pointer-events-none" />
      </div>
    </motion.div>
  );
}
