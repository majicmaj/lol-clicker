import { useState, useEffect } from "react";

const monsterColors = {
  Storm: "text-blue-500",
  Infernal: "text-red-600",
  Glacial: "text-blue-300",
  Ocean: "text-blue-300",
  Chemtech: "text-green-600",
  Mountain: "text-green-300",
  Hextech: "text-yellow-600",
  Cloud: "text-gray-600",
  Void: "text-purple-600",
};

const dragonEffectName = {
  Ocean: "Oceanic Will",
  Infernal: "Infernal Might",
  Mountain: "Mountain's Vigor",
  Cloud: "Cloudbringer's Grace",
  Glacial: "Glacial Tempest",
  Hextech: "Hextech Prowess",
  Chemtech: "Chemtech Blight",
  Storm: "Storm's Edge",
  Void: "Void's Corrosion",
};

const dragonIcons = {
  Ocean:
    "https://wiki.leagueoflegends.com/en-us/images/Balanced_LoR_icon_HD.png",
  Infernal:
    "https://wiki.leagueoflegends.com/en-us/images/PoC_Wild_Fragment_icon_HD.png",
  Mountain:
    "https://wiki.leagueoflegends.com/en-us/images/Keyword_Impact_HD.png",
  Cloud:
    "https://wiki.leagueoflegends.com/en-us/images/Keyword_Quick_Attack_HD.png",
  Glacial:
    "https://wiki.leagueoflegends.com/en-us/images/Keyword_Frostbite_HD.png",
  Hextech:
    "https://wiki.leagueoflegends.com/en-us/images/Keyword_Barrier_HD.png",
  Chemtech:
    "https://wiki.leagueoflegends.com/en-us/images/Keyword_Lifesteal_HD.png",
  Storm:
    "https://wiki.leagueoflegends.com/en-us/images/Keyword_Overwhelm_HD.png",
  Void: "https://wiki.leagueoflegends.com/en-us/images/Balanced_LoR_icon_HD.png",
};

const getColor = (monster) => monsterColors[monster];

const DrakeDisplay = () => {
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [activeMonster, setActiveMonster] = useState(null);

  // Helper: Get the current relative humidity from the hourly data by matching the current time.
  const getCurrentRelativeHumidity = (data: any) => {
    if (
      data.hourly &&
      Array.isArray(data.hourly.time) &&
      Array.isArray(data.hourly.relative_humidity_2m)
    ) {
      const index = data.hourly.time.findIndex((t) => t === data.current.time);
      if (index !== -1) {
        return data.hourly.relative_humidity_2m[index];
      }
    }
    return null;
  };

  // Helper: Choose the Epic Monster based on current weather conditions.
  const getActiveMonster = (currentWeather: any, humidity: number) => {
    const temperature = currentWeather.temperature_2m;
    const windSpeed = currentWeather.wind_speed_10m;

    // Priority conditions
    if (windSpeed > 15) {
      return "Storm";
    }
    if (temperature > 30) {
      return "Infernal";
    }
    if (temperature < 0) {
      return "Glacial";
    }

    // Use humidity if available
    if (humidity !== null) {
      if (humidity >= 90) {
        return "Ocean";
      }
      if (humidity <= 20) {
        return "Chemtech";
      }
      if (windSpeed < 2) {
        return "Mountain";
      }
      if (
        temperature >= 10 &&
        temperature <= 20 &&
        humidity >= 40 &&
        humidity <= 70
      ) {
        return "Hextech";
      }
      if (humidity >= 70 && humidity < 90) {
        return "Cloud";
      }
    }

    // Fallback if nothing else matches:
    return "Void";
  };

  // Get the user's coordinates when the component mounts.
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => {
          console.log(`Failed to get geolocation: ${err.message}`);
        }
      );
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);

  // Once we have the coordinates, fetch the weather data from Open-Meteo.
  useEffect(() => {
    if (coords) {
      const { lat, lon } = coords;
      // The query returns current temperature and wind speed,
      // and hourly arrays including relative humidity.
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch weather data");
          }
          return response.json();
        })
        .then((data) => {
          setWeather(data);
          const humidity = getCurrentRelativeHumidity(data);
          const monster = getActiveMonster(data.current, humidity);
          setActiveMonster(monster);
        })
        .catch((err) => {
          setError(`Failed to fetch weather data: ${err.message}`);
        });
    }
  }, [coords]);

  return (
    <div>
      {weather && (
        <div className="text-xl font-medium font-beaufort flex flex-col items-center gap-1">
          <p className="font-thin text-xl text-[#C8AA6E]">Dragon Soul</p>
          <span className={getColor(activeMonster)}>
            {dragonEffectName[activeMonster]}
          </span>
          <img
            src={dragonIcons[activeMonster]}
            alt={activeMonster}
            className="w-6 h-6"
          />
          <span className="mt-1 italic text-xs font-spiegel opacity-70">
            No Effect
          </span>
        </div>
      )}
    </div>
  );
};

export default DrakeDisplay;
