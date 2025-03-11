
// "use client"
// import { useState, useEffect } from "react"
// import IndoorAirQuality from "./components/IndoorAirQuality";
// import OutdoorAirQuality from "./components/OutdoorAirQuality";
// import { AQIData, IAQData } from "./types/air-quality";
// // import { IAQData as ComponentIAQData, AQIData as ComponentAQIData } from "./interfaces";
// import Image from "next/image"
// import { SplashScreen } from "./components/splash-screen";
// import { Logo } from "./components/logo";
// // import Vanta from "./components/vanta";
// import { StockWidgetApp } from "./components/StockWidget";

// export interface FetchedAQIData {
//   Outdoor_Temp?: { timestamp?: string; value?: number; error?: string };
//   Outdoor_Humidity?: { timestamp?: string; value?: number; error?: string };
//   Outdoor_PM25?: { timestamp?: string; value?: number; error?: string };
//   Outdoor_CO?: { timestamp?: string; value?: number; error?: string };
//   Outdoor_NO2?: { timestamp?: string; value?: number; error?: string };
//   Outdoor_O3?: { timestamp?: string; value?: number; error?: string };
//   Outdoor_SO2?: { timestamp?: string; value?: number; error?: string };
//   Outdoor_WindSpeed?: { timestamp?: string; value?: number; error?: string };
//   Outdoor_WindGust?: { timestamp?: string; value?: number; error?: string };
//   Outdoor_AQI?: { timestamp?: string; value?: number; error?: string };
// }

// export interface FetchedIAQData {
//   LobbyHVAC_Temp?: { timestamp?: string; value?: number; error?: string };
//   LobbyHVAC_Hum?: { timestamp?: string; value?: number; error?: string };
//   LobbyHVAC_PM25?: { timestamp?: string; value?: number; error?: string };
//   LobbyHVAC_CO2?: { timestamp?: string; value?: number; error?: string };
//   LobbyHVAC_IAQ?: { timestamp?: string; value?: number; error?: string };
// }

// export const mapFetchedAQIData = (fetchedData: FetchedAQIData): AQIData => {
//   return {
//     temperature: fetchedData.Outdoor_Temp?.value || 0,
//     humidity: fetchedData.Outdoor_Humidity?.value || 0,
//     pm25: fetchedData.Outdoor_PM25?.value || 0,
//     co: fetchedData.Outdoor_CO?.value || 0,
//     no2: fetchedData.Outdoor_NO2?.value || 0,
//     o3: fetchedData.Outdoor_O3?.value || 0,
//     so2: fetchedData.Outdoor_SO2?.value || 0,
//     windSpeed: fetchedData.Outdoor_WindSpeed?.value || 0,
//     windGust: fetchedData.Outdoor_WindGust?.value || 0,
//     aqi: fetchedData.Outdoor_AQI?.value || 0,
//   };
// };


// const generateRandomIAQData = (): IAQData => ({
//   temperature: 20 + Math.random() * 5,
//   humidity: 30 + Math.random() * 40,
//   pm25: Math.random() * 50,
//   co2: 400 + Math.random() * 600,
//   iaq: Math.floor(Math.random() * 500),
// })

// const generateRandomAQIData = (): AQIData => ({
//   temperature: 15 + Math.random() * 20,
//   humidity: 30 + Math.random() * 50,
//   pm25: Math.random() * 100,
//   co: Math.random() * 10,
//   no2: Math.random() * 100,
//   o3: Math.random() * 100,
//   so2: Math.random() * 100,
//   windSpeed: Math.random() * 20,
//   windGust: Math.random() * 30,
//   aqi: Math.floor(Math.random() * 150) + 20,
// })


// export const mapFetchedIAQData = (fetchedData: FetchedIAQData): IAQData => {
//   return {
//     temperature: fetchedData.LobbyHVAC_Temp?.value || 0,
//     humidity: fetchedData.LobbyHVAC_Hum?.value || 0,
//     pm25: fetchedData.LobbyHVAC_PM25?.value || 0,
//     co2: fetchedData.LobbyHVAC_CO2?.value || 0,
//     iaq: fetchedData.LobbyHVAC_IAQ?.value || 0,
//   };
// };

