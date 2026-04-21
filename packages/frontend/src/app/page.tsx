"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, X as XIcon, Check } from "lucide-react"

type Lang = "es" | "en"

const copy = {
  es: {
    nav: {
      contact: "Contacto",
      eu: "UE",
      tools: "Herramientas",
      cta: "Solicitar acceso",
    },
    hero: {
      tag: "Infraestructura de gobernanza para la IA pública",
      title: "Estructurando la transparencia para la gobernanza de la IA",
      description:
        "Pasamos del diálogo multilateral a la infraestructura multinodal. GOIA integra auditoría, trazabilidad y participación cívica representada en los sistemas de IA.",
      ctaPrimary: "Solicitar acceso",
      ctaSecondary: "Conocer más",
    },
    problem: {
      title: "El problema",
      intro:
        "Los sistemas de IA operan hoy sin marcos de rendición de cuentas adecuados, afectando decisiones críticas en millones de vidas.",
      items: [
        {
          headline: "Decisiones sin justificación",
          detail:
            "Sistemas de IA toman decisiones críticas que no pueden explicar su propio funcionamiento ni sus criterios de evaluación.",
        },
        {
          headline: "Verificación internacional ausente",
          detail:
            "No existen mecanismos efectivos para verificar el cumplimiento de estándares de IA a nivel transfronterizo.",
        },
        {
          headline: "Participación ciudadana marginal",
          detail:
            "La ciudadanía carece de canales reales para influir en el diseño, despliegue y supervisión de sistemas de IA públicos.",
        },
        {
          headline: "Escalabilidad sin control",
          detail:
            "La velocidad de adopción de la IA supera a los mecanismos de supervisión, creando riesgos sistémicos desatendidos.",
        },
      ],
    },
    proposal: {
      title: "Nuestra propuesta",
      description:
        "GOIA ofrece una plataforma de gobernanza participativa para la IA. Una infraestructura que permite auditar, documentar y supervisar sistemas de inteligencia artificial con participación ciudadana real.",
      pillars: [
        {
          number: "01",
          title: "Datos",
          description:
            "Registro estructurado de todos los sistemas de IA en uso por entidades públicas y privadas de alto impacto.",
        },
        {
          number: "02",
          title: "Trazabilidad",
          description:
            "Seguimiento completo del ciclo de vida de las decisiones algorítmicas, desde el diseño hasta el despliegue.",
        },
        {
          number: "03",
          title: "IA",
          description:
            "Herramientas de evaluación automática de sesgos, cumplimiento normativo y análisis de impacto.",
        },
        {
          number: "04",
          title: "Métricas de confianza",
          description:
            "Indicadores públicos y verificables de transparencia, rendición de cuentas y bienestar algorítmico.",
        },
      ],
    },
    architecture: {
      title: "Arquitectura Modular",
      description:
        "Un marco integral que cubre todos los aspectos del despliegue y la gestión responsable de la IA a través de cuatro componentes específicos.",
      modules: [
        {
          icon: "□",
          title: "Documentación y trazabilidad de sistemas de IA",
          description:
            "Registro completo y estandarizado de todos los sistemas de IA en funcionamiento.",
          items: [
            "Registro de auditoría",
            "Documentación estandarizada",
            "Trazabilidad de decisiones",
            "Seguimiento de versiones",
          ],
        },
        {
          icon: "◎",
          title: "Auditoría participativa",
          description:
            "Mecanismos que permiten la revisión ciudadana y experta de los sistemas de IA.",
          items: [
            "Revisión ciudadana",
            "Auditoría externa",
            "Informe público",
            "Comités de supervisión",
          ],
        },
        {
          icon: "△",
          title: "Mecanismos de verificación (TMG)",
          description:
            "Procesos técnicos para garantizar el cumplimiento de estándares de gobernanza.",
          items: [
            "Pruebas de sesgo",
            "Evaluación de impacto",
            "Verificación técnica",
            "Métricas de rendimiento",
          ],
        },
        {
          icon: "◇",
          title: "Señales de gobernanza y confianza",
          description:
            "Indicadores públicos que miden y comunican el nivel de gobernanza de cada sistema.",
          items: [
            "Puntuaciones de confianza",
            "Indicadores de uso",
            "Métricas de transparencia",
            "Alertas de riesgo",
          ],
        },
      ],
    },
    whyItMatters: {
      title: "Por qué importa",
      description:
        "La IA ya está tomando decisiones críticas en los sistemas de salud, justicia, educación y servicios sociales. La falta de transparencia y supervisión ciudadana crea riesgos sistémicos que afectan desproporcionadamente a los grupos más vulnerables. GOIA nace para garantizar que la tecnología sirva al interés público y no al revés.",
      stat1: "73%",
      stat1Label: "de ciudadanos desconoce el uso de IA en servicios públicos",
      stat2: "12x",
      stat2Label: "más rápida la adopción de IA que su regulación",
    },
    status: {
      title: "En qué estamos",
      description:
        "Estamos desarrollando un MVP durante la fase de diseño, buscando aliados estratégicos y financiadores. Trabajamos con 7 municipios piloto para construir una infraestructura tecnológica para la gobernanza de la IA.",
      ctaPrimary: "Solicitar acceso",
      ctaSecondary: "Ver fases",
    },
    footer: {
      tagline: "Infraestructura de gobernanza para la IA pública",
      links: ["Contacto", "UE", "Herramientas"],
      copy: "© 2024 GOIA. Todos los derechos reservados.",
    },
  },
  en: {
    nav: {
      contact: "Contact",
      eu: "EU",
      tools: "Tools",
      cta: "Request access",
    },
    hero: {
      tag: "Governance infrastructure for public AI",
      title: "Structuring Transparency for AI Governance",
      description:
        "We move from multilateral dialogue to multinodal infrastructure. GOIA integrates audit, traceability, and civic participation represented in AI systems.",
      ctaPrimary: "Request access",
      ctaSecondary: "Learn more",
    },
    problem: {
      title: "The Problem",
      intro:
        "AI systems operate today without adequate accountability frameworks, affecting critical decisions in millions of lives.",
      items: [
        {
          headline: "Decisions without justification",
          detail:
            "AI systems make critical decisions that cannot explain their own functioning or evaluation criteria.",
        },
        {
          headline: "Absent international verification",
          detail:
            "There are no effective mechanisms to verify compliance with AI standards at a cross-border level.",
        },
        {
          headline: "Marginal citizen participation",
          detail:
            "Citizens lack real channels to influence the design, deployment, and oversight of public AI systems.",
        },
        {
          headline: "Scalability without control",
          detail:
            "The speed of AI adoption outpaces oversight mechanisms, creating unaddressed systemic risks.",
        },
      ],
    },
    proposal: {
      title: "Our Proposal",
      description:
        "GOIA offers a participatory governance platform for AI. An infrastructure that allows auditing, documenting, and supervising AI systems with real citizen participation.",
      pillars: [
        {
          number: "01",
          title: "Data",
          description:
            "Structured registry of all AI systems in use by public and high-impact private entities.",
        },
        {
          number: "02",
          title: "Traceability",
          description:
            "Complete tracking of the lifecycle of algorithmic decisions, from design to deployment.",
        },
        {
          number: "03",
          title: "AI",
          description:
            "Automatic bias assessment tools, regulatory compliance, and impact analysis.",
        },
        {
          number: "04",
          title: "Trust Metrics",
          description:
            "Public and verifiable indicators of transparency, accountability, and algorithmic wellbeing.",
        },
      ],
    },
    architecture: {
      title: "Modular Architecture",
      description:
        "A comprehensive framework covering all aspects of responsible AI deployment and management through four specific components.",
      modules: [
        {
          icon: "□",
          title: "AI Systems Documentation & Traceability",
          description:
            "Complete and standardized registry of all operating AI systems.",
          items: [
            "Audit registry",
            "Standardized documentation",
            "Decision traceability",
            "Version tracking",
          ],
        },
        {
          icon: "◎",
          title: "Participatory Audit",
          description:
            "Mechanisms enabling citizen and expert review of AI systems.",
          items: [
            "Citizen review",
            "External audit",
            "Public reporting",
            "Oversight committees",
          ],
        },
        {
          icon: "△",
          title: "Verification Mechanisms (TMG)",
          description:
            "Technical processes to ensure compliance with governance standards.",
          items: [
            "Bias testing",
            "Impact assessment",
            "Technical verification",
            "Performance metrics",
          ],
        },
        {
          icon: "◇",
          title: "Governance & Trust Signals",
          description:
            "Public indicators measuring and communicating the governance level of each system.",
          items: [
            "Trust scores",
            "Usage indicators",
            "Transparency metrics",
            "Risk alerts",
          ],
        },
      ],
    },
    whyItMatters: {
      title: "Why it matters",
      description:
        "AI is already making critical decisions in healthcare, justice, education, and social services. The lack of transparency and citizen oversight creates systemic risks that disproportionately affect the most vulnerable groups. GOIA is created to ensure that technology serves the public interest, not the other way around.",
      stat1: "73%",
      stat1Label: "of citizens are unaware of AI use in public services",
      stat2: "12x",
      stat2Label: "faster AI adoption than its regulation",
    },
    status: {
      title: "Where we are",
      description:
        "We are developing an MVP during the design phase, seeking strategic allies and funders. We work with 7 pilot municipalities to build a technological infrastructure for AI governance.",
      ctaPrimary: "Request access",
      ctaSecondary: "View phases",
    },
    footer: {
      tagline: "Governance infrastructure for public AI",
      links: ["Contact", "EU", "Tools"],
      copy: "© 2024 GOIA. All rights reserved.",
    },
  },
}

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>("es")
  const [scrolled, setScrolled] = useState(false)
  const t = copy[lang]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "#F2EDE3", color: "#1C2419" }}>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(31,43,26,0.97)" : "#1F2B1A",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="container mx-auto px-6 flex h-14 items-center justify-between max-w-6xl">
          {/* Logo */}
          <Link href="/" className="text-base font-semibold tracking-widest uppercase" style={{ color: "#E8E2D6", letterSpacing: "0.2em" }}>
            GOIA
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[t.nav.contact, t.nav.eu, t.nav.tools].map((label) => (
              <Link
                key={label}
                href="#"
                className="text-xs tracking-wider uppercase transition-opacity hover:opacity-100"
                style={{ color: "#A8B89A", opacity: 0.8, letterSpacing: "0.12em" }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              className="text-xs font-medium tracking-wider uppercase px-2 py-1 rounded transition-colors"
              style={{ color: "#A8B89A", border: "1px solid rgba(168,184,154,0.3)" }}
            >
              {lang === "es" ? "EN" : "ES"}
            </button>
            <Link
              href="/auth/register"
              className="text-xs font-medium tracking-wider uppercase px-4 py-2 rounded-sm transition-all hover:opacity-90"
              style={{ backgroundColor: "#6B8C5A", color: "#F2EDE3", letterSpacing: "0.08em" }}
            >
              {t.nav.cta}
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="grid md:grid-cols-2 min-h-[92vh]">
        {/* Left — text */}
        <div className="flex flex-col justify-center px-8 md:px-16 py-20 md:py-0" style={{ backgroundColor: "#F2EDE3" }}>
          <div className="max-w-lg">
            <span
              className="text-xs font-medium tracking-widest uppercase mb-6 inline-block"
              style={{ color: "#6B8C5A", letterSpacing: "0.15em" }}
            >
              {t.hero.tag}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6" style={{ color: "#1C2419", lineHeight: 1.1 }}>
              {t.hero.title}
            </h1>
            <p className="text-base leading-relaxed mb-10" style={{ color: "#4A5D42", maxWidth: "42ch" }}>
              {t.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium tracking-wide rounded-sm transition-all hover:opacity-90"
                style={{ backgroundColor: "#1F2B1A", color: "#F2EDE3" }}
              >
                {t.hero.ctaPrimary}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="#problem"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium tracking-wide rounded-sm transition-all hover:opacity-80"
                style={{ border: "1px solid #1F2B1A", color: "#1F2B1A", backgroundColor: "transparent" }}
              >
                {t.hero.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>

        {/* Right — visual */}
        <div
          className="relative overflow-hidden min-h-[50vh] md:min-h-0"
          style={{ backgroundColor: "#1F2B1A" }}
        >
          {/* Abstract architectural pattern */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #2D3B25 0%, #1A2418 40%, #0F1A0D 100%)",
            }}
          />
          {/* Grid lines */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(107,140,90,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(107,140,90,0.12) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          {/* Radial glow */}
          <div
            className="absolute"
            style={{
              top: "30%",
              left: "40%",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(107,140,90,0.25) 0%, transparent 70%)",
              transform: "translate(-50%, -50%)",
            }}
          />
          {/* Concentric circles */}
          {[200, 300, 400, 500].map((size, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: "50%",
                border: "1px solid rgba(107,140,90,0.15)",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
          {/* Corner label */}
          <div
            className="absolute bottom-6 right-6 text-right"
            style={{ color: "rgba(168,184,154,0.5)", fontSize: "10px", letterSpacing: "0.15em" }}
          >
            <div>GOIA v2</div>
            <div className="uppercase">AI Governance</div>
          </div>
        </div>
      </section>

      {/* ── EL PROBLEMA ────────────────────────────────────────────────── */}
      <section id="problem" className="py-24 md:py-32" style={{ backgroundColor: "#FAFAF7" }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-[1fr,2fr] gap-16 items-start">
            {/* Left — heading */}
            <div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: "#1C2419" }}>
                {t.problem.title}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "#6B8C5A" }}>
                {t.problem.intro}
              </p>
            </div>

            {/* Right — items */}
            <div className="space-y-6">
              {t.problem.items.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-5 rounded-sm"
                  style={{ backgroundColor: "#F2EDE3", borderLeft: "3px solid #C25B3A" }}
                >
                  <div className="mt-0.5 flex-shrink-0" style={{ color: "#C25B3A" }}>
                    <XIcon size={16} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: "#1C2419" }}>
                      {item.headline}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "#4A5D42" }}>
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── NUESTRA PROPUESTA ──────────────────────────────────────────── */}
      <section id="proposal" className="py-24 md:py-32" style={{ backgroundColor: "#F2EDE3" }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl font-bold mb-5" style={{ color: "#1C2419" }}>
              {t.proposal.title}
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "#4A5D42" }}>
              {t.proposal.description}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: "#D5CFC4" }}>
            {t.proposal.pillars.map((pillar, i) => (
              <div
                key={i}
                className="p-8 flex flex-col gap-4"
                style={{ backgroundColor: "#F2EDE3" }}
              >
                <span
                  className="text-xs font-mono tracking-widest"
                  style={{ color: "#6B8C5A" }}
                >
                  {pillar.number}
                </span>
                <h3 className="text-lg font-semibold" style={{ color: "#1C2419" }}>
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#4A5D42", flex: 1 }}>
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARQUITECTURA MODULAR ───────────────────────────────────────── */}
      <section id="architecture" className="py-24 md:py-32" style={{ backgroundColor: "#FAFAF7" }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4" style={{ color: "#1C2419" }}>
              {t.architecture.title}
            </h2>
            <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "#4A5D42" }}>
              {t.architecture.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {t.architecture.modules.map((mod, i) => (
              <div
                key={i}
                className="p-8 rounded-sm border transition-shadow hover:shadow-md"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#E4DDD2" }}
              >
                <div className="flex items-start gap-4 mb-5">
                  <span
                    className="text-2xl leading-none mt-0.5"
                    style={{ color: "#6B8C5A", fontFamily: "monospace" }}
                  >
                    {mod.icon}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold mb-2" style={{ color: "#1C2419" }}>
                      {mod.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#4A5D42" }}>
                      {mod.description}
                    </p>
                  </div>
                </div>
                <ul className="grid grid-cols-2 gap-y-2 gap-x-4 pt-5" style={{ borderTop: "1px solid #E4DDD2" }}>
                  {mod.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs" style={{ color: "#4A5D42" }}>
                      <span style={{ color: "#6B8C5A" }}>→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POR QUÉ IMPORTA ────────────────────────────────────────────── */}
      <section id="why" className="grid md:grid-cols-2 min-h-[70vh]" style={{ backgroundColor: "#0F1A0D" }}>
        {/* Left — abstract visual */}
        <div className="relative overflow-hidden min-h-[40vh] md:min-h-0">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, #2D3B25 0%, #0F1A0D 70%)",
            }}
          />
          {/* Spiral effect */}
          {[60, 100, 140, 180, 220, 260, 300].map((size, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: "50%",
                border: `1px solid rgba(107,140,90,${0.35 - i * 0.04})`,
                transform: `translate(-50%, -50%) rotate(${i * 22}deg)`,
              }}
            />
          ))}
          <div
            className="absolute inset-0 flex items-end p-8"
            style={{ background: "linear-gradient(to top, rgba(15,26,13,0.8) 0%, transparent 60%)" }}
          >
            <span className="text-xs uppercase tracking-widest" style={{ color: "rgba(168,184,154,0.5)", letterSpacing: "0.2em" }}>
              AI · Society · Governance
            </span>
          </div>
        </div>

        {/* Right — text */}
        <div className="flex flex-col justify-center px-10 md:px-16 py-20 md:py-0">
          <h2 className="text-3xl font-bold mb-6" style={{ color: "#E8E2D6" }}>
            {t.whyItMatters.title}
          </h2>
          <p className="text-base leading-relaxed mb-12" style={{ color: "#A8B89A" }}>
            {t.whyItMatters.description}
          </p>
          <div className="grid grid-cols-2 gap-8" style={{ borderTop: "1px solid rgba(107,140,90,0.25)", paddingTop: "2rem" }}>
            <div>
              <div className="text-4xl font-bold mb-1" style={{ color: "#6B8C5A" }}>
                {t.whyItMatters.stat1}
              </div>
              <div className="text-xs leading-relaxed" style={{ color: "#7A9469" }}>
                {t.whyItMatters.stat1Label}
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1" style={{ color: "#6B8C5A" }}>
                {t.whyItMatters.stat2}
              </div>
              <div className="text-xs leading-relaxed" style={{ color: "#7A9469" }}>
                {t.whyItMatters.stat2Label}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EN QUÉ ESTAMOS ─────────────────────────────────────────────── */}
      <section id="status" className="py-24 md:py-32" style={{ backgroundColor: "#F2EDE3" }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold mb-6" style={{ color: "#1C2419" }}>
              {t.status.title}
            </h2>
            <p className="text-base leading-relaxed mb-10" style={{ color: "#4A5D42" }}>
              {t.status.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium tracking-wide rounded-sm transition-all hover:opacity-90"
                style={{ backgroundColor: "#1F2B1A", color: "#F2EDE3" }}
              >
                {t.status.ctaPrimary}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium tracking-wide rounded-sm transition-all hover:opacity-70"
                style={{ color: "#4A5D42" }}
              >
                {t.status.ctaSecondary}
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer style={{ backgroundColor: "#1F2B1A" }}>
        <div className="container mx-auto px-6 max-w-6xl">
          <div
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-10"
            style={{ borderBottom: "1px solid rgba(107,140,90,0.2)" }}
          >
            <div>
              <div className="text-sm font-semibold tracking-widest uppercase mb-1" style={{ color: "#E8E2D6", letterSpacing: "0.2em" }}>
                GOIA
              </div>
              <div className="text-xs" style={{ color: "#7A9469" }}>
                {t.footer.tagline}
              </div>
            </div>
            <nav className="flex gap-6">
              {t.footer.links.map((link) => (
                <Link
                  key={link}
                  href="#"
                  className="text-xs tracking-wider uppercase transition-opacity hover:opacity-100"
                  style={{ color: "#7A9469", opacity: 0.7, letterSpacing: "0.1em" }}
                >
                  {link}
                </Link>
              ))}
            </nav>
          </div>
          <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs" style={{ color: "rgba(122,148,105,0.5)" }}>
              {t.footer.copy}
            </p>
            <button
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              className="text-xs font-medium tracking-wider uppercase px-3 py-1 rounded-sm transition-colors hover:opacity-80"
              style={{ color: "#7A9469", border: "1px solid rgba(107,140,90,0.25)" }}
            >
              {lang === "es" ? "Switch to English" : "Cambiar a Español"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
