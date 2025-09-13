const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "90c04272acb9924fb480645e98c38da3";

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value;

  if (city) {
    try {
      const weatherCoords = await getWeatherCoordsByName(city);
      const weatherData = await getWeatherDataByCoords(
        weatherCoords[0].lat,
        weatherCoords[0].lon
      );
      displayWeatherInfo(weatherData);
    } catch (error) {
      console.log(error);
      displayError(error);
    }
  } else {
    displayError("Please enter a city");
  }
});

async function getWeatherCoordsByName(city) {
  const endpoint = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
  const responce = await fetch(endpoint);

  if (!responce.ok) {
    throw new Error("Could not fetch weather data");
  }

  return await responce.json();
}

async function getWeatherDataByCoords(lat, lon) {
  const endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  const responce = await fetch(endpoint);

  if (!responce.ok) {
    throw new Error("Could not fetch weather data");
  }

  return await responce.json();
}

function displayWeatherInfo(data) {
  const {
    name: city,
    main: { temp, humidity },
    weather: [{ description, id }],
  } = data;

  card.textContent = "";
  card.style.display = "flex";

  const cityDisplay = document.createElement("h1");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const descDisplay = document.createElement("p");
  const WeatherEmoji = document.createElement("p");

  cityDisplay.classList.add("cityDisplay");
  cityDisplay.textContent = city;

  tempDisplay.classList.add("tempDisplay");
  tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;

  humidityDisplay.classList.add("humidityDisplay");
  humidityDisplay.textContent = `Humidity: ${humidity}%`;

  descDisplay.classList.add("descDisplay");
  descDisplay.textContent = description;

  WeatherEmoji.classList.add("WeatherEmoji");
  WeatherEmoji.textContent = getWeatherEmoji(id);

  card.appendChild(cityDisplay);
  card.appendChild(tempDisplay);
  card.appendChild(humidityDisplay);
  card.appendChild(descDisplay);
  card.appendChild(WeatherEmoji);
}

function getWeatherEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return "⛈️";
    case weatherId >= 300 && weatherId < 400:
      return "🌧️";
    case weatherId >= 500 && weatherId < 600:
      return "🌧️";
    case weatherId >= 600 && weatherId < 700:
      return "❄️";
    case weatherId >= 700 && weatherId < 800:
      return "🌫️";
    case weatherId === 800:
      return "🌞";
    case weatherId >= 801 && weatherId < 810:
      return "☁️";
    default:
      return "❓";
  }
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);
}
