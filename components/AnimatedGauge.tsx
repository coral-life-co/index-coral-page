"use client"

import { AirQualityLevel } from "@/lib/types"
import { motion } from "framer-motion"
import { ReactElement, useEffect, useState } from "react"

interface AnimatedGaugeProps {
  value: number
  max: number
  title: string
  unit: string
  icon?: ReactElement
  levels: AirQualityLevel[]
}

export function AnimatedGauge({ value, max, title, unit,icon, levels }: AnimatedGaugeProps) {
  const [level, setLevel] = useState<AirQualityLevel>(levels[0])

  useEffect(() => {
    const newLevel = levels.find((l) => value >= l.range[0] && value <= l.range[1]) || levels[levels.length - 1]
    setLevel(newLevel)
  }, [value, levels])

  const percentage = (value / max) * 100

  return (
    <div className="relative w-full aspect-square">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted/20" />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={level.color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${percentage * 2.83}, 283`}
          initial={{ strokeDasharray: "0, 283" }}
          animate={{ strokeDasharray: `${percentage * 2.83}, 283` }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
  <div className="h-12 w-12 inline mr-2" style={{color: level.color}}>     {unit ===""? level.icon: icon} </div> 
       <h3 className="text-lg font-semibold">{title}</h3>
        <motion.p
          key={value}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold"
          style={{ color: level.color }}
        >
       {value}
          <span className="text-sm ml-1">{unit}</span>
        </motion.p>
        <p className="text-xs text-muted-foreground">{level.level}</p>
      </div>
    </div>
  )
}

