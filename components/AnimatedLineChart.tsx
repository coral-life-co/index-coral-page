"use client"

import { motion } from "framer-motion"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import type { AirQualityLevel } from "@/lib/types"

interface AnimatedLineChartProps {
  data: any[]
  dataKey: string
  title?: string
  unit?: string
  levels: AirQualityLevel[]
}

export function AnimatedLineChart({ data, dataKey, title, unit, levels }: AnimatedLineChartProps) {
  const getColor = (value: number) => {
    const level = levels.find((l) => value >= l.range[0] && value <= l.range[1]) || levels[levels.length - 1]
    return level.color
  }

  const CustomDot = ({ cx, cy, value }: any) => (
    <motion.circle
      cx={cx}
      cy={cy}
      r={4}
      fill={getColor(value)}
      initial={{ r: 0 }}
      animate={{ r: 4 }}
      transition={{ duration: 0.5 }}
    />
  )

  return (
    <div className="w-full h-[300px]">
      <h3 className="text-sm font-medium mb-4">{title}</h3>
      {/* <ResponsiveContainer width="100%" height="100%">
               <LineChart data={data}>
                 <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis
                   stroke="#888888"
                   fontSize={12}
                   tickLine={false}
                   axisLine={false}
                   tickFormatter={(value) => `${value}`}
                 />
                 <Tooltip />
                 <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
               </LineChart>
             </ResponsiveContainer> */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="timestamp" tickFormatter={(time) => new Date(time).toLocaleDateString()} stroke="#888888"  fontSize={12} tickLine={false} axisLine={false}/>
          <YAxis stroke="#888888" unit={unit}  fontSize={12}
                   tickLine={false}
                   axisLine={false}
                   tickFormatter={(value) => `${value}`} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const value = payload[0].value
                const level =
                  levels.find((l) => value >= l.range[0] && value <= l.range[1]) || levels[levels.length - 1]
                return (
                  <div className="rounded-lg border bg-background shadow-sm">
                    <div className="grid grid-cols-2 gap-2 justify-start items-start">
                      <div className="flex flex-col justify-start items-start">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Value</span>
                        <span className="font-bold text-muted-foreground">
                          {value} {unit}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Status</span>
                        <span className="font-bold" style={{ color: level.color }}>
                          {level.level}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line type="monotone" dataKey={dataKey} stroke="#8884d8"  strokeWidth={2} dot={<CustomDot />} isAnimationActive={true} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

