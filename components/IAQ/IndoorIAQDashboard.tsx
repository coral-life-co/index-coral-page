"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { AirVentIcon, BadgeAlert, Droplets, Thermometer, TriangleAlert, Wind } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AQIData, IAQData } from "@/types/air-quality"
import { AnimatedGauge } from "@/components/AnimatedGauge"
import { AnimatedLineChart } from "@/components/AnimatedLineChart"
import { IAQLevels } from "@/lib/types"

interface FetchedData 
{ time?: string; value?: number; error?: string }

export interface FetchedIAQData {
  LobbyHVAC_Temp?: FetchedData;
  LobbyHVAC_Hum?: FetchedData;
  LobbyHVAC_PM25?: FetchedData;
  LobbyHVAC_CO2?: FetchedData;
  LobbyHVAC_IAQ?: FetchedData;
}


export interface FetchedIAQHistoricalData {
  LobbyHVAC_Temp?:  {data: FetchedData[]};
  LobbyHVAC_Hum?:  {data: FetchedData[]};
  LobbyHVAC_PM25?:  {data: FetchedData[]};
  LobbyHVAC_CO2?:  {data: FetchedData[]};
  LobbyHVAC_IAQ?:  {data: FetchedData[]};
}
const generateData = () => {
  return [
    { name: "Mon", value: Math.floor(Math.random() * 100) },
    { name: "Tue", value: Math.floor(Math.random() * 100) },
    { name: "Wed", value: Math.floor(Math.random() * 100) },
    { name: "Thu", value: Math.floor(Math.random() * 100) },
    { name: "Fri", value: Math.floor(Math.random() * 100) },
    { name: "Sat", value: Math.floor(Math.random() * 100) },
    { name: "Sun", value: Math.floor(Math.random() * 100) },
  ]
}

// Mock data generation functions
function generateIAQData(): IAQData {
    return {
      temperature: 20 + Math.random() * 10,
      humidity: 30 + Math.random() * 40,
      pm25: Math.random() * 100,
      co2: 400 + Math.random() * 600,
      iaq: Math.random() * 500,
      time: new Date(),
    }
  }
  
  function generateAQIData(): AQIData {
    return {
      temperature: 15 + Math.random() * 20,
      humidity: 30 + Math.random() * 40,
      pm25: Math.random() * 150,
      co: Math.random() * 50,
      no2: Math.random() * 200,
      o3: Math.random() * 200,
      so2: Math.random() * 200,
      windSpeed: Math.random() * 30,
      windGust: Math.random() * 40,
      aqi: Math.random() * 500,
      time: new Date(),
    }
  }

  const mapFetchedIAQData = (fetchedData: FetchedIAQData): IAQData => {
    return {
      temperature: fetchedData.LobbyHVAC_Temp?.value || 0,
      humidity: fetchedData.LobbyHVAC_Hum?.value || 0,
      pm25: fetchedData.LobbyHVAC_PM25?.value || 0,
      co2: fetchedData.LobbyHVAC_CO2?.value || 0,
      iaq: fetchedData.LobbyHVAC_IAQ?.value || 0,
      time: new Date(fetchedData.LobbyHVAC_IAQ?.time || Date.now()),
    }
  }
  
  const mapFetchedIAQHistoricalData = (fetchedData: FetchedIAQHistoricalData): IAQData[] => {
    return fetchedData.LobbyHVAC_IAQ?.data.map((entry) => ({
      temperature: fetchedData.LobbyHVAC_Temp?.data.find(d => d.time === entry.time)?.value || 0,
      humidity: fetchedData.LobbyHVAC_Hum?.data.find(d => d.time === entry.time)?.value || 0,
      pm25: fetchedData.LobbyHVAC_PM25?.data.find(d => d.time === entry.time)?.value || 0,
      co2: fetchedData.LobbyHVAC_CO2?.data.find(d => d.time === entry.time)?.value || 0,
      iaq: entry.value || 0,
      time: new Date(entry.time || Date.now()),
    })) || []
  }

export function IndoorAQIDashboard() {
  const [chartType, setChartType] = useState<'Line' | 'Gauge'>('Gauge')
  const [iaqHistory, setIaqHistory] = useState<IAQData[]>([])
  // const [aqiHistory, setAqiHistory] = useState<AQIData[]>([])
  const [currentIAQ, setCurrentIAQ] = useState<IAQData>({
    temperature: 0,
    humidity: 0,
    pm25: 0,
    co2: 0,
    iaq: 0,
    time: new Date(),
  })
  // const [currentAQI, setCurrentAQI] = useState<AQIData>(generateAQIData())
  const [iaqData, setIaqData] = useState<FetchedIAQData>({})
  const [iaqHistoricalData, setIaqHistoricalData] = useState<FetchedIAQHistoricalData>({})
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Fetch data from IAQ endpoints
    const fetchIAQData = async () => {
      const iaqEndpoints = [
        "LobbyHVAC_Temp",
        "LobbyHVAC_Hum",
        "LobbyHVAC_PM25",
        "LobbyHVAC_CO2",
        "LobbyHVAC_IAQ",
      ];
      const iaqResults: { [key: string]: any } = {};
      const iaqHistoryResults: { [key: string]: any } = {};

      for (const measurement of iaqEndpoints) {
        try {
          const params = new URLSearchParams({ category: "iaq", measurement });
          // const res  = await fetch(`/api/fetch?${params.toString()}`).then((response) => response);
          // console.log(res)
         
          // const data =
          // (await fetch(`/api/db?${params.toString()}`).then((response) =>
          //  response.json()
          // )) || [];
          const response = await fetch(`/api/fetch?${params.toString()}`);
          const text = await response.text();
          const data = text ? JSON.parse(text) : [];
        
                // console.log('storedData', storedData)
          
          // const resHistory = await fetch(
          //   `http://127.0.0.1:8000/history/iaq/${measurement}?start=-30d&end=now`
          // );
          // const data = await res
          // const historicalData = await resHistory.json()
          // console.log(historicalData)
          if (data.error) {
            throw new Error(data.error)
          }
          // if (historicalData.error) {
          //   throw new Error(historicalData.error)
          // }
          // results[measurement] = data
          iaqResults[measurement] = data.latest;
          // iaqHistoryResults[measurement] = historicalData;
        } catch (error) {
          console.error(`Error fetching iaq data for ${measurement}:`, error)
          iaqResults[measurement] = { error: (error as any).message || "Failed to fetch data" }
        }
      }
      setIaqData(iaqResults);
      setIaqHistoricalData(iaqHistoryResults);
      setCurrentIAQ(mapFetchedIAQData(iaqResults));
      setIaqHistory(mapFetchedIAQHistoricalData(iaqHistoryResults));
    
    };

    fetchIAQData();
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>
  }

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const newIAQ = generateIAQData()
  //     const newAQI = generateAQIData()

  //     setCurrentIAQ(newIAQ)
  //     setCurrentAQI(newAQI)

  //     setIaqHistory((prev) => [...prev.slice(-30), newIAQ])
  //     setAqiHistory((prev) => [...prev.slice(-30), newAQI])
  //   }, 3000)

  //   return () => clearInterval(interval)
  // }, [])
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setData(generateData())
  //   }, 5000)

  //   return () => clearInterval(interval)
  // }, [])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setChartType((prev) => (prev === "Line" ? "Gauge" : "Line"))
  //   }, 4000) // Switch every 10 seconds

  //   return () => clearInterval(interval)
  // }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 bg-transparent"
    >
           {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"> */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                {/* <CardTitle className="text-sm font-medium">IAQ Index</CardTitle> */}
              </CardHeader>
              <CardContent>
            {chartType === 'Line'?  <AnimatedLineChart
                  data={iaqHistory}
                  dataKey="iaq"
                  // title="PM2.5 Trend"
                  // unit="µg/m³"
                  levels={IAQLevels}
                />:
                <AnimatedGauge
                  value={Math.round(currentIAQ.iaq)}
                  max={500}
                  // icon={<AirVentIcon />}
                  title="Indoor Air Quality"
                  unit=""
                  levels={IAQLevels}
                />}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                {/* <CardTitle className="text-sm font-medium">
                
                  Temperature
                </CardTitle> */}
              </CardHeader>
              <CardContent>
              {chartType === 'Line'?  <AnimatedLineChart
                  data={iaqHistory}
                  dataKey="temperature"
                  unit="°C"
                  
                  levels={IAQLevels}
                />:
                <AnimatedGauge
                  value={Math.round(currentIAQ.temperature)}
                  max={40}
                  title="Temperature"
                  icon={  <Thermometer className="h-12 w-12 inline mr-2" />}
                  unit="°C"
                  levels={IAQLevels}
                />}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                {/* <CardTitle className="text-sm font-medium">
                
                  Humidity
                </CardTitle> */}
              </CardHeader>
              <CardContent>
              {chartType === 'Line'?  <AnimatedLineChart
                  data={iaqHistory}
                  dataKey="humidity"
                  unit="%"
              
                  levels={IAQLevels}
                />:
                <AnimatedGauge
                  value={Math.round(currentIAQ.humidity)}
                  max={100}
                  icon={  <Droplets className="h-12 w-12 inline mr-2" />}
                  title="Humidity"
                  unit="%"
                  levels={IAQLevels}
                />}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                {/* <CardTitle className="text-sm font-medium">CO₂</CardTitle> */}
              </CardHeader>
              <CardContent>
              {chartType === 'Line'?  <AnimatedLineChart
                  data={iaqHistory}
                  dataKey="co2"
                  unit="ppm"
              
                  levels={IAQLevels}
                />:
                <AnimatedGauge
                  value={Math.round(currentIAQ.co2)}
                  max={2000}
                  icon={<BadgeAlert className="h-12 w-12 inline mr-2" />}
                  title="Carbon Dioxide"
                  unit="ppm"
                  levels={IAQLevels}
                />}
              </CardContent>
            </Card>
      
          {/* <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent>
                <AnimatedLineChart data={iaqHistory} dataKey="iaq" title="IAQ Trend" unit="" levels={IAQLevels} />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <AnimatedLineChart
                  data={iaqHistory}
                  dataKey="pm25"
                  title="PM2.5 Trend"
                  unit="µg/m³"
                  levels={IAQLevels}
                />
              </CardContent>
            </Card>
          </div> */}
        
           <Card   >
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                {/* <CardTitle className="text-sm font-medium">CO₂</CardTitle> */}
              </CardHeader>
              <CardContent className="flex flex-row items-center justify-center">
      
              {chartType === 'Line'?    
                    <AnimatedLineChart
                  data={iaqHistory}
                  dataKey="pm25"
                  // title="PM2.5 Trend"
                  unit="µg/m³"
                  levels={IAQLevels}
                /> : <AnimatedGauge
                value={Math.round(currentIAQ.pm25)}
                max={200}
                title="PM2.5"
                icon={  <TriangleAlert className="h-12 w-12 inline mr-2" />}
                unit="µg/m³"
                levels={IAQLevels}
              /> }
                {/* <AnimatedLineChart data={iaqHistory} dataKey="iaq" title="IAQ Trend" unit="" levels={IAQLevels} /> */}
              </CardContent>
            </Card>
            {/* <Card className="col-span-2">
              <CardContent>
                <AnimatedLineChart
                  data={iaqHistory}
                  dataKey="pm25"
                  title="PM2.5 Trend"
                  unit="µg/m³"
                  levels={IAQLevels}
                />
                
              </CardContent>
            </Card> */}
      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+2350</div>
          <p className="text-xs text-muted-foreground">+180.1% from last month</p>
        </CardContent>
      </Card> */}
      {/* <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Bar dataKey="value" fill="#adfa1d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card> */}
    </motion.div>
  )
}

