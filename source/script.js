//displaying date&time at current location
function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `Last updated: ${day} ${hours}:${minutes}`;
}

//injecting HTML for each day

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}
//injecting HTML
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#weather-forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col-2">
      <div class="forecast-date">${formatDay(forecastDay.dt)}
      </div>
       <img src="http://openweathermap.org/img/wn/${
         forecastDay.weather[0].icon
       }@2x.png"
       id="icon"
          alt=""
          width="42"
        />
      <div class="forecast-temperature"><span class="forecast-temperature-max">
        ${Math.round(forecastDay.temp.max)}° /</span>
        <span class="forecast-temperature-min">${Math.round(
          forecastDay.temp.min
        )}°</span>
      </div>
    </div>
    `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
function getForecast(coordinates) {
  let apiKey = "9538f1f913fbd8594967fe6ef9140f22";
  let forecastEndPoint = `https://api.openweathermap.org/data/2.5/onecall?`;
  let forecastUrl = `${forecastEndPoint}lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(forecastUrl).then(displayForecast);
  console.log(forecastUrl);
}
//Search engine

function showCurrentTemperature(response) {
  celsiusTemperature = response.data.main.temp;
  let currentTemperature = document.querySelector("#current-temperature");
  currentTemperature.innerHTML = Math.round(celsiusTemperature);

  let city = response.data.name;

  let country = response.data.sys.country;

  let yourCity = document.querySelector("#current-city");
  yourCity.innerHTML = `${city}, ${country}`;

  let feelsLike = Math.round(response.data.main.feels_like);
  let currentFeelsLike = document.querySelector("#current-feels-like");
  currentFeelsLike.innerHTML = `Feels like: ${feelsLike}°C`;

  let condition = response.data.weather[0].description;
  let currentCondition = document.querySelector("#current-condition");
  currentCondition.innerHTML = `${condition}`;
  document.getElementById("current-condition").style.textTransform =
    "capitalize";

  let humidity = response.data.main.humidity;
  let currentHumidity = document.querySelector("#current-humidity");
  currentHumidity.innerHTML = `Humidity: ${humidity}%`;

  let wind = Math.round(response.data.wind.speed);
  let currentWind = document.querySelector("#current-wind");
  currentWind.innerHTML = `Wind: ${wind} m/s`;

  let dateElement = document.querySelector("#current-time");
  dateElement.innerHTML = formatDate(response.data.dt * 1000);

  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  icon.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "9538f1f913fbd8594967fe6ef9140f22";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showCurrentTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-text-input");
  if (searchInput.value) {
    searchInput.innerHTML = `${searchInput.value}`;
  } else {
    alert("Please type a city");
  }
  search(searchInput.value);
  console.log(searchInput.value);
  searchInput.value = "";
}

//current location
function getCurrentTemperature(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiKey = "9538f1f913fbd8594967fe6ef9140f22";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showCurrentTemperature);
}

let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition(getCurrentTemperature);
});

//conversion °C to °F
function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperature = document.querySelector("#current-temperature");
  celsiusLink.classList.remove("active"); //switch class between °C and °F
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperature.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();

  let temperature = document.querySelector("#current-temperature");
  celsiusLink.classList.add("active"); //switch class between °C and °F
  fahrenheitLink.classList.remove("active");
  temperature.innerHTML = Math.round(celsiusTemperature);
}
let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let form = document.querySelector("#button-change-city");
form.addEventListener("submit", handleSubmit);

search("Sydney");
