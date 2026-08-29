"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isFeatured?: boolean;
  badgeText?: string;
  buttonLabel?: string;
  buttonHref?: string;
  index: number;
}

export default function PricingCard({ name, price, period, description, features, isFeatured, badgeText = "Best Value", buttonLabel = "Get Started", buttonHref, index }: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`relative rounded-2xl p-6 ${
        isFeatured
          ? 'bg-gradient-to-b from-blue-500/10 to-purple-500/10 border-2 border-blue-500/50 shadow-[0_0_60px-rgba(59,130,246,0.25)]'
          : 'backdrop-blur-md bg-white/5 border border-white/10'
      }`}
    >
      {isFeatured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <div className="px-4 py-1 rounded-full text-[11px] font-semibold text-white/70 border border-white/20 bg-white/[0.04] backdrop-blur-sm tracking-wider uppercase whitespace-nowrap">
            {badgeText}
          </div>
        </div>
      )}
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-text-primary mb-2">{name}</h3>
        <p className="text-sm text-text-secondary mb-4">{description}</p>
        <div className="mb-6">
          <span className="text-4xl font-bold text-text-primary">{price}</span>
          <span className="text-text-secondary ml-1">{period}</span>
        </div>
        <ul className="space-y-3 mb-6">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-text-secondary">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-green-400" />
              </div>
              {feature}
            </li>
          ))}
        </ul>
        {buttonHref ? (
          <Link
            href={buttonHref}
            className="block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] text-white hover:opacity-90 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          >
            {buttonLabel}
          </Link>
        ) : (
          <button
            className="w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] text-white hover:opacity-90 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </motion.div>
  );
}