// export default function Home() {
//   // interface AQIData {
//   //   Outdoor_Temp?: {
//   //     timestamp?: string;
//   //     value?: number;
//   //     error?: string;
//   //   };
//   //   Outdoor_Humidity?: {
//   //     timestamp?: string;
//   //     value?: number;
//   //     error?: string;
//   //   };
//   //   Outdoor_PM25?: {
//   //     timestamp?: string;
//   //     value?: number;
//   //     error?: string;
//   //   };
//   //   Outdoor_CO?: {
//   //     timestamp?: string;
//   //     value?: number;
//   //     error?: string;
//   //   };
//   //   Outdoor_NO2?: {
//   //     timestamp?: string;
//   //     value?: number;
//   //     error?: string;
//   //   };
//   //   Outdoor_O3?: {
//   //     timestamp?: string;
//   //     value?: number;
//   //     error?: string;
//   //   };
//   //   Outdoor_SO2?: {
//   //     timestamp?: string;
//   //     value?: number;
//   //     error?: string;
//   //   };
//   //   Outdoor_WindSpeed?: {
//   //     timestamp?: string;
//   //     value?: number;
//   //     error?: string;
//   //   };
//   //   Outdoor_WindGust?: {
//   //     timestamp?: string;
//   //     value?: number;
//   //     error?: string;
//   //   };
//   //   Outdoor_AQI?: {
//   //     timestamp?: string;
//   //     value?: number;
//   //     error?: string;
//   //   };
//   // }
//   // interface IAQData {

//   // LobbyHVAC_Temp?: {
//   //   timestamp?: string;
//   //   value?: number;
//   //   error?: string;
//   // };
//   // LobbyHVAC_Hum?: {
//   //   timestamp?: string;
//   //   value?: number;
//   //   error?: string;
//   // };
//   // LobbyHVAC_PM25?: {
//   //   timestamp?: string;
//   //   value?: number;
//   //   error?: string;
//   // };
//   // LobbyHVAC_CO2?: {
//   //   timestamp?: string;
//   //   value?: number;
//   //   error?: string;
//   // };
//   // LobbyHVAC_IAQ?: {
//   //   timestamp?: string;
//   //   value?: number;
//   //   error?: string;
//   // };
//   // }
//   const [iaqData, setIaqData] = useState<FetchedIAQData>({})
//   const [aqiData, setAqiData] = useState<FetchedAQIData>({})
//   const [error, setError] = useState(null)
//   const [currentIndex, setCurrentIndex] = useState(0)

//   useEffect(() => {
//       const interval = setInterval(() => {
//           setCurrentIndex((prevIndex) => (prevIndex + 1) % 2)
//       }, 5000) // Change image every 5 seconds

//       return () => clearInterval(interval)
//   }, [])

//   useEffect(() => {
//     // Fetch data from IAQ endpoints
//     const fetchIAQData = async () => {
//       const iaqEndpoints = [
//         "LobbyHVAC_Temp",
//         "LobbyHVAC_Hum",
//         "LobbyHVAC_PM25",
//         "LobbyHVAC_CO2",
//         "LobbyHVAC_IAQ",
//       ];
//       const iaqResults: { [key: string]: any } = {};

//       for (const measurement of iaqEndpoints) {
//         try {
//           const res = await fetch(
//             `http://127.0.0.1:8000/data/iaq/${measurement}`
//           );
//           const data = await res.json()
//           if (data.error) {
//             throw new Error(data.error)
//           }
//           // results[measurement] = data
//           iaqResults[measurement] = data;
//         } catch (error) {
//           console.error(`Error fetching iaq data for ${measurement}:`, error)
//           iaqResults[measurement] = { error: (error as any).message || "Failed to fetch data" }
//         }
//       }
//       setIaqData(iaqResults);
//     };

//     // Fetch data from AQI endpoints
//     const fetchAQIData = async () => {
//       const aqiEndpoints = [
//         "Outdoor_Temp",
//         "Outdoor_Humidity",
//         "Outdoor_PM25",
//         "Outdoor_CO",
//         "Outdoor_NO2",
//         "Outdoor_O3",
//         "Outdoor_SO2",
//         "Outdoor_WindSpeed",
//         "Outdoor_WindGust",
//         "Outdoor_AQI",
//       ];
//       const aqiResults: { [key: string]: any } = {};
//       for (const measurement of aqiEndpoints) {
//         // const res = await fetch(
//         //   `http://10.5.5.211:8200/data/aqi/${measurement}`
//         // );
//         // const data = await res.json();
//         // aqiResults[measurement] = data;

//         try {
//           const res = await fetch(
//             `http://127.0.0.1:8000/data/aqi/${measurement}`
//           );
//           const data = await res.json()
//           if (data.error) {
//             throw new Error(data.error)
//           }
//           // results[measurement] = data
//           aqiResults[measurement] = data;
//         } catch (error) {
//           console.error(`Error fetching iaq data for ${measurement}:`, error)
//           aqiResults[measurement] = { error: (error as Error).message || "Failed to fetch data" }
//         }
//       }
//       setAqiData(aqiResults);
//     };

