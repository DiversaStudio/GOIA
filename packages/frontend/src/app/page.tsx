"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

type Lang = "es" | "en"

const copy = {
  es: {
    nav: {
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
      lead: "Los sistemas de inteligencia artificial están redefiniendo cómo se toman decisiones en salud, justicia, educación y servicios públicos. Pero esta transformación avanza sin una infraestructura de rendición de cuentas que la sostenga.",
      tensions: [
        {
          concept: "Opacidad estructural",
          body: "Las decisiones algorítmicas se producen dentro de sistemas que no fueron diseñados para explicarse a sí mismos. La lógica interna queda oculta no por malicia, sino por arquitectura. Quienes son afectados por estas decisiones no tienen acceso a los criterios que las determinan.",
        },
        {
          concept: "Ausencia de verificación común",
          body: "No existe un marco compartido que permita contrastar si un sistema de IA cumple con estándares éticos o legales mínimos. Cada organización evalúa sus propios sistemas con sus propios métodos, sin posibilidad de comparación ni validación externa.",
        },
        {
          concept: "Participación sin incidencia",
          body: "Los mecanismos de consulta ciudadana sobre tecnología raramente tienen efecto en el diseño o la operación de los sistemas. La participación se reduce a un trámite formal, desconectado de los procesos reales de decisión.",
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
        "La gobernanza de la IA no es un problema técnico. Es un problema de poder: quién decide cómo funcionan los sistemas, quién tiene acceso a esa información y quién puede cuestionarla. Sin infraestructura de rendición de cuentas, la tecnología reproduce y amplifica las asimetrías existentes. GOIA construye la capa de verificación que hace posible la confianza pública en los sistemas de IA.",
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
      copy: "© 2024 GOIA. Todos los derechos reservados.",
    },
  },
  en: {
    nav: {
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
      lead: "Artificial intelligence systems are redefining how decisions are made in healthcare, justice, education, and public services. But this transformation is advancing without an accountability infrastructure to sustain it.",
      tensions: [
        {
          concept: "Structural opacity",
          body: "Algorithmic decisions are produced within systems not designed to explain themselves. The internal logic remains hidden — not by malice, but by architecture. Those affected by these decisions have no access to the criteria that determine them.",
        },
        {
          concept: "Absence of common verification",
          body: "There is no shared framework that allows checking whether an AI system meets minimum ethical or legal standards. Each organization evaluates its own systems with its own methods, with no possibility of comparison or external validation.",
        },
        {
          concept: "Participation without influence",
          body: "Citizen consultation mechanisms on technology rarely have any effect on the design or operation of systems. Participation is reduced to a formal procedure, disconnected from real decision-making processes.",
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
        "AI governance is not a technical problem. It is a problem of power: who decides how systems work, who has access to that information, and who can question it. Without accountability infrastructure, technology reproduces and amplifies existing asymmetries. GOIA builds the verification layer that makes public trust in AI systems possible.",
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
          <Link href="/" className="text-base font-semibold tracking-widest uppercase" style={{ color: "#E8E2D6", letterSpacing: "0.2em" }}>
            GOIA
          </Link>

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
        <div className="relative overflow-hidden min-h-[50vh] md:min-h-0" style={{ backgroundColor: "#1F2B1A" }}>
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, #2D3B25 0%, #1A2418 40%, #0F1A0D 100%)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(107,140,90,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(107,140,90,0.12) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div
            className="absolute"
            style={{
              top: "30%", left: "40%", width: "300px", height: "300px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(107,140,90,0.25) 0%, transparent 70%)",
              transform: "translate(-50%, -50%)",
            }}
          />
          {[200, 300, 400, 500].map((size, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: "50%", left: "50%",
                width: `${size}px`, height: `${size}px`,
                borderRadius: "50%",
                border: "1px solid rgba(107,140,90,0.15)",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
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
            {/* Left — heading + lead */}
            <div className="md:sticky md:top-24">
              <h2 className="text-3xl font-bold mb-5" style={{ color: "#1C2419" }}>
                {t.problem.title}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "#6B8C5A" }}>
                {t.problem.lead}
              </p>
            </div>

            {/* Right — narrative tensions */}
            <div className="space-y-0" style={{ borderTop: "1px solid #E4DDD2" }}>
              {t.problem.tensions.map((tension, i) => (
                <div
                  key={i}
                  className="py-8"
                  style={{ borderBottom: "1px solid #E4DDD2" }}
                >
                  <p
                    className="text-xs font-mono tracking-widest uppercase mb-3"
                    style={{ color: "#6B8C5A" }}
                  >
                    {String(i + 1).padStart(2, "0")} — {tension.concept}
                  </p>
                  <p className="text-base leading-relaxed" style={{ color: "#3A4A35" }}>
                    {tension.body}
                  </p>
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
              <div key={i} className="p-8 flex flex-col gap-4" style={{ backgroundColor: "#F2EDE3" }}>
                <span className="text-xs font-mono tracking-widest" style={{ color: "#6B8C5A" }}>
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
                  <span className="text-2xl leading-none mt-0.5" style={{ color: "#6B8C5A", fontFamily: "monospace" }}>
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
      <section id="why" className="grid md:grid-cols-2 min-h-[60vh]" style={{ backgroundColor: "#0F1A0D" }}>
        {/* Left — abstract visual */}
        <div className="relative overflow-hidden min-h-[40vh] md:min-h-0">
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at center, #2D3B25 0%, #0F1A0D 70%)" }}
          />
          {[60, 100, 140, 180, 220, 260, 300].map((size, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: "50%", left: "50%",
                width: `${size}px`, height: `${size}px`,
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
            <span
              className="text-xs uppercase tracking-widest"
              style={{ color: "rgba(168,184,154,0.5)", letterSpacing: "0.2em" }}
            >
              AI · Society · Governance
            </span>
          </div>
        </div>

        {/* Right — text only, no stats */}
        <div className="flex flex-col justify-center px-10 md:px-16 py-20 md:py-0">
          <h2 className="text-3xl font-bold mb-6" style={{ color: "#E8E2D6" }}>
            {t.whyItMatters.title}
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#A8B89A" }}>
            {t.whyItMatters.description}
          </p>
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
              <div
                className="text-sm font-semibold tracking-widest uppercase mb-1"
                style={{ color: "#E8E2D6", letterSpacing: "0.2em" }}
              >
                GOIA
              </div>
              <div className="text-xs" style={{ color: "#7A9469" }}>
                {t.footer.tagline}
              </div>
            </div>
          </div>
          <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs" style={{ color: "rgba(122,148,105,0.5)" }}>
              {t.footer.copy}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://diversa.studio/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs transition-opacity hover:opacity-100"
                style={{ color: "rgba(122,148,105,0.6)" }}
              >
                Designed and developed with ❤️ by Diversa
              </a>
              <button
                onClick={() => setLang(lang === "es" ? "en" : "es")}
                className="text-xs font-medium tracking-wider uppercase px-3 py-1 rounded-sm transition-colors hover:opacity-80"
                style={{ color: "#7A9469", border: "1px solid rgba(107,140,90,0.25)" }}
              >
                {lang === "es" ? "Switch to English" : "Cambiar a Español"}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
