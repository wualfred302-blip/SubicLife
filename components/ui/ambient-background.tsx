"use client"

import { motion } from "framer-motion"

export function AmbientBackground() {
  // Colors inspired by the Pass Section "Recent Activity" and "Membership Pass" theme
  const colors = [
    "hsl(215, 15%, 75%)", // Neutral Gray
    "hsl(20, 60%, 85%)",  // Soft Peach (#f5d6c6)
    "hsl(200, 40%, 88%)", // Light Blue (#d4e4ec)
    "hsl(30, 25%, 80%)",  // Warm Beige (#c8b8a8)
    "hsl(220, 10%, 70%)", // Deeper Gray
  ]

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#f6f6f8]">
      {/* 
        The "Light Gray Theme" for the Pass Section.
        Using larger, distinct orbs with multiply blending to create depth 
        against the light background, matching the glassmorphic components.
      */}

      {/* 1. Large Neutral Gray Orbs */}
      <motion.div
        animate={{
          x: ["0%", "5%", "0%"],
          y: ["0%", "10%", "0%"],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-5%] h-[45vw] w-[45vw] rounded-full mix-blend-multiply blur-[120px] opacity-40"
        style={{ backgroundColor: colors[0] }}
      />

      <motion.div
        animate={{
          x: ["0%", "-5%", "0%"],
          y: ["0%", "-10%", "0%"],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 45, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-5%] h-[50vw] w-[50vw] rounded-full mix-blend-multiply blur-[130px] opacity-35"
        style={{ backgroundColor: colors[4] }}
      />

      {/* 2. Soft Accent Orbs (Peach/Blue/Beige from Recent Activity) */}
      <motion.div
        animate={{
          x: ["0%", "8%", "0%"],
          y: ["0%", "-5%", "0%"],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[10%] right-[10%] h-[35vw] w-[35vw] rounded-full mix-blend-multiply blur-[100px] opacity-30"
        style={{ backgroundColor: colors[1] }}
      />

      <motion.div
        animate={{
          x: ["0%", "-8%", "0%"],
          y: ["0%", "5%", "0%"],
        }}
        transition={{ duration: 38, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[20%] left-[5%] h-[40vw] w-[40vw] rounded-full mix-blend-multiply blur-[110px] opacity-30"
        style={{ backgroundColor: colors[2] }}
      />

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 50, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[35%] left-[30%] h-[30vw] w-[30vw] rounded-full mix-blend-multiply blur-[90px] opacity-25"
        style={{ backgroundColor: colors[3] }}
      />

      {/* 3. Distinct Gray Orbs (Center-focused for depth) */}
      <motion.div
        animate={{
          y: ["0%", "15%", "0%"],
        }}
        transition={{ duration: 42, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute top-[20%] right-[30%] h-[25vw] w-[25vw] rounded-full mix-blend-multiply blur-[80px] opacity-20"
        style={{ backgroundColor: colors[0] }}
      />

      <motion.div
        animate={{
          x: ["0%", "10%", "0%"],
        }}
        transition={{ duration: 47, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute bottom-[30%] right-[15%] h-[20vw] w-[20vw] rounded-full mix-blend-multiply blur-[70px] opacity-25"
        style={{ backgroundColor: colors[4] }}
      />
    </div>
  )
}