//     fetchIAQData();
//     fetchAQIData();
//   }, []);

//   if (error) {
//     return <div className="p-4 text-red-500">Error: {error}</div>
//   }

//   return (
//     <div className="">
//               <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
//           <Logo />
//         </div>
//            {/* <SplashScreen /> */}

//       {/* <div

//         className={`absolute top-0 left-0 w-full h-full`}
//       >
//         <Image
//           src={'https://i.imgur.com/oSuuM1t.gif'}
//           alt={`Banner`}
//           fill
//           style={{ objectFit: "cover" }}
//           priority
//         />
//       </div> */}
//       <Vanta />
//       {/* <h1 className="text-2xl font-bold mb-4">Index Livingmall Dashboard</h1> */}
//       <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-8">
//         <div className="max-w-7xl mx-auto space-y-8">
//           <div className="text-center space-y-4">
//             <h1 className="text-4xl font-bold tracking-tighter animate-fade-in">
//               Air Quality Monitor
//             </h1>
//             <p className="text-muted-foreground animate-fade-in">
//               Real-time indoor and outdoor air quality monitoring
//             </p>
//           </div>

//              <div className="relative w-full h-screen overflow-hidden">
//             {/* <ItemSlider /> */}
//             {[0,1].map((src, index) => (

// <div
//     key={index}
//     className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"
//         }`}
// >

//     {     index ===0 ?    <IndoorAirQuality data={mapFetchedIAQData(iaqData)} />:
//             <OutdoorAirQuality data={mapFetchedAQIData(aqiData)} />
//      }
// </div>
// ))}     
//         </div>
        
//         <StockWidgetApp />
//         {/* <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
//       <header className="p-4 bg-gray-800">
//         <h1 className="text-3xl font-bold">Air Quality Dashboard</h1>
//       </header>
//       <main className="flex-grow p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//         <section className="bg-gray-700 rounded-lg p-4">
//           <h2 className="text-2xl font-semibold mb-4">Indoor Air Quality</h2>
//           <Canvas className="h-[400px]">
//             <OrbitControls enableZoom={false} />
//             <Environment preset="apartment" />
//             <IndoorAir data={generateRandomAQIData()} />
//           </Canvas>
//         </section>
//         <section className="bg-gray-700 rounded-lg p-4">
//           <h2 className="text-2xl font-semibold mb-4">Outdoor Air Quality</h2>
//           <Canvas className="h-[400px]">
//             <OrbitControls enableZoom={false} />
//             <Environment preset="city" />
//             <OutdoorAir data={aqiData} />
//           </Canvas>
//         </section>
//       </main>
//     </div> */}
//      {/* <div className="space-y-8">
//             <IndoorAirQuality data={mapFetchedIAQData(iaqData)} />
//             <OutdoorAirQuality data={mapFetchedAQIData(aqiData)} />
//           </div> */}
//         </div>
//       </div>
//       {/* <section className="mb-6">
//         <h2 className="text-xl font-semibold mb-2">Indoor Air Quality (IAQ)</h2>
//         <div className="grid grid-cols-2 gap-4">
//           {Object.entries(iaqData).map(([key, value]) => (
//             <div key={key} className="border rounded-xl p-4 shadow-lg bg-white text-center">
//               <h3 className="font-medium text-lg">{key}</h3>
//               {value.error ? (
//                 <p className="text-red-500">{value.error}</p>
//               ) : (
//                 <>
//                   <p className="text-gray-600">{value?.timestamp}</p>
//                   <p className="text-2xl font-bold">{value?.value}</p>
//                 </>
//               )}
//             </div>
//           ))}
//         </div>
//       </section> */}
//       {/* 
//       <section>
//         <h2 className="text-xl font-semibold mb-2">Outdoor Air Quality (AQI)</h2>
//         <div className="grid grid-cols-2 gap-4">
//           {Object.entries(aqiData).map(([key, value]) => (
//             <div key={key} className="border rounded-xl p-4 shadow-lg bg-white text-center">
//               <h3 className="font-medium text-lg">{key}</h3>
//               {value.error ? (
//                 <p className="text-red-500">{value.error}</p>
//               ) : (
//                 <>
//                   <p className="text-gray-600">{value?.timestamp}</p>
//                   <p className="text-2xl font-bold">{value?.value}</p>
//                 </>
//               )}
//             </div>
//           ))}
//         </div>
//       </section> */}
//     </div>
//   )
// }