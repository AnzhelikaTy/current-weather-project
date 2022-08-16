//displaying date&time at current location
let date = new Date();
let hours = date.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = date.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let weekDay = weekDays[date.getDay()];
let currentTime = document.querySelector("#current-time");
currentTime.innerHTML = `Last Updated:  ${weekDay} ${hours}:${minutes}`;

//Search engine
let apiKey = "9538f1f913fbd8594967fe6ef9140f22";
let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather";

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
  // let iconTomorrow = document.querySelector("#icon"); //showing cuurent day weather for now!
  // iconTomorrow.setAttribute(
  //  "src",
  //  `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  //icon.setAttribute("alt", response.data.weather[0].description);
}

function searchCity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-text-input");
  let city = document.querySelector("#current-city");
  if (searchInput.value) {
    city.innerHTML = `${searchInput.value}`;
  } else {
    alert("Please type a city");
  }
  let apiUrl = `${apiEndPoint}?q=${searchInput.value}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showCurrentTemperature);
}

function getCurrentTemperature(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;

  let apiUrl = `${apiEndPoint}?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
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
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperature.innerHTML = Math.round(fahrenheitTemperature);
}
let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let form = document.querySelector("#button-change-city");
form.addEventListener("submit", searchCity);
