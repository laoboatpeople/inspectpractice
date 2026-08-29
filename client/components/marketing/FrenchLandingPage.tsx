"use client";

import { useState } from "react";
import {
  Sparkles, FileText, BarChart3, Brain, Users,
  TrendingUp, MessageCircle, Plane, Smartphone, Monitor,
  Clock, Target, Zap, ChevronRight, Play, Shield,
  Check, Briefcase, LogIn, Loader2, X, BookOpen, Award,
  HelpCircle
} from "lucide-react";
import PracticeQuestionWidget from "@/components/marketing/PracticeQuestionWidget";
import ScrollReveal from "@/components/ScrollReveal";
import NewsletterSection from "@/components/marketing/NewsletterSection";

export default function FrenchLandingPage() {
  const [showDemo, setShowDemo] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-[#F8FAFC] font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0A0E1A]/80 border-b border-white/5">
        {/* Mini top banner — sélecteur d'examen (Europe EASA / USA FAA cross-promo) */}
        <button
          type="button"
          onClick={() => setShowCountryModal(true)}
          className="block w-full bg-gradient-to-r from-[#4C7FBF] to-[#4FA3E3] hover:from-[#0891B2] hover:to-[#2563EB] transition-colors"
        >
          <div className="max-w-7xl mx-auto px-6 py-2 text-center">
            <span className="text-xs md:text-sm font-medium text-[#0A0E1A]">
              Vous préparez les examens EASA Europe ou FAA A&amp;P des USA ?{" "}
              <strong>Choisissez votre programme →</strong>
            </span>
          </div>
        </button>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C8102E] to-[#4C7FBF] flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Inspect Practice</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#fonctionnalites" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#comment-ca-marche" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Comment ça marche</a>
            <a href="#tarifs" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Tarifs</a>
            <a href="/fr/faq" className="text-sm text-[#94A3B8] hover:text-white transition-colors">FAQ</a>
            <a href="/fr/blog" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Blogue</a>
            <a href="/fr/contact" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="/auth/login" className="px-4 py-2 bg-[#C8102E] hover:bg-[#2563EB] rounded-lg text-sm font-medium transition-colors">
              Commencer
            </a>
            <a
              href="/"
              className="px-3 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-sm font-medium transition-colors"
            >
              EN
            </a>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C8102E]/10 via-[#0A0E1A] to-[#0A0E1A]" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#C8102E]/20 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-20 w-[400px] h-[400px] bg-[#4C7FBF]/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="animate-fade-in-up flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-sm text-[#94A3B8]">Certifications ICC B1 · B2 · E1 · P1 · M1</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] bg-clip-text text-transparent">
                  Réussissez votre examen ICC
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#4C7FBF] to-[#C8102E] bg-clip-text text-transparent">
                  d&rsquo;inspecteur en bâtiment avec l&rsquo;IA adaptative
                </span>
              </h1>
              <p className="text-lg md:text-xl text-[#94A3B8] mb-8 max-w-xl mx-auto lg:mx-0">
                Plateforme de préparation aux examens d&rsquo;inspecteur en bâtiment ICC. Couvre les certifications B1 (résidentiel, CRI), B2 (commercial, IBC), E1 (électricité, NEC), P1 (plomberie, IPC) et M1 (mécanique, IMC). Apprentissage adaptatif par IA, plus de 2 500 questions d&rsquo;entraînement dans 44 chapitres — disponibles sur mobile et ordinateur.
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
                {[
                  { icon: Sparkles, text: "Questions ICC générées par IA" },
                  { icon: Monitor, text: "Étudiez partout" },
                  { icon: Smartphone, text: "Mobile et ordinateur" },
                  { icon: Shield, text: "Aligné sur les codes IRC/IBC/NEC/IPC/IMC" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <item.icon className="w-4 h-4 text-[#C8102E]" />
                    <span className="text-sm text-[#94A3B8]">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="/auth/login"
                  className="group px-8 py-4 bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] rounded-xl font-semibold text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Commencer gratuitement
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <button 
                  onClick={() => setShowDemo(true)}
                  className="px-8 py-4 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Voir la démo
                </button>
              </div>
            </div>

            <div className="animate-fade-in-right flex-1 flex justify-center lg:justify-end">
              <div className="relative w-72 md:w-80">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C8102E] to-[#4C7FBF] rounded-3xl rotate-6 opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#4C7FBF] to-[#C8102E] rounded-3xl -rotate-3 opacity-30" />
                <div className="relative w-full bg-[#1A2035] rounded-3xl border border-[#2D3A52] p-6 backdrop-blur-sm">
                  <div className="text-xs text-[#C8102E] font-medium mb-3">Question 12 / 50 · CRI — Fondations</div>
                  <div className="text-sm text-[#F8FAFC] font-medium leading-relaxed mb-4">
                    Quelle est la profondeur minimale des semelles dans une région où la ligne de gel locale est de 42 pouces?
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-[#C8102E]/20 border border-[#C8102E]/50 text-xs text-white">42 pouces, sous la ligne de gel locale</div>
                    <div className="p-3 rounded-lg bg-white/5 text-xs text-[#94A3B8]">24 pouces dans tous les cas</div>
                    <div className="p-3 rounded-lg bg-white/5 text-xs text-[#94A3B8]">36 pouces quel que soit le gel</div>
                    <div className="p-3 rounded-lg bg-white/5 text-xs text-[#94A3B8]">À la discrétion de l&apos;inspecteur</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT IS TEA SECTION */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C8102E]/5 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <ScrollReveal
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Award className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-sm text-[#94A3B8]">Qu&rsquo;est-ce que l&apos;ICC?</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] bg-clip-text text-transparent">
                Devenir inspecteur en bâtiment certifié ICC aux États-Unis
              </span>
            </h2>
            <p className="text-[#94A3B8] max-w-3xl mx-auto text-lg">
              L&rsquo;International Code Council (ICC) délivre les certifications de référence pour les inspecteurs en bâtiment aux États-Unis. Un inspecteur certifié est habilité à effectuer la revue de plans et les inspections de chantier, en vérifiant la conformité aux codes internationaux (CRI/IRC, IBC, NEC, IPC, IMC). Pour obtenir votre certification, vous devez réussir un examen à livre ouvert chronométré, avec une note de passage de 75 %.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. LICENCES M/E/S EXPLAINED */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <BookOpen className="w-4 h-4 text-[#C8102E]" />
              <span className="text-sm text-[#94A3B8]">Les cinq certifications ICC</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] bg-clip-text text-transparent">
                B1, B2, E1, P1 ou M1 — Quelle est la vôtre?
              </span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              L&rsquo;ICC offre cinq certifications d&rsquo;inspection. Chacune mène à des carrières spécialisées dans le bâtiment.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "B1 — Inspecteur résidentiel",
                desc: "La certification d'entrée la plus courante. Couvre l'inspection des habitations unifamiliales et bifamiliales et des maisons de ville de trois étages au plus, selon le Code résidentiel international (CRI/IRC) : planification, fondations, murs, toitures, issues. Plus de 1 200 questions couvrant 24 chapitres.",
                icon: "🔧",
                gradient: "from-[#C8102E] to-[#4C7FBF]"
              },
              {
                title: "E1 — Inspecteur en électricité",
                desc: "Spécialisation en électricité résidentielle. Couvre le Code national de l'électricité (NEC) et les chapitres électriques du CRI : services, dérivations, méthodes de câblage, mise à la terre et liaison équipotentielle, protection contre les surintensités. Parfaite pour les inspecteurs en systèmes électriques. Plus de 600 questions.",
                icon: "⚡",
                gradient: "from-[#8B5CF6] to-[#C8102E]"
              },
              {
                title: "P1 & M1 — Plomberie & mécanique",
                desc: "Spécialisations en plomberie (IPC) et en mécanique (IMC) résidentielles. Couvrent les appareils sanitaires, l'alimentation en eau, le drainage et l'éventage, les conduits, l'air de combustion et les systèmes au gaz combustible. Essentielles pour l'inspection des systèmes de bâtiment. Plus de 300 questions.",
                icon: "🏗️",
                gradient: "from-[#F59E0B] to-[#EF4444]"
              },
            ].map((item, i) => (
              <ScrollReveal
                key={i}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C8102E]/30 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-[#F8FAFC] mb-3 group-hover:text-[#C8102E] transition-colors">{item.title}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{item.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY MOBILE SECTION */}
      <section id="fonctionnalites" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C8102E]/5 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <ScrollReveal
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] bg-clip-text text-transparent">
                Entraînez-vous partout
              </span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              Commencez sur ordinateur, continuez où que vous soyez — votre progression se synchronise automatiquement.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Monitor, title: "Pratiquez partout", desc: "Transformez votre temps de trajet, vos pauses déjeuner ou tout moment libre en sessions d'étude productives." },
              { icon: Clock, title: "Sessions rapides", desc: "Micro-apprentissage conçu pour les horaires chargés. Terminez une session en aussi peu que 10 minutes." },
              { icon: Sparkles, title: "Tuteur IA — Votre instructeur personnel", desc: "Bloqué sur une question? Obtenez des explications simplifiées et instantanées de notre Tuteur IA." },
              { icon: Target, title: "Suivi de progression", desc: "Identifiez vos lacunes et surveillez votre amélioration avec des analyses détaillées." },
              { icon: Briefcase, title: "Étudiez entre les quarts", desc: "Étudiez selon votre propre horaire. Des sessions courtes et ciblées s'adaptent à toute routine." },
              { icon: Brain, title: "Meilleure rétention", desc: "La répétition espacée et l'apprentissage adaptatif vous aident à retenir plus, plus longtemps." },
            ].map((item, i) => (
              <ScrollReveal
                key={i}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C8102E]/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C8102E]/20 to-[#4C7FBF]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-[#C8102E]" />
                </div>
                <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#C8102E] transition-colors">{item.title}</h3>
                <p className="text-sm text-[#94A3B8]">{item.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURES SECTION */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] bg-clip-text text-transparent">
                Tout ce qu&rsquo;il faut pour réussir
              </span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              Des outils puissants conçus pour les inspecteurs sérieux.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FileText, title: "Examens réalistes", desc: "Simulez de vrais examens ICC à livre ouvert pour B1, B2, E1, P1 et M1 — avec des tests chronométrés par chapitre." },
              { icon: BarChart3, title: "Analyses de performance", desc: "Tableaux de bord visuels pour suivre la progression et identifier les faiblesses." },
              { icon: Brain, title: "Système d'étude intelligent", desc: "Parcours adaptatifs qui s'ajustent à votre performance et se concentrent sur vos besoins." },
              { icon: TrendingUp, title: "Difficulté adaptative", desc: "Les questions s'adaptent à votre niveau — facile quand vous apprenez, plus dur quand vous progressez." },
              { icon: MessageCircle, title: "Explications instantanées", desc: "Chaque réponse inclut une explication détaillée pour comprendre le 'pourquoi' de chaque question." },
            ].map((item, i) => (
              <ScrollReveal
                key={i}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C8102E]/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C8102E]/20 to-[#4C7FBF]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-[#C8102E]" />
                </div>
                <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#C8102E] transition-colors">{item.title}</h3>
                <p className="text-sm text-[#94A3B8]">{item.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section id="comment-ca-marche" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4C7FBF]/5 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <ScrollReveal
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] bg-clip-text text-transparent">
                Comment ça marche
              </span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              Commencez à pratiquer en moins d&rsquo;une minute.
            </p>
          </ScrollReveal>

          <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4">
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-[#C8102E] via-[#4C7FBF] to-[#8B5CF6]" />
            
            {[
              { num: "1", title: "Sélectionnez votre chapitre du code" },
              { num: "2", title: "Générez des examens par IA" },
              { num: "3", title: "Pratiquez et progressez quotidiennement" },
            ].map((item, i) => (
              <ScrollReveal
                key={i}
                className="relative flex-1 max-w-sm text-center"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#C8102E] to-[#4C7FBF] flex items-center justify-center text-2xl font-bold text-white shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                    {item.num}
                  </div>
                  <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">{item.title}</h3>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <PracticeQuestionWidget />

      {/* 7. AI SECTION */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C8102E]/20 via-[#8B5CF6]/20 to-[#0A0E1A]" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#8B5CF6]/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#C8102E]/20 rounded-full blur-[150px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <ScrollReveal
              className="flex-1"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <Zap className="w-4 h-4 text-[#8B5CF6]" />
                <span className="text-sm text-[#94A3B8]">Propulsé par IA</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-[#C8102E] to-[#8B5CF6] bg-clip-text text-transparent">
                  Apprentissage intelligent propulsé par IA
                </span>
              </h2>
              <p className="text-[#94A3B8] mb-8 text-lg">
                Inspect Practice utilise l&rsquo;intelligence artificielle pour créer une expérience d&rsquo;étude personnalisée qui s&rsquo;adapte à vos forces et faiblesses.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: "Tuteur IA — Explique n'importe quelle exigence du code" },
                  { title: "Questions adaptatives selon votre niveau" },
                  { title: "Explications détaillées avec références aux sections des codes" },
                  { title: "Parcours d'étude personnalisé" },
                ].map((item, i) => (
                  <ScrollReveal
                    key={i}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-[#8B5CF6]" />
                    </div>
                    <div>
                      <h4 className="text-[#F8FAFC] font-medium">{item.title}</h4>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal
              className="flex-1 flex justify-center"
            >
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C8102E] to-[#8B5CF6] rounded-3xl rotate-6 opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#4C7FBF] to-[#C8102E] rounded-3xl -rotate-3 opacity-30" />
                <div className="relative w-full h-full bg-[#1A2035] rounded-3xl border border-[#2D3A52] flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#C8102E] to-[#8B5CF6] flex items-center justify-center">
                      <Brain className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">Tuteur IA</h3>
                    <p className="text-sm text-[#94A3B8]">Votre instructeur personnel pour les codes</p>
                    <div className="mt-4 flex justify-center gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-[#C8102E] animate-pulse"
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

      {/* 8. BUILT FOR MODERN BUILDING INSPECTORS */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] bg-clip-text text-transparent">
                Conçu pour les inspecteurs en bâtiment
              </span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              Que vous soyez en formation, nouvel inspecteur ou municipalité, Inspect Practice s&rsquo;adapte à vos besoins.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Nouveaux inspecteurs", desc: "Préparez-vous aux examens ICC B1, B2, E1, P1 et M1 avec des questions adaptatives et un Tuteur IA.", icon: "🎓" },
              { title: "Inspecteurs immobiliers", desc: "Ajoutez des certifications ICC à votre profil pour les travaux locatifs et la conformité.", icon: "🔧" },
              { title: "Programmes de formation", desc: "Un outil pédagogique complémentaire pour les programmes d&apos;inspection et de construction.", icon: "🏫" },
              { title: "Préparation ICC", desc: "Préparez les cinq certifications en un seul endroit, avec des questions alignées sur les codes.", icon: "🏗️" },
            ].map((item, i) => (
              <ScrollReveal
                key={i}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C8102E]/30 transition-all duration-300 group"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-[#C8102E] transition-colors">{item.title}</h3>
                <p className="text-sm text-[#94A3B8]">{item.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 9. PRICING PREVIEW */}
      <section id="tarifs" className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] bg-clip-text text-transparent">
                Des forfaits pour tous les budgets
              </span>
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto">
              Commencez gratuitement et passez à un forfait supérieur quand vous êtes prêt.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <ScrollReveal
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C8102E]/30 transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">GRATUIT</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-[#F8FAFC]">0 $</span>
                <span className="text-sm text-[#94A3B8]">/ à vie</span>
              </div>
              <p className="text-sm text-[#94A3B8] mb-6">Accès limité à une catégorie d&rsquo;examen</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-[#94A3B8]"><Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" /> Questions d&rsquo;une catégorie</li>
                <li className="flex items-start gap-2 text-sm text-[#94A3B8]"><Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" /> Difficulté adaptative</li>
                <li className="flex items-start gap-2 text-sm text-[#94A3B8]"><Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" /> Analyses de base</li>
                <li className="flex items-start gap-2 text-sm text-[#94A3B8]"><Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" /> 50 messages avec le tuteur IA</li>
              </ul>
              <a href="/auth/login" className="block w-full text-center px-4 py-3 bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] text-white rounded-xl font-medium hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300">Commencer</a>
            </ScrollReveal>

            {/* Monthly Plan */}
            <ScrollReveal
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C8102E]/30 transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">MENSUEL</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-[#F8FAFC]">29,99 $</span>
                <span className="text-sm text-[#94A3B8]">/ mois</span>
              </div>
              <p className="text-sm text-[#94A3B8] mb-6">Accès complet à tous les examens et fonctionnalités</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-[#94A3B8]"><Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" /> Toutes les catégories d&rsquo;examen</li>
                <li className="flex items-start gap-2 text-sm text-[#94A3B8]"><Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" /> Suivi de progression</li>
                <li className="flex items-start gap-2 text-sm text-[#94A3B8]"><Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" /> Tuteur IA illimité</li>
                <li className="flex items-start gap-2 text-sm text-[#94A3B8]"><Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" /> Examens illimités</li>
                <li className="flex items-start gap-2 text-sm text-[#94A3B8]"><Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" /> Explications détaillées</li>
              </ul>
              <a href="/auth/login" className="block w-full text-center px-4 py-3 bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] text-white rounded-xl font-medium hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300">Commencer</a>
            </ScrollReveal>

            {/* Lifetime Plan */}
            <ScrollReveal
              className="p-6 rounded-2xl bg-gradient-to-b from-blue-500/10 to-purple-500/10 border-2 border-blue-500/50 shadow-[0_0_60px_rgba(59,130,246,0.25)] relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1 rounded-full border border-white/20 bg-white/[0.04] text-[11px] font-semibold text-white/70 tracking-wider uppercase backdrop-blur-sm">🏆 Meilleur rapport qualité-prix</div>
              <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">À VIE</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-[#F8FAFC]">199 $</span>
                <span className="text-sm text-[#94A3B8]">/ unique</span>
              </div>
              <p className="text-sm text-[#94A3B8] mb-6">Accès permanent à tout le contenu actuel et futur</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-[#94A3B8]"><Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" /> Tout du forfait MENSUEL</li>
                <li className="flex items-start gap-2 text-sm text-[#94A3B8]"><Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" /> Mises à jour à vie</li>
                <li className="flex items-start gap-2 text-sm text-[#94A3B8]"><Check className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" /> Nouveau contenu inclus</li>
              </ul>
              <a href="/auth/login" className="block w-full text-center px-4 py-3 bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] text-white rounded-xl font-medium hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300">Commencer</a>
            </ScrollReveal>
          </div>

          {/* Lien vers la page tarifs dédiée */}
          <div className="text-center mt-10">
            <a
              href="/fr/pricing"
              className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white transition-colors group"
            >
              Voir la comparaison détaillée des forfaits
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C8102E]/20 via-[#4C7FBF]/20 to-[#8B5CF6]/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C8102E]/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <ScrollReveal
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#C8102E] to-[#4C7FBF] bg-clip-text text-transparent">
                Prêt à réussir votre examen ICC?
              </span>
            </h2>
            <p className="text-lg md:text-xl text-[#94A3B8] mb-10 max-w-2xl mx-auto">
              Rejoignez des milliers d&rsquo;inspecteurs qui utilisent Inspect Practice pour préparer leurs examens de certification ICC.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/login"
                className="group px-8 py-4 bg-white text-[#0A0E1A] rounded-xl font-semibold hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300 flex items-center justify-center gap-3"
              >
                <LogIn className="w-6 h-6" />
                Commencer gratuitement
              </a>
              <a
                href="/fr/pricing"
                className="group px-8 py-4 bg-white/10 text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <ChevronRight className="w-6 h-6" />
                Voir les forfaits
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* 11. FOOTER */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C8102E] to-[#4C7FBF] flex items-center justify-center">
                  <Plane className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl">Inspect Practice</span>
              </div>
              <p className="text-sm text-[#94A3B8]">
                Préparez-vous aux examens ICC d&rsquo;inspecteur en bâtiment avec l&rsquo;apprentissage adaptatif par IA.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#F8FAFC] mb-4">Produit</h4>
              <ul className="space-y-2">
                <li><a href="#fonctionnalites" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="/fr" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Accueil</a></li>
                <li><a href="#tarifs" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Tarifs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#F8FAFC] mb-4">Entreprise</h4>
              <ul className="space-y-2">
                <li><a href="/fr/blog" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Blogue</a></li>
                <li><a href="/fr/faq" className="text-sm text-[#94A3B8] hover:text-white transition-colors">FAQ</a></li>
                <li><a href="/fr/contact" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#F8FAFC] mb-4">Légal</h4>
              <ul className="space-y-2">
                <li><a href="/fr/privacy" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Confidentialité</a></li>
                <li><a href="/fr/terms" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Conditions d&rsquo;utilisation</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-[#94A3B8]">
              &copy; {new Date().getFullYear()} Inspect Practice. Tous droits réservés.
            </div>
            
            <div className="flex items-center gap-4">
              <a href="https://x.com/inspectpractice" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <svg className="w-5 h-5 text-[#94A3B8]" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://linkedin.com/company/inspectpractice" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <svg className="w-5 h-5 text-[#94A3B8]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://instagram.com/inspectpractice" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <svg className="w-5 h-5 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth="1.5" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </a>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/auth/login"
                className="px-3 py-1.5 bg-blue/10 rounded-lg flex items-center gap-2 hover:bg-blue/20 transition-colors"
              >
                <LogIn className="w-4 h-4 text-blue" />
                <span className="text-xs text-blue font-medium">Commencer gratuitement</span>
              </a>
              <a
                href="#tarifs"
                className="px-3 py-1.5 bg-white/5 rounded-lg flex items-center gap-2 hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
                <span className="text-xs text-[#94A3B8]">Voir les tarifs</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Demo Modal */}
      {showDemo && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowDemo(false)}
        >
          <div 
            className="relative w-full max-w-[400px] mx-4 bg-[#0A0E1A] rounded-2xl overflow-hidden border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDemo(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <video
              className="w-full aspect-[9/16]"
              controls
              autoPlay
              playsInline
              src="/videos/sky-licence-demo-fr-mature.mp4"
            >
              Votre navigateur ne supporte pas la balise vidéo.
            </video>
            <div className="px-4 pb-3 pt-2 text-center">
              <span className="text-xs text-[#94A3B8]">
                Démo française avec illustrations et narration
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal sélecteur de programme (pays) */}
      {showCountryModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowCountryModal(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#0A0E1A] rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowCountryModal(false)}
              className="absolute top-4 right-4 text-[#94A3B8] hover:text-white transition-colors"
              aria-label="Fermer le sélecteur d'examen"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              Pour quel examen vous préparez-vous ?
            </h2>
            <p className="text-sm text-[#94A3B8] mb-6">
              Inspect Practice exploite des plateformes de préparation dédiées pour chaque certification.
              Sélectionnez votre examen pour accéder au bon programme.
            </p>

            <div className="grid gap-3">
              {/* Europe EASA */}
              <a
                href="https://skylicence.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 hover:border-[#FFCC00]/60 hover:bg-white/10 transition-colors"
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-[#FFCC00]/15 flex items-center justify-center">
                  <Plane size={20} className="text-[#FFCC00]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-white">
                      Examen EASA Part-66 Europe
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#FFCC00]/20 text-[#FFCC00]">
                      Europe
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Préparation complète aux examens de module EASA Part-66 — catégories A, B1, B2
                    et B3, avec plus de 4 500 questions de pratique et un tuteur IA.
                  </p>
                </div>
                <ChevronRight size={18} className="text-[#94A3B8] group-hover:text-[#FFCC00] flex-shrink-0 transition-colors" />
              </a>

              {/* USA FAA A&P */}
              <a
                href="https://skylicense.cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 hover:border-[#4C7FBF]/60 hover:bg-white/10 transition-colors"
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-[#4C7FBF]/15 flex items-center justify-center">
                  <Plane size={20} className="text-[#4C7FBF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-white">
                      Examen FAA A&amp;P des USA
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#4C7FBF]/20 text-[#4C7FBF]">
                      USA
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Préparation complète aux examens écrits FAA Airframe &amp; Powerplant —
                    General, Airframe et Powerplant, avec plus de 1 600 questions de pratique et
                    un tuteur IA.
                  </p>
                </div>
                <ChevronRight size={18} className="text-[#94A3B8] group-hover:text-[#4C7FBF] flex-shrink-0 transition-colors" />
              </a>
            </div>

            <p className="text-xs text-[#64748B] mt-5 text-center">
              Vous ne savez pas lequel s&apos;applique à vous ?{" "}
              <a href="/fr/contact" className="text-[#4FA3E3] hover:underline">
                Contactez-nous
              </a>{" "}
              et nous vous orienterons vers le bon programme.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
