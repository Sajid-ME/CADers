"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { Voice } from "@/lib/data";

export default function VoicesSlideshow({ items }: { items: Voice[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;
  const current = items[index];

  return (
    <div className="relative rounded-m-xl bg-surface-container p-8 md:p-14 border border-outline-variant shadow-elev-1 min-h-[280px] flex flex-col justify-center">
      <Quote className="text-primary/25 mb-6" size={44} />

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
        >
          <p className="text-title-lg md:text-headline-md text-surface-on leading-relaxed">
            &ldquo;{current.message}&rdquo;
          </p>
          <div className="mt-8">
            <p className="text-label-lg text-primary">{current.name}</p>
            <p className="text-body-md text-surface-on-variant">
              {current.designation}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {items.length > 1 && (
        <div className="mt-8 flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to voice ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-m-medium ease-m-standard ${
                i === index ? "w-10 bg-primary" : "w-4 bg-primary/25"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}