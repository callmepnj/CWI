"use client";

import { motion } from "framer-motion";
import { WatchAlertCard } from "@/components/WatchAlertCard";
import type { watchAdvisories } from "@/data/watch";

type WatchAlert = (typeof watchAdvisories)[number];

export function WatchCarousel({ alerts }: { alerts: WatchAlert[] }) {
  return (
    <motion.div
      className="-mx-4 flex cursor-grab gap-4 overflow-x-auto px-4 pb-4 active:cursor-grabbing lg:mx-0 lg:grid lg:cursor-default lg:grid-cols-4 lg:overflow-visible lg:px-0 lg:pb-0"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.08 }
        }
      }}
    >
      {alerts.map((alert, index) => (
        <motion.div
          key={alert.title}
          className="min-w-[17rem] lg:min-w-0"
          drag={index === 0 ? "x" : false}
          dragConstraints={{ left: -24, right: 24 }}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <WatchAlertCard alert={alert} />
        </motion.div>
      ))}
    </motion.div>
  );
}
