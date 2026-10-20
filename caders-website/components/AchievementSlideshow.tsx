"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ChevronLeft, ChevronRight } from "lucide-react";
import { Achievement } from "@/lib/data";

export default function AchievementSlideshow({
  items,
}: {
  items: Achievement[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function next() {
    setIndex((i) => (i + 1) % items.length);
  }

  function prev() {
    setIndex((i) => (i - 1 + items.length) % items.length);
  }

  // Auto-advance unless paused or only one item
  useEffect(() => {
    if (items.length <= 1 || paused) return;
    timerRef.current = setInterval(next, 4500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [items.length, paused]);

  if (!items.length) return null;
  const current = items[index];

  return (
    <div
      className="relative rounded-m-xl bg-primary-container p-8 md:p-14 overflow-hidden min-h-[260px] flex items-center shadow-elev-1"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Decorative trophy icon */}
      <div className="absolute top-6 right-8 text-primary-on-container/20">
        <Trophy size={96} strokeWidth={1.2} />
      </div>

      {/* Animated achievement content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="relative z-10 max-w-2xl"
        >
          {current.date && (
            <p className="text-label-md text-primary-on-container/80 uppercase tracking-widest">
              {current.date}
            </p>
          )}
          <h3 className="mt-3 text-headline-md text-primary-on-container">
            {current.title}
          </h3>
          {current.description && (
            <p className="mt-4 text-body-lg text-primary-on-container/90">
              {current.description}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Controls row: dots + arrows */}
      {items.length > 1 && (
        <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between z-10">
          {/* Dot indicators */}
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to achievement ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-m-medium ease-m-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-on-container ${
                  i === index
                    ? "w-8 bg-primary-on-container"
                    : "w-2 bg-primary-on-container/40 hover:bg-primary-on-container/70"
                }`}
              />
            ))}
          </div>

          {/* Prev / Next arrows */}
          <div className="flex gap-2">
            <button
              onClick={prev}
              aria-label="Previous achievement"
              className="w-8 h-8 rounded-full bg-primary-on-container/15 hover:bg-primary-on-container/30 flex items-center justify-center text-primary-on-container transition"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              aria-label="Next achievement"
              className="w-8 h-8 rounded-full bg-primary-on-container/15 hover:bg-primary-on-container/30 flex items-center justify-center text-primary-on-container transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}