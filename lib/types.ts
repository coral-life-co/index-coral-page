import { ReactElement } from "react"
import { Frown, Smile } from "lucide-react"
import React from "react"

export interface IAQData {
    temperature: number
    humidity: number
    pm25: number
    co2: number
    iaq: number
    timestamp: Date
  }
  
  export interface AQIData {
    temperature: number
    humidity: number
    pm25: number
    co: number
    no2: number
    o3: number
    so2: number
    windSpeed: number
    windGust: number
    aqi: number
    timestamp: Date
  }
  
  export interface AirQualityLevel {
    level: string
    color: string
    range: [number, number]
    description: string
    icon?: ReactElement
  }
  
  export const AQILevels: AirQualityLevel[] = [
    {
      level: "Good",
      color: "#10B981",
      range: [0, 50],
      icon: React.createElement(Smile, {className:"h-12 w-12 inline mr-2" }),
      description: "Air quality is satisfactory, and air pollution poses little or no risk.",
    },
    {
      level: "Moderate",
      color: "#FBBF24",
      range: [51, 100],
      icon: React.createElement(Smile, {className:"h-12 w-12 inline mr-2" }),
      description: "Air quality is acceptable. However, there may be a risk for some people.",
    },
    {
      level: "Slightly Unhealthy",
      color: "#F97316",
      range: [101, 150],
      icon: React.createElement(Frown, {className:"h-12 w-12 inline mr-2" }),
      description: "Members of sensitive groups may experience health effects.",
    },
    {
      level: "Unhealthy",
      color: "#EF4444",
      range: [151, 200],
      icon: React.createElement(Frown, {className:"h-12 w-12 inline mr-2" }),
      description: "Some members of the general public may experience health effects.",
    },
    {
      level: "Very Unhealthy",
      color: "#8B5CF6",
      range: [201, 300],
      icon: React.createElement(Frown, {className:"h-12 w-12 inline mr-2" }),
      description: "Health alert: The risk of health effects is increased for everyone.",
    },
    {
      level: "Hazardous",
      color: "#7F1D1D",
      range: [301, 500],
      icon: React.createElement(Frown, {className:"h-12 w-12 inline mr-2" }),
      description: "Health warning of emergency conditions: everyone is more likely to be affected.",
    },
  ]
  
  export const IAQLevels: AirQualityLevel[] = [
    {
      level: "Excellent",
      color: "#10B981",
      range: [0, 50],
      icon: React.createElement(Smile, {className:"h-12 w-12 inline mr-2" }),
      description: "Best for well-being. No measures needed.",
    },
    {
      level: "Good",
      color: "#34D399",
      icon: React.createElement(Smile, {className:"h-12 w-12 inline mr-2" }),
      range: [51, 100],
      description: "No irritation or impact. No measures needed.",
    },
    {
      level: "Lightly Polluted",
      color: "#FBBF24",
      range: [101, 150],
      icon: React.createElement(Frown, {className:"h-12 w-12 inline mr-2" }),
      description: "Reduction of well-being possible. Ventilation suggested.",
    },
    {
      level: "Moderately Polluted",
      color: "#F97316",
      range: [151, 200],
      icon: React.createElement(Frown, {className:"h-12 w-12 inline mr-2" }),
      description: "More irritation possible. Increase ventilation with clean air.",
    },
    {
      level: "Heavily Polluted",
      color: "#EF4444",
      icon: React.createElement(Frown, {className:"h-12 w-12 inline mr-2" }),
      range: [201, 250],
      description: "Can cause headaches. Optimize ventilation.",
    },
    {
      level: "Severely Polluted",
      color: "#8B5CF6",
      range: [251, 350],
      icon: React.createElement(Frown, {className:"h-12 w-12 inline mr-2" }),
      description: "Serious health risks. Identify contamination and maximize ventilation.",
    },
    {
      level: "Extremely Polluted",
      color: "#7F1D1D",
      range: [351, 500],
      icon: React.createElement(Frown, {className:"h-12 w-12 inline mr-2" }),

      description: "Headaches, neurotoxic effects possible. Avoid presence in area.",
    },
  ]
  
  