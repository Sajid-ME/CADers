"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import { Achievement } from "@/lib/data";

export default function AchievementSlideshow({
  items,
}: {
  items: Achievement[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;
  const current = items[index];

  return (
    <div className="relative rounded-m-xl bg-primary-container p-8 md:p-14 overflow-hidden min-h-[240px] flex items-center shadow-elev-1">
      <div className="absolute top-6 right-8 text-primary-on-container/20">
        <Trophy size={96} strokeWidth={1.2} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="relative z-10 max-w-2xl"
        >
          <p className="text-label-md text-primary-on-container/80 uppercase">
            {current.date}
          </p>
          <h3 className="mt-3 text-headline-md text-primary-on-container">
            {current.title}
          </h3>
          <p className="mt-4 text-body-lg text-primary-on-container/90">
            {current.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {items.length > 1 && (
        <div className="absolute bottom-6 left-8 flex gap-2 z-10">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to achievement ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-m-medium ease-m-standard ${
                i === index
                  ? "w-8 bg-primary-on-container"
                  : "w-2 bg-primary-on-container/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}