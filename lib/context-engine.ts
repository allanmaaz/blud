export async function getRealTimeContext() {
    try {
        // Berlin coordinates (defaulting for this demo, in real app could request location)
        const lat = 52.52;
        const lon = 13.41;

        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&timezone=auto`
        );

        if (!weatherRes.ok) throw new Error("Weather fetch failed");

        const weatherData = await weatherRes.json();
        const current = weatherData.current;

        // Simple weather code mapping
        const weatherCodes: Record<number, string> = {
            0: "Clear sky",
            1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
            45: "Fog", 48: "Depositing rime fog",
            51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
            61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
            80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
            // ... others omitted for brevity
        };

        const weatherDesc = weatherCodes[current.weather_code] || "Variable conditions";
        const temp = `${current.temperature_2m}°C`;
        const timeOfDay = current.is_day ? "Daytime" : "Nighttime";

        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        return {
            weather: `${weatherDesc}, ${temp}`,
            time: `${timeOfDay}, ${time}`,
            raw: weatherData
        };
    } catch (error) {
        console.error("Context fetch error:", error);
        return {
            weather: "Unknown weather",
            time: "Timeless void",
            error: true
        };
    }
}
