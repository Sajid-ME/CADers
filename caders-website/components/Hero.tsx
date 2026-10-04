"use client";

import { motion } from "framer-motion";
import Button from "./Button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      {/* Soft mesh gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-container/40 via-transparent to-transparent" />
      <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-primary/15 blur-[120px]" />
      <div className="absolute -bottom-52 -left-40 w-[520px] h-[520px] rounded-full bg-secondary/15 blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-primary-container/30 blur-[100px]" />

      <div className="container relative py-28 md:py-36 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.05, 0.7, 0.1, 1] }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/70 backdrop-blur border border-primary/20 text-primary-on-container text-label-md shadow-elev-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Official Club of KUET
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.05, 0.7, 0.1, 1] }}
          className="mt-8 text-display-md md:text-display-lg text-surface-on max-w-4xl mx-auto tracking-tight"
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
          className="mt-6 max-w-2xl mx-auto text-body-lg text-surface-on-variant"
        >
          The official club of KUET promoting the language of engineering design
          and producing quality designers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.05, 0.7, 0.1, 1] }}
          className="mt-10 flex gap-3 justify-center flex-wrap"
        >
          <Button href="/events" variant="filled" size="lg">
            Upcoming Events
          </Button>
          <Button href="/feedback" variant="outlined" size="lg">
            Share Feedback
          </Button>
        </motion.div>
      </div>
    </section>
  );
}