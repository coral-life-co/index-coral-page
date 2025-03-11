import { NextResponse } from "next/server";

const INFLUX_URL = "http://10.5.5.4:8086";
const INFLUX_BUCKET = "BrunoData";
const INFLUX_ORG = "Coral";
const INFLUX_TOKEN = "w6x9rjRq8L2rwfiNiy-QMx7w7-WC49MkrACmBs1mgX3vHs6gmbRpnqDyEU_nCPdg7fj-blmJz6ueTEyBTa6MxQ==";

const MEASUREMENTS = {
  iaq: ["LobbyHVAC_Temp", "LobbyHVAC_Hum", "LobbyHVAC_PM25", "LobbyHVAC_CO2", "LobbyHVAC_IAQ"],
  aqi: ["Outdoor_Temp", "Outdoor_Humidity", "Outdoor_PM25", "Outdoor_CO", "Outdoor_NO2", "Outdoor_O3", "Outdoor_SO2", "Outdoor_WindSpeed", "Outdoor_WindGust", "Outdoor_AQI"]
};

async function queryInfluxDB(query: string) {
  const response = await fetch(`${INFLUX_URL}/api/v2/query?org=${INFLUX_ORG}`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${INFLUX_TOKEN}`,
      "Content-Type": "application/vnd.flux"
    },
    body: query
  });

  if (!response.ok) {
    throw new Error("Error querying InfluxDB");
  }

  return response.json();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const measurement = searchParams.get("measurement");
  const start = searchParams.get("start") || "-24h";
  const end = searchParams.get("end") || "now";

  if (!category || !measurement || !(category in MEASUREMENTS) || !MEASUREMENTS[category].includes(measurement)) {
    return NextResponse.json({ error: "Invalid category or measurement name" }, { status: 400 });
  }

  const query = `
    from(bucket: "${INFLUX_BUCKET}")
      |> range(start: ${start}, stop: ${end})
      |> filter(fn: (r) => r._measurement == "${measurement}")
      |> yield()
  `;

  try {
    const result = await queryInfluxDB(query);
    const data = result.map((record: any) => ({
      time: record._time,
      value: record._value
    }));

    if (data.length === 0) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    return NextResponse.json({ category, measurement, data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}