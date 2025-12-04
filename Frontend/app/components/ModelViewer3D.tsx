"use client";

import { motion } from "framer-motion";
import MuscleAnatomy from "./Muscleanatomy";

type AnatomyPanelProps = {
  activeMuscles: string[];
};

export default function ModelViewer3D({ activeMuscles }: AnatomyPanelProps) {
  return (
    <motion.div
      layout
      className="h-full flex-1 rounded-3xl bg-white shadow-[0_18px_45px_rgba(15,23,42,0.20)] flex flex-col"
    >
      <div className="mb-3 flex items-center justify-center">
        <h1 className="font-semibold">Targeted Muscle</h1>
      </div>
      <div className="flex-1 rounded-2xl bg-slate-200/80 border border-slate-300/60 overflow-hidden">
        <MuscleAnatomy activeMuscles={activeMuscles} />
      </div>
    </motion.div>
  );
}