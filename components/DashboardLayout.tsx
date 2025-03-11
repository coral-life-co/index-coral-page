"use client"

import { AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DashboardOne } from "@/components/DashboardOne"
import { DashboardTwo } from "@/components/DashboardTwo"
import { AQIData, IAQData } from "@/types/air-quality"
import { OutdoorAQIDashboard } from "./AQI/OutdoorAQIDashboard"
import { IndoorAQIDashboard } from "./IAQ/IndoorIAQDashboard"

export interface FetchedAQIData {
  Outdoor_Temp?: { timestamp?: string; value?: number; error?: string };
  Outdoor_Humidity?: { timestamp?: string; value?: number; error?: string };
  Outdoor_PM25?: { timestamp?: string; value?: number; error?: string };
  Outdoor_CO?: { timestamp?: string; value?: number; error?: string };
  Outdoor_NO2?: { timestamp?: string; value?: number; error?: string };
  Outdoor_O3?: { timestamp?: string; value?: number; error?: string };
  Outdoor_SO2?: { timestamp?: string; value?: number; error?: string };
  Outdoor_WindSpeed?: { timestamp?: string; value?: number; error?: string };
  Outdoor_WindGust?: { timestamp?: string; value?: number; error?: string };
  Outdoor_AQI?: { timestamp?: string; value?: number; error?: string };
}

export interface FetchedIAQData {
  LobbyHVAC_Temp?: { timestamp?: string; value?: number; error?: string };
  LobbyHVAC_Hum?: { timestamp?: string; value?: number; error?: string };
  LobbyHVAC_PM25?: { timestamp?: string; value?: number; error?: string };
  LobbyHVAC_CO2?: { timestamp?: string; value?: number; error?: string };
  LobbyHVAC_IAQ?: { timestamp?: string; value?: number; error?: string };
}

export interface FetchedAQIHistoricalData {
  Outdoor_Temp?: {data: { timestamp?: string; value?: number; error?: string }[]};
  Outdoor_Humidity?:  {data: { timestamp?: string; value?: number; error?: string }[]};
  Outdoor_PM25?:  {data: { timestamp?: string; value?: number; error?: string }[]};
  Outdoor_CO?:  {data: { timestamp?: string; value?: number; error?: string }[]};
  Outdoor_NO2?:  {data: { timestamp?: string; value?: number; error?: string }[]};
  Outdoor_O3?:  {data: { timestamp?: string; value?: number; error?: string }[]};
  Outdoor_SO2?:  {data: { timestamp?: string; value?: number; error?: string }[]};
  Outdoor_WindSpeed?:  {data: { timestamp?: string; value?: number; error?: string }[]};
  Outdoor_WindGust?:  {data: { timestamp?: string; value?: number; error?: string }[]};
  Outdoor_AQI?:  {data: { timestamp?: string; value?: number; error?: string }[]};
}

export interface FetchedIAQHistoricalData {
  LobbyHVAC_Temp?:  {data: { timestamp?: string; value?: number; error?: string }[]};
  LobbyHVAC_Hum?:  {data: { timestamp?: string; value?: number; error?: string }[]};
  LobbyHVAC_PM25?:  {data: { timestamp?: string; value?: number; error?: string }[]};
  LobbyHVAC_CO2?:  {data: { timestamp?: string; value?: number; error?: string }[]};
  LobbyHVAC_IAQ?:  {data: { timestamp?: string; value?: number; error?: string }[]};
}

export const mapFetchedAQIData = (fetchedData: FetchedAQIData): AQIData => {
  return {
    temperature: fetchedData.Outdoor_Temp?.value || 0,
    humidity: fetchedData.Outdoor_Humidity?.value || 0,
    pm25: fetchedData.Outdoor_PM25?.value || 0,
    co: fetchedData.Outdoor_CO?.value || 0,
    no2: fetchedData.Outdoor_NO2?.value || 0,
    o3: fetchedData.Outdoor_O3?.value || 0,
    so2: fetchedData.Outdoor_SO2?.value || 0,
    windSpeed: fetchedData.Outdoor_WindSpeed?.value || 0,
    windGust: fetchedData.Outdoor_WindGust?.value || 0,
    aqi: fetchedData.Outdoor_AQI?.value || 0,
  };
};


const generateRandomIAQData = (): IAQData => ({
  temperature: 20 + Math.random() * 5,
  humidity: 30 + Math.random() * 40,
  pm25: Math.random() * 50,
  co2: 400 + Math.random() * 600,
  iaq: Math.floor(Math.random() * 500),
})

const generateRandomAQIData = (): AQIData => ({
  temperature: 15 + Math.random() * 20,
  humidity: 30 + Math.random() * 50,
  pm25: Math.random() * 100,
  co: Math.random() * 10,
  no2: Math.random() * 100,
  o3: Math.random() * 100,
  so2: Math.random() * 100,
  windSpeed: Math.random() * 20,
  windGust: Math.random() * 30,
  aqi: Math.floor(Math.random() * 150) + 20,
})


export const mapFetchedIAQData = (fetchedData: FetchedIAQData): IAQData => {
  return {
    temperature: fetchedData.LobbyHVAC_Temp?.value || 0,
    humidity: fetchedData.LobbyHVAC_Hum?.value || 0,
    pm25: fetchedData.LobbyHVAC_PM25?.value || 0,
    co2: fetchedData.LobbyHVAC_CO2?.value || 0,
    iaq: fetchedData.LobbyHVAC_IAQ?.value || 0,
  };
};
export function DashboardLayout() {
  const [currentDashboard, setCurrentDashboard] = useState<"Indoor Air Quality (IAQ)" | "Outdoor Air Quality (AQI)">("Indoor Air Quality (IAQ)")
  const [error, setError] = useState(null)
  
  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDashboard((prev) => (prev === "Indoor Air Quality (IAQ)" ? "Outdoor Air Quality (AQI)" : "Indoor Air Quality (IAQ)"))
    }, 20000) // Switch every 10 seconds

    return () => clearInterval(interval)
  }, [])

  return (
   <> <div className="p-8 z-[60]">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl">     {currentDashboard === "Indoor Air Quality (IAQ)" ? "Indoor Air Quality (IAQ)" : "Outdoor Air Quality (AQI)"}
        </h1>
        <Button onClick={() => setCurrentDashboard((prev) => (prev === "Indoor Air Quality (IAQ)" ? "Outdoor Air Quality (AQI)" : "Indoor Air Quality (IAQ)"))}>
           {currentDashboard === "Indoor Air Quality (IAQ)" ? "Indoor Air Quality (IAQ)" : "Outdoor Air Quality (AQI)"}
        </Button>
      </div>
      <AnimatePresence mode="wait">
        {currentDashboard === "Outdoor Air Quality (AQI)" ? <OutdoorAQIDashboard key="dashboard-one" /> : <IndoorAQIDashboard key="dashboard-two" />}
      </AnimatePresence>
    
    </div>

    </>
  )
}

