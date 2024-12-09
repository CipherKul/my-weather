import { useState, useEffect } from "react";

function WeatherApp() {
  const [city, setCity] = useState("jhalawar"); // Default city
  const [searchCity, setSearchCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null); // Weather data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  
       
  const GEO_API_KEY = "0c92846d5a6e40a35f31f60759cb67d0"; 
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const API_KEY = "0c92846d5a6e40a35f31f60759cb67d0"; // Replace with your API key
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
          throw new Error("City not found");
        }

        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err.message);
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

   // Fetch city suggestions as the user types
  const fetchSuggestions = async (input) => {
    if (input.trim() === "") {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${GEO_API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Error fetching city suggestions");
      }

      const data = await response.json();
      setSuggestions(data.map((item) => item.name));
    } catch (err) {
      console.error(err);
      setSuggestions([]);
    }
  };

  // Handle input change and fetch suggestions
  const handleInputChange = (e) => {
    const input = e.target.value;
    setSearchCity(input);
    fetchSuggestions(input);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion); // Set the city and trigger weather fetch
    setSearchCity(""); // Clear input
    setSuggestions([]); // Clear suggestions
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchCity.trim()) {
      setCity(searchCity.trim());
      setSearchCity("");
      setSuggestions([]);
    }
  };



  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Weather App</h1>

      <div className="mb-6 relative">
  <div className="flex">
    <input
      type="text"
      value={searchCity}
      onChange={handleInputChange} // Trigger suggestions on input change
      onKeyDown={handleKeyPress} // Trigger search on "Enter" key press
      className="p-2 border border-gray-300 rounded-l-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300 flex-grow"
      placeholder="Enter city name"
    />
    <button
      onClick={() => {
        if (searchCity.trim()) {
          setCity(searchCity.trim());
          setSearchCity(""); // Clear the input field
          setSuggestions([]); // Clear suggestions
        }
      }}
      className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
    >
      Search
    </button>
  </div>
  {/* Suggestions Dropdown */}
  {suggestions.length > 0 && (
    <ul className="absolute bg-white border border-gray-300 rounded-lg shadow-lg w-full mt-1 max-h-40 overflow-y-auto z-10">
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          onClick={() => handleSuggestionClick(suggestion)} // Select city on click
          className="p-2 hover:bg-blue-100 cursor-pointer"
        >
          {suggestion}
        </li>
      ))}
    </ul>
  )}
</div>

      
      {/* Loading state */}
      {loading && <p className="text-lg text-blue-500">Loading...</p>}
      
      {error && <p className="text-lg text-red-500">{error}</p>}

      {weather && (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-2">{weather.name}</h2>
          <p className="text-lg">
            Temperature: <span className="font-semibold">{weather.main.temp}°C</span>
          </p>
          <p className="text-lg">
            Weather: <span className="font-semibold">{weather.weather[0].description}</span>
          </p>
          <p className="text-lg">
            Humidity: <span className="font-semibold">{weather.main.humidity}%</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
