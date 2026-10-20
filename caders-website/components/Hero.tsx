"use client";

import { motion } from "framer-motion";
import Button from "./Button";

/**
 * Decorative CAD-style SVG: rotating gear + compass cross-hairs.
 * Pure presentational — aria-hidden so screen readers skip it.
 */
function CadDecoration() {
  return (
    <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none" aria-hidden>
      {/* Outer rotating gear ring */}
      <motion.svg
        width="320"
        height="320"
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="opacity-[0.07] text-primary"
      >
        <circle cx="160" cy="160" r="120" stroke="currentColor" strokeWidth="2" strokeDasharray="12 6" />
        <circle cx="160" cy="160" r="80" stroke="currentColor" strokeWidth="1.5" />
        {/* Gear teeth */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          const rad = (angle * Math.PI) / 180;
          const x1 = 160 + 118 * Math.cos(rad);
          const y1 = 160 + 118 * Math.sin(rad);
          const x2 = 160 + 135 * Math.cos(rad);
          const y2 = 160 + 135 * Math.sin(rad);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          );
        })}
        <circle cx="160" cy="160" r="20" stroke="currentColor" strokeWidth="2" />
      </motion.svg>

      {/* Counter-rotating inner ring */}
      <motion.svg
        width="320"
        height="320"
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-[0.05] text-secondary"
      >
        <circle cx="160" cy="160" r="56" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 4" />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 360) / 8;
          const rad = (angle * Math.PI) / 180;
          const x1 = 160 + 54 * Math.cos(rad);
          const y1 = 160 + 54 * Math.sin(rad);
          const x2 = 160 + 68 * Math.cos(rad);
          const y2 = 160 + 68 * Math.sin(rad);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
          );
        })}
      </motion.svg>

      {/* Cross-hairs */}
      <svg
        width="320"
        height="320"
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 opacity-[0.06] text-primary"
      >
        <line x1="160" y1="20" x2="160" y2="300" stroke="currentColor" strokeWidth="1" />
        <line x1="20" y1="160" x2="300" y2="160" stroke="currentColor" strokeWidth="1" />
        <circle cx="160" cy="160" r="6" fill="currentColor" />
      </svg>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      {/* Gradient glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-container/40 via-transparent to-transparent" />
      <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-primary/15 blur-[120px]" />
      <div className="absolute -bottom-52 -left-40 w-[520px] h-[520px] rounded-full bg-secondary/20 blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-primary-container/30 blur-[100px]" />
      <div className="absolute top-24 left-1/4 w-[220px] h-[220px] rounded-full bg-tertiary/15 blur-[100px]" />

      {/* CAD blueprint grid */}
      <div className="absolute inset-0 bg-blueprint" />

      {/* CAD gear decoration — right side */}
      <CadDecoration />

      <div className="container relative py-28 md:py-36 text-center lg:text-left lg:max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.05, 0.7, 0.1, 1] }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/70 backdrop-blur border border-primary/20 text-primary-on-container text-label-md shadow-elev-1">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
            Official Club of KUET
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.05, 0.7, 0.1, 1] }}
          className="mt-8 text-display-md md:text-display-lg text-surface-on max-w-4xl mx-auto lg:mx-0"
        >
          Design the{" "}
          <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Future
          </span>{" "}
          with CADers
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.05, 0.7, 0.1, 1] }}
          className="mt-6 max-w-xl mx-auto lg:mx-0 text-body-lg text-surface-on-variant"
        >
          The official engineering design club of KUET — teaching the language of
          CAD, producing quality designers, and shaping the next generation of
          engineers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.05, 0.7, 0.1, 1] }}
          className="mt-10 flex gap-3 justify-center lg:justify-start flex-wrap"
        >
          <Button href="/events" variant="accent" size="lg">
            Upcoming Events
          </Button>
          <Button href="/feedback" variant="outlined" size="lg">
            Share Feedback
          </Button>
        </motion.div>

        {/* Quick stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.05, 0.7, 0.1, 1] }}
          className="mt-14 flex gap-8 justify-center lg:justify-start flex-wrap text-center lg:text-left"
        >
          {[
            { value: "KUET", label: "University" },
            { value: "CAD", label: "Focused" },
            { value: "Design", label: "Driven" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-headline-md text-primary font-bold">{s.value}</p>
              <p className="text-label-md text-surface-on-variant uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}