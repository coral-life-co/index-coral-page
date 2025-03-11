"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { AirVent, Droplets, OctagonAlert, Radiation, Thermometer, TriangleAlert, Wind } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AQIData } from "@/types/air-quality"
import { AnimatedGauge } from "@/components/AnimatedGauge"
import { AnimatedLineChart } from "@/components/AnimatedLineChart"
import { AQILevels } from "@/lib/types"
import { StockWidgetApp } from "../StockWidget"
const generateData = () => {
  return [
    { name: "Jan", value: Math.floor(Math.random() * 100) },
    { name: "Feb", value: Math.floor(Math.random() * 100) },
    { name: "Mar", value: Math.floor(Math.random() * 100) },
    { name: "Apr", value: Math.floor(Math.random() * 100) },
    { name: "May", value: Math.floor(Math.random() * 100) },
    { name: "Jun", value: Math.floor(Math.random() * 100) },
  ]
}

interface FetchedData 
{ time?: string; value?: number; error?: string }
//   {
//     category?: "iaq",
//     measurement: "LobbyHVAC_IAQ",
//     "latest": {
//         "time": "2025-03-10T04:39:05.301561+00:00",
//         "value": 100.0
//     }
    
// }


export interface FetchedAQIData {
  Outdoor_Temp?: FetchedData;
  Outdoor_Humidity?: FetchedData;
  Outdoor_PM25?: FetchedData;
  Outdoor_CO?: FetchedData;
  Outdoor_NO2?: FetchedData;
  Outdoor_O3?: FetchedData;
  Outdoor_SO2?: FetchedData;
  Outdoor_WindSpeed?: FetchedData;
  // Outdoor_WindGust?: FetchedData;
  Outdoor_AQI?: FetchedData;
}


export interface FetchedAQIHistoricalData {
  Outdoor_Temp?: { data: FetchedData[] };
  Outdoor_Humidity?: { data: FetchedData[] };
  Outdoor_PM25?: { data: FetchedData[] };
  Outdoor_CO?: { data: FetchedData[] };
  Outdoor_NO2?: { data: FetchedData[] };
  Outdoor_O3?: { data: FetchedData[] };
  Outdoor_SO2?: { data: FetchedData[] };
  Outdoor_WindSpeed?: { data: FetchedData[] };
  // Outdoor_WindGust?: { data: FetchedData[] };
  Outdoor_AQI?: { data: FetchedData[] };
}

const mapFetchedAQIData = (fetchedData: FetchedAQIData): AQIData => {
  return {
    temperature: fetchedData.Outdoor_Temp?.value || 0,
    humidity: fetchedData.Outdoor_Humidity?.value || 0,
    pm25: fetchedData.Outdoor_PM25?.value || 0,
    co: fetchedData.Outdoor_CO?.value || 0,
    no2: fetchedData.Outdoor_NO2?.value || 0,
    o3: fetchedData.Outdoor_O3?.value || 0,
    so2: fetchedData.Outdoor_SO2?.value || 0,
    windSpeed: fetchedData.Outdoor_WindSpeed?.value || 0,
    // windGust: fetchedData.Outdoor_WindGust?.value || 0,
    aqi: fetchedData.Outdoor_AQI?.value || 0,
    time: new Date(fetchedData.Outdoor_AQI?.time || Date.now()),
  }
}

const mapFetchedAQIHistoricalData = (fetchedData: FetchedAQIHistoricalData): AQIData[] => {
  return fetchedData.Outdoor_AQI?.data.map((entry) => ({
    temperature: fetchedData.Outdoor_Temp?.data.find(d => d.time === entry.time)?.value || 0,
    humidity: fetchedData.Outdoor_Humidity?.data.find(d => d.time === entry.time)?.value || 0,
    pm25: fetchedData.Outdoor_PM25?.data.find(d => d.time === entry.time)?.value || 0,
    co: fetchedData.Outdoor_CO?.data.find(d => d.time === entry.time)?.value || 0,
    no2: fetchedData.Outdoor_NO2?.data.find(d => d.time === entry.time)?.value || 0,
    o3: fetchedData.Outdoor_O3?.data.find(d => d.time === entry.time)?.value || 0,
    so2: fetchedData.Outdoor_SO2?.data.find(d => d.time === entry.time)?.value || 0,
    windSpeed: fetchedData.Outdoor_WindSpeed?.data.find(d => d.time === entry.time)?.value || 0,
    // windGust: fetchedData.Outdoor_WindGust?.data.find(d => d.time === entry.time)?.value || 0,
    aqi: entry.value || 0,
    time: new Date(entry.time || Date.now()),
  })) || []
}

