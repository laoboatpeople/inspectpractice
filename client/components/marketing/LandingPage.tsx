"use client";

import { useState } from "react";
import en from "../../messages/en.json";
import PracticeQuestionWidget from "@/components/marketing/PracticeQuestionWidget";
import { 
  Sparkles, FileText, BarChart3, Brain, Users, 
  TrendingUp, MessageCircle, Plane, Smartphone, Monitor, 
  Clock, Target, Zap, ChevronRight, Play, Shield,
  Linkedin, Instagram, Check, Briefcase, LogIn, X
} from "lucide-react";
import AppMockup from "@/components/marketing/AppMockup";
import NewsletterSection from "@/components/marketing/NewsletterSection";
import RelatedStudyPlatforms from "@/components/marketing/RelatedStudyPlatforms";
import ScrollReveal from "@/components/ScrollReveal";
import FeatureCard from "@/components/marketing/FeatureCard";
import TestimonialCard from "@/components/marketing/TestimonialCard";
import PricingCard from "@/components/marketing/PricingCard";

export default function MarketingLandingPage() {
  const msgs: Record<string, unknown> = en;
  const tm = (key: string) => {
    const keys = key.split('.');
    let val: any = msgs;
    for (const k of keys) { val = val?.[k]; }
    return val || key;
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-[#F8FAFC] font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0A0E1A]/80 border-b border-white/5">
        {/* Mini top banner — exam selector modal (Europe EASA / USA FAA cross-promo) */}
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo/logo-main.png?v=3" alt="Inspect Practice" className="h-9 w-auto" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-[#94A3B8] hover:text-white transition-colors">{tm("nav.features")}</a>
            <a href="#how-it-works" className="text-sm text-[#94A3B8] hover:text-white transition-colors">{tm("nav.howItWorks")}</a>
            <a href="#pricing" className="text-sm text-[#94A3B8] hover:text-white transition-colors">{tm("nav.pricing")}</a>
            <a href="/blog" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Blog</a>
            <a href="/faq" className="text-sm text-[#94A3B8] hover:text-white transition-colors">FAQ</a>
            <a href="/contact" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Contact</a>
            <a href="#testimonials" className="text-sm text-[#94A3B8] hover:text-white transition-colors">{tm("nav.testimonials")}</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="/auth/login" className="px-4 py-2 bg-[#C8102E] hover:bg-[#2563EB] rounded-lg text-sm font-medium transition-colors">
              {tm("nav.signIn")}
            </a>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Background gradient and glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#C8102E]/10 via-[#0A0E1A] to-[#0A0E1A]" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#C8102E]/20 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-20 w-[400px] h-[400px] bg-[#4C7FBF]/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Hero left content - CSS animated (no JS dependency) */}
            <div 
              className="animate-fade-in-up flex-1 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-sm text-[#94A3B8]">{tm("hero.badge")}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] bg-clip-text text-transparent">
                  {tm("hero.headline1")}
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#4C7FBF] to-[#C8102E] bg-clip-text text-transparent">
                  {tm("hero.headline2")}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-[#94A3B8] mb-8 max-w-xl mx-auto lg:mx-0">
                {tm("hero.subheadline")}
              </p>
              
              {/* Feature bullets */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
                {[
                  { icon: Sparkles, text: tm("hero.bullets.aiExams") },
                  { icon: Monitor, text: tm("hero.bullets.anywhere") },
                  { icon: Smartphone, text: tm("hero.bullets.platforms") },
                  { icon: Shield, text: tm("hero.bullets.transportCanada") },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <item.icon className="w-4 h-4 text-[#C8102E]" />
                    <span className="text-sm text-[#94A3B8]">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="/auth/login"
                  className="group px-8 py-4 bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] rounded-xl font-semibold text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  {tm("hero.downloadApp")}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#how-it-works"
                  className="px-8 py-4 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  {tm("hero.watchDemo")}
                </a>
              </div>
            </div>

            {/* Right - App mockup placeholder */}
            <div
              className="animate-fade-in-right flex-1 flex justify-center lg:justify-end"
            >
              <AppMockup title={tm("appPreview.mockupChapter")}>
                <div className="space-y-3">
                  <div className="text-xs text-[#C8102E] font-medium">{tm("appPreview.questionLabel").replace("{current}", "12").replace("{total}", "50")}</div>
                  <div className="text-sm text-[#F8FAFC] font-medium leading-relaxed">
                    {tm("appPreview.mockupQuestion")}
                  </div>
                  <div className="space-y-2 mt-3">
                    {['a', 'b', 'c', 'd'].map((key, i) => (
                      <div key={i} className={`p-2 rounded-lg text-xs ${i === 0 ? 'bg-[#C8102E]/20 border border-[#C8102E]/50 text-white' : 'bg-white/5 text-[#94A3B8]'}`}>
                        {tm(`appPreview.answers.${key}`)}
                      </div>
                    ))}
                  </div>
                </div>
              </AppMockup>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY MOBILE SECTION */}
      <section id="why-mobile" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C8102E]/5 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] bg-clip-text text-transparent">
                {tm("whyMobile.title")}
              </span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              {tm("whyMobile.subtitle")}
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Monitor, titleKey: "anywhere", descKey: "anywhere" },
              { icon: Clock, titleKey: "fastSessions", descKey: "fastSessions" },
              { icon: Sparkles, titleKey: "aiGeneration", descKey: "aiGeneration" },
              { icon: Target, titleKey: "tracking", descKey: "tracking" },
              { icon: Briefcase, titleKey: "shifts", descKey: "shifts" },
              { icon: Brain, titleKey: "retention", descKey: "retention" },
            ].map((item, i) => (
              <FeatureCard 
                key={i} 
                icon={item.icon} 
                title={tm(`whyMobile.cards.${item.titleKey}.title`)} 
                description={tm(`whyMobile.cards.${item.descKey}.desc`)} 
                index={i} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section id="features" className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] bg-clip-text text-transparent">
                {tm("features.title")}
              </span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              {tm("features.subtitle")}
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FileText, titleKey: "exams.title", descKey: "exams.desc" },
              { icon: BarChart3, titleKey: "analytics.title", descKey: "analytics.desc" },
              { icon: Brain, titleKey: "studySystem.title", descKey: "studySystem.desc" },
              { icon: TrendingUp, titleKey: "difficulty.title", descKey: "difficulty.desc" },
              { icon: MessageCircle, titleKey: "explanations.title", descKey: "explanations.desc" },
              { icon: Zap, titleKey: "curation.title", descKey: "curation.desc" },
            ].map((item, i) => (
              <FeatureCard 
                key={i} 
                icon={item.icon} 
                title={tm(`features.${item.titleKey}`)} 
                description={tm(`features.${item.descKey}`)} 
                index={i} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4C7FBF]/5 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] bg-clip-text text-transparent">
                {tm("howItWorks.title")}
              </span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              {tm("howItWorks.subtitle")}
            </p>
          </ScrollReveal>

          <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-[#C8102E] via-[#4C7FBF] to-[#8B5CF6]" />
            
            {[
              { num: "1", titleKey: "step1", descKey: "step1Desc" },
              { num: "2", titleKey: "step2", descKey: "step2Desc" },
              { num: "3", titleKey: "step3", descKey: "step3Desc" },
            ].map((item, i) => (
              <ScrollReveal key={i} className="relative flex-1 max-w-sm text-center">
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#C8102E] to-[#4C7FBF] flex items-center justify-center text-2xl font-bold text-white shadow-[0_0_40px-rgba(59,130,246,0.3)]">
                    {item.num}
                  </div>
                  <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">{tm(`howItWorks.${item.titleKey}`)}</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">{tm(`howItWorks.${item.descKey}`)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4.5 INTERACTIVE ICC PRACTICE QUESTION */}
      <PracticeQuestionWidget />

      {/* 5. APP PREVIEW SECTION */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C8102E]/10 via-[#0A0E1A] to-[#8B5CF6]/10" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] bg-clip-text text-transparent">
                {tm("appPreview.title")}
              </span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              {tm("appPreview.subtitle")}
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AppMockup title={tm("appPreview.quizTitle")}>
              <div className="space-y-2">
                <div className="text-xs text-[#10B981] font-medium">{tm("appPreview.correct")}</div>
                <div className="text-sm text-[#F8FAFC] font-medium">{tm("appPreview.wingSparExplanation")}</div>
              </div>
            </AppMockup>
            
            <AppMockup title={tm("appPreview.aiTitle")}>
              <div className="space-y-2">
                <div className="text-xs text-[#F59E0B] mb-2">{tm("appPreview.generating")}</div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] rounded-full" />
                </div>
                <div className="text-xs text-[#94A3B8] mt-2">{tm("appPreview.chapterLabel")}</div>
              </div>
            </AppMockup>
            
            <AppMockup title={tm("appPreview.analyticsTitle")}>
              <div className="space-y-2">
                <div className="text-xs text-[#94A3B8] mb-2">{tm("appPreview.yourProgress")}</div>
                <div className="text-2xl font-bold text-[#F8FAFC]">78%</div>
                <div className="text-xs text-[#10B981]">{tm("appPreview.plusTwelve")}</div>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs"><span className="text-[#94A3B8]">{tm("appPreview.accuracy")}</span><span className="text-white">82%</span></div>
                  <div className="flex justify-between text-xs"><span className="text-[#94A3B8]">{tm("appPreview.speed")}</span><span className="text-white">{tm("appPreview.good")}</span></div>
                </div>
              </div>
            </AppMockup>
            
            <AppMockup title={tm("appPreview.reviewTitle")}>
              <div className="space-y-2">
                <div className="text-xs text-[#EF4444] font-medium">{tm("appPreview.needsReview")}</div>
                <div className="text-sm text-[#F8FAFC]">{tm("appPreview.hydraulicExplanation")}</div>
                <div className="text-xs text-[#94A3B8]">{tm("appPreview.tapToReview")}</div>
              </div>
            </AppMockup>
          </div>
        </div>
      </section>

      {/* 6. AI SECTION */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C8102E]/20 via-[#8B5CF6]/20 to-[#0A0E1A]" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#8B5CF6]/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#C8102E]/20 rounded-full blur-[150px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <ScrollReveal className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <Zap className="w-4 h-4 text-[#8B5CF6]" />
                <span className="text-sm text-[#94A3B8]">{tm("ai.title")}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-[#C8102E] to-[#8B5CF6] bg-clip-text text-transparent">
                  {tm("ai.title")}
                </span>
              </h2>
              <p className="text-[#94A3B8] mb-8 text-lg">
                {tm("ai.subtitle")}
              </p>
              
              <div className="space-y-4">
                {[
                  { titleKey: "gpt" },
                  { titleKey: "adaptive" },
                  { titleKey: "explanations" },
                  { titleKey: "personalized" },
                  { titleKey: "curated" },
                ].map((item, i) => (
                  <ScrollReveal key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-[#8B5CF6]" />
                    </div>
                    <div>
                      <h4 className="text-[#F8FAFC] font-medium">{tm(`ai.${item.titleKey}`)}</h4>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal className="flex-1 flex justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C8102E] to-[#8B5CF6] rounded-3xl rotate-6 opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#4C7FBF] to-[#C8102E] rounded-3xl -rotate-3 opacity-30" />
                <div className="relative w-full h-full bg-[#1A2035] rounded-3xl border border-[#2D3A52] flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#C8102E] to-[#8B5CF6] flex items-center justify-center">
                      <Brain className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">{tm("ai.title")}</h3>
                    <p className="text-sm text-[#94A3B8]">{tm("ai.subtitle")}</p>
                    <div className="mt-4 flex justify-center gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-[#C8102E] animate-pulse"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 7. BUILT FOR MODERN BUILDING INSPECTORS */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] bg-clip-text text-transparent">
                {tm("builtFor.title")}
              </span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              {tm("builtFor.subtitle")}
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { titleKey: "student", descKey: "studentDesc", icon: "🎓" },
              { titleKey: "apprentice", descKey: "apprenticeDesc", icon: "🔧" },
              { titleKey: "schools", descKey: "schoolsDesc", icon: "🏫" },
              { titleKey: "tc", descKey: "tcDesc", icon: "✈️" },
            ].map((item, i) => (
              <ScrollReveal
                key={i}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C8102E]/30 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#C8102E] transition-colors">{tm(`builtFor.${item.titleKey}`)}</h3>
                <p className="text-sm text-[#94A3B8]">{tm(`builtFor.${item.descKey}`)}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section id="testimonials" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C8102E]/5 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] bg-clip-text text-transparent">
                {tm("testimonials.title")}
              </span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              {tm("testimonials.subtitle")}
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              name={tm("testimonials.cards.t1.name")}
              role={tm("testimonials.cards.t1.role")}
              school=""
              quote={tm("testimonials.cards.t1.quote")}
              index={0}
              color="#C8102E"
            />
            <TestimonialCard
              name={tm("testimonials.cards.t2.name")}
              role={tm("testimonials.cards.t2.role")}
              school=""
              quote={tm("testimonials.cards.t2.quote")}
              index={1}
              color="#10B981"
            />
            <TestimonialCard
              name={tm("testimonials.cards.t3.name")}
              role={tm("testimonials.cards.t3.role")}
              school=""
              quote={tm("testimonials.cards.t3.quote")}
              index={2}
              color="#8B5CF6"
            />
          </div>
        </div>
      </section>

      {/* 9. PRICING PREVIEW */}
      <section id="pricing" className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] bg-clip-text text-transparent">
                {tm("pricing.title")}
              </span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              {tm("pricing.subtitle")}
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <PricingCard
              name={tm("pricing.free.name")}
              price={tm("pricing.free.price")}
              period={tm("pricing.free.period")}
              description={tm("pricing.free.desc")}
              features={[tm("pricing.free.feature1"), tm("pricing.free.feature2"), tm("pricing.free.feature3"), tm("pricing.free.feature4")]}
              buttonLabel={tm("nav.getStarted")}
              buttonHref="/auth/login"
              index={0}
            />
            <PricingCard
              name={tm("pricing.pro.name")}
              price={tm("pricing.pro.price")}
              period={tm("pricing.pro.period")}
              description={tm("pricing.pro.desc")}
              features={[tm("pricing.pro.feature1"), tm("pricing.pro.feature2"), tm("pricing.pro.feature3"), tm("pricing.pro.feature4")]}
              buttonLabel={tm("nav.getStarted")}
              buttonHref="/auth/login"
              isFeatured={false}
              index={1}
            />
            <PricingCard
              name={tm("pricing.yearly.name")}
              price={tm("pricing.yearly.price")}
              period={tm("pricing.yearly.period")}
              description={tm("pricing.yearly.desc")}
              features={[tm("pricing.yearly.feature1"), tm("pricing.yearly.feature2"), tm("pricing.yearly.feature3"), tm("pricing.yearly.feature4")]}
              buttonLabel={tm("nav.getStarted")}
              buttonHref="/auth/login"
              isFeatured={true}
              index={2}
            />
            <PricingCard
              name={tm("pricing.lifetime.name")}
              price={tm("pricing.lifetime.price")}
              period={tm("pricing.lifetime.period")}
              description={tm("pricing.lifetime.desc")}
              features={[tm("pricing.lifetime.feature1"), tm("pricing.lifetime.feature2"), tm("pricing.lifetime.feature3")]}
              buttonLabel={tm("nav.getStarted")}
              buttonHref="/auth/login"
              isFeatured={false}
              index={3}
            />
          </div>

          {/* Link to full pricing page */}
          <div className="text-center mt-10">
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white transition-colors group"
            >
              View detailed plan comparison
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section id="final-cta" className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C8102E]/20 via-[#4C7FBF]/20 to-[#8B5CF6]/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C8102E]/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] bg-clip-text text-transparent">
                {tm("finalCta.headline")}
              </span>
            </h2>
            <p className="text-lg md:text-xl text-[#94A3B8] mb-10 max-w-2xl mx-auto">
              {tm("finalCta.subheadline")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/login"
                className="group px-8 py-4 bg-white text-[#0A0E1A] rounded-xl font-semibold hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300 flex items-center justify-center gap-3"
              >
                <LogIn className="w-6 h-6" />
                {tm("finalCta.startFree")}
              </a>
              <a
                href="/pricing"
                className="group px-8 py-4 bg-white/10 text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <ChevronRight className="w-6 h-6" />
                View Plans
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <NewsletterSection />

      <RelatedStudyPlatforms />

      {/* 11. FOOTER */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo/logo-main.png?v=3" alt="Inspect Practice" className="h-8 w-auto" />
              </div>
              <p className="text-sm text-[#94A3B8]">
                {tm("footer.tagline")}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#F8FAFC] mb-4">{tm("footer.product")}</h4>
              <ul className="space-y-2">
                {[tm("footer.features"), tm("footer.home"), tm("footer.pricing")].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-[#94A3B8] hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#F8FAFC] mb-4">{tm("footer.company")}</h4>
              <ul className="space-y-2">
                <li><a href="/blog" className="text-sm text-[#94A3B8] hover:text-white transition-colors">{tm("footer.blog")}</a></li>
                <li><a href="/faq" className="text-sm text-[#94A3B8] hover:text-white transition-colors">{tm("footer.faq")}</a></li>
                <li><a href="/contact" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#F8FAFC] mb-4">{tm("footer.legal")}</h4>
              <ul className="space-y-2">
                {[{key: "privacy", href: "/privacy"}, {key: "terms", href: "/terms"}].map((item) => (
                  <li key={item.key}>
                    <a href={item.href} className="text-sm text-[#94A3B8] hover:text-white transition-colors">{tm(`footer.${item.key}`)}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-[#94A3B8]">
              {tm("footer.copyright")}
            </div>
            
            <div className="flex items-center gap-4">
              <a href="https://x.com/inspectpractice" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <svg className="w-5 h-5 text-[#94A3B8]" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://linkedin.com/company/inspectpractice" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Linkedin className="w-5 h-5 text-[#94A3B8]" />
              </a>
              <a href="https://instagram.com/inspectpractice" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Instagram className="w-5 h-5 text-[#94A3B8]" />
              </a>
            </div>
            
            <div className="flex items-center gap-2">
              <a
                href="/auth/login"
                className="px-3 py-1.5 bg-blue/10 rounded-lg flex items-center gap-2 hover:bg-blue/20 transition-colors"
              >
                <LogIn className="w-4 h-4 text-blue" />
                <span className="text-xs text-blue font-medium">{tm("finalCta.startFree")}</span>
              </a>
              <a
                href="#pricing"
                className="px-3 py-1.5 bg-white/5 rounded-lg flex items-center gap-2 hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                <span className="text-xs text-[#94A3B8]">{tm("finalCta.viewPricing")}</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Demo Modal */}
    </div>
  );
}
