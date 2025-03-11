"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "../lib/utils"
import { Logo } from "./logo"
// import { cn } from "@/lib/utils"

export function SplashScreen() {
  const [progress, setProgress] = useState(0)
  const [matrixText, setMatrixText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%"
    let interval: NodeJS.Timeout

    // Matrix text effect
    const matrixInterval = setInterval(() => {
      const randomText = Array(8)
        .fill(0)
        .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
        .join("")
      setMatrixText(randomText)
    }, 50)

    // Progress bar animation
    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          clearInterval(matrixInterval)
          setTimeout(() => setIsComplete(true), 500) // Delay before hiding splash screen
          return 100
        }
        return prev + 1
      })
    }, 30)

    return () => {
      clearInterval(interval)
      clearInterval(matrixInterval)
    }
  }, [])

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[60] backdrop-blur-sm flex flex-col items-center justify-center bg-dark-900 bg-opacity-50 transition-opacity duration-500",
          isComplete ? "opacity-0 pointer-events-none" : "opacity-100",
        )}
      >
        {/* <div className="relative w-48 h-48 mb-8">
        <Image
          src="https://i.postimg.cc/pTPGkFFP/Coral-Life-W-0.png"
          alt="SDFM 2520"
          fill
          className="object-contain"
          priority
        />
      </div> */}

        <div className="relative w-48 h-48 mb-8">
          <Image
            src="https://i.postimg.cc/pTPGkFFP/Coral-Life-W-0.png"
            // src="https://i.postimg.cc/pTk0SLfz/batch-INDEX-LIVING-MALL.webp"
            alt="SDFM 2520"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Matrix-style loading text */}
        <div className="font-mono text-white mb-4 h-6">{`LOADING_SYSTEM: ${progress}%`}</div>

        {/* Progress bar container */}
        <div className="w-64 h-1 bg-dark-400 rounded-full overflow-hidden">
          <div className="h-full bg-white transition-all duration-100 ease-out" style={{ width: `${progress}%` }} />
        </div>

        {/* Progress percentage */}
        {/* <div className="mt-2 font-mono text-sm text-white">{`${progress}%`}</div> */}
      </div>   
      <div

// className={`absolute top-0 left-0 w-full h-full`}
className={cn(
  "absolute top-0 left-0 z-0 w-full h-full  bg-opacity-50 transition-opacity duration-500",
  isComplete ? "opacity-20 pointer-events-none  blur-sm" : "opacity-100",
)}
>
<Image
  src={'https://i.imgur.com/oSuuM1t.gif'}
  alt={`Banner`}
  fill
  style={{ objectFit: "fill" }}
  priority
/>
</div>
      </>
  )
}