export function OutdoorAQIDashboard() {
  const [aqiHistory, setAqiHistory] = useState<AQIData[]>([])
  const [currentAQI, setCurrentAQI] = useState<AQIData>({
    temperature: 0,
    humidity: 0,
    pm25: 0,
    co: 0,
    no2: 0,
    o3: 0,
    so2: 0,
    windSpeed: 0,
    // windGust: 0,
    aqi: 0,
    time: new Date(),
  })
  const [chartType, setChartType] = useState<'Line' | 'Gauge'>('Gauge')
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Fetch data from AQI endpoints
    const fetchAQIData = async () => {
      const aqiEndpoints = [
        "Outdoor_Temp",
        "Outdoor_Humidity",
        "Outdoor_PM25",
        "Outdoor_CO",
        "Outdoor_NO2",
        "Outdoor_O3",
        "Outdoor_SO2",
        "Outdoor_WindSpeed",
        // "Outdoor_WindGust",
        "Outdoor_AQI",
      ];
      const aqiResults: { [key: string]: any } = {};
      const aqiHistoryResults: { [key: string]: any } = {};
      for (const measurement of aqiEndpoints) {
        // const res = await fetch(
        //   `http://10.5.5.211:8200/data/aqi/${measurement}`
        // );
        // const data = await res.json();
        // aqiResults[measurement] = data;

        try {
        const params = new URLSearchParams({ category: "aqi", measurement });
          // const response = await fetch(`/api/fetch?${params.toString()}`);
          const response = await fetch(`/api/fetch?/${measurement}`);
          const data = await response.json();
          
          // const text = await response.text();
          // const data = text ? JSON.parse(text) : [];
        
          if (data.error) {
            throw new Error(data.error);
          }
        
          // const resHistory = await fetch(
          //   `http://127.0.0.1:8000/history/aqi/${measurement}?start=-30d&end=now`
          // );
          // const historicalData = await resHistory.json()
          // if (historicalData.error) {
          //   throw new Error(historicalData.error)
          // }
          // results[measurement] = data
          aqiResults[measurement] = data.latest;
          // aqiHistoryResults[measurement] = historicalData;

        } catch (error) {
          console.error(`Error fetching iaq data for ${measurement}:`, error)
          aqiResults[measurement] = { error: (error as Error).message || "Failed to fetch data" }
        }
      }
      // setaqiData(iaqResults);
      // setaqiHistoricalData(iaqHistoryResults);
      setCurrentAQI(mapFetchedAQIData(aqiResults));
      setAqiHistory(mapFetchedAQIHistoricalData(aqiHistoryResults));
    };

    fetchAQIData();

  }, []);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>
  }

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const newAQI = generateAQIData()
  //     const newAQI = generateAQIData()

  //     setCurrentAQI(newAQI)
  //     setCurrentAQI(newAQI)

  //     setaqiHistory((prev) => [...prev.slice(-30), newAQI])
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          {/* <CardTitle className="text-sm font-medium">AQI Index</CardTitle> */}
        </CardHeader>
        <CardContent>
        {chartType === 'Line'?       <AnimatedLineChart
            data={aqiHistory}
            dataKey="aqi"
            levels={AQILevels}
          /> :  <AnimatedGauge
            value={Math.round(currentAQI.aqi)}
            max={500}
            icon={<Wind className="h-12 w-12 inline mr-2" />}
            title="Air Quality Index"
            unit=""
            levels={AQILevels}
          />}
        </CardContent>
      </Card>
      {/* <StockWidgetApp /> */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          {/* <CardTitle className="text-sm font-medium">

                  Wind
                </CardTitle> */}
        </CardHeader>
        <CardContent>
        {chartType === 'Line'?       <AnimatedLineChart
            data={aqiHistory}
            dataKey="windSpeed"
            // title="PM2.5 Trend"
            unit="km/h"

            levels={AQILevels}
          /> :    <AnimatedGauge
            value={Math.round(currentAQI.windSpeed)}
            max={50}
            icon={<Wind className="h-12 w-12 inline mr-2" />}
            title="Wind Speed"
            unit="km/h"
            levels={AQILevels}
          />}
        </CardContent>
      </Card>
      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        </CardHeader>
        <CardContent>
        {chartType === 'Line'?       <AnimatedLineChart
            data={aqiHistory}
            dataKey="windGust"
            unit="km/h"
            levels={AQILevels}
          /> :   <AnimatedGauge
            value={Math.round(currentAQI.windSpeed)}
            max={50}
            icon={<AirVent className="h-12 w-12 inline mr-2" />}
            title="Wind Gust"
            unit="km/h"
            levels={AQILevels}
          />}
        </CardContent>
      </Card> */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          {/* <CardTitle className="text-sm font-medium">PM2.5</CardTitle> */}
        </CardHeader>
        <CardContent>
        {chartType === 'Line'?       <AnimatedLineChart
            data={aqiHistory}
            dataKey="pm25"
            // title="PM2.5 Trend"
            unit="µg/m³"

            levels={AQILevels}
          /> :       <AnimatedGauge
            value={Math.round(currentAQI.pm25)}
            max={200}
            title="PM2.5"
            icon={<TriangleAlert className="h-12 w-12 inline mr-2" />}
            unit="µg/m³"
            levels={AQILevels}
          />}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          {/* <CardTitle className="text-sm font-medium">O₃</CardTitle> */}
        </CardHeader>
        <CardContent>
        {chartType === 'Line'?       <AnimatedLineChart
            data={aqiHistory}
            dataKey="no2"
            unit="ppb"

            levels={AQILevels}
          /> :     <AnimatedGauge
            value={Math.round(currentAQI.o3)}
            max={200}
            icon={<OctagonAlert className="h-12 w-12 inline mr-2" />}
            title="NO₂"
            unit="ppb"
            levels={AQILevels}
          />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          {/* <CardTitle className="text-sm font-medium">O₃</CardTitle> */}
        </CardHeader>
        <CardContent>
        {chartType === 'Line'?       <AnimatedLineChart
            data={aqiHistory}
            dataKey="o3"
            unit="ppb"

            levels={AQILevels}
          /> :  
          <AnimatedGauge
            value={Math.round(currentAQI.o3)}
            max={200}
            icon={<OctagonAlert className="h-12 w-12 inline mr-2" />}
            title="Ozone (O₃)"
            unit="ppb"
            levels={AQILevels}
          />}
        </CardContent>
      </Card>


      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          {/* <CardTitle className="text-sm font-medium">O₃</CardTitle> */}
        </CardHeader>
        <CardContent>
        {chartType === 'Line'?       <AnimatedLineChart
            data={aqiHistory}
            dataKey="so2"
            unit="ppb"

            levels={AQILevels}
          /> :  <AnimatedGauge
            value={Math.round(currentAQI.o3)}
            max={200}
            icon={<OctagonAlert className="h-12 w-12 inline mr-2" />}
            title="SO₂"
            unit="ppb"
            levels={AQILevels}
          />}
        </CardContent>
      </Card>


      {/* <Card className="col-span-2">
        <CardContent>
          <AnimatedLineChart data={aqiHistory} dataKey="aqi" title="AQI Trend" unit="" levels={AQILevels} />
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardContent>
        {chartType === 'Line'?       <AnimatedLineChart
            data={aqiHistory}
            dataKey="pm25"
            title="PM2.5 Trend"
            unit="µg/m³"
            levels={AQILevels}
          />
        </CardContent>
      </Card> */}

      {/* <Card className="col-span-2">
           <CardHeader>
             <CardTitle>Weekly AQI Trend</CardTitle>
           </CardHeader>
           <CardContent className="pl-2">
             <ResponsiveContainer width="100%" height={350}>
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
             </ResponsiveContainer>
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

