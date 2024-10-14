const userTab = document.querySelector(".usertab");
const searchTab = document.querySelector(".searchtab");
const usercontainer = document.querySelector(".weather-container");
const locationcontainer = document.querySelector(".location-page");  // Add the dot (.)
const searchform = document.querySelector(".search-container");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info");
const grantAccess = document.querySelector(".location-btn");
const searchInput = document.querySelector(".search-area");

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab) {
  if (newTab != oldTab) {
    oldTab.classList.remove("current-tab");
    oldTab = newTab;
    newTab.classList.add("current-tab");

    if (!searchform.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      locationcontainer.classList.remove("active");
      searchform.classList.add("active");
    } else {
      searchform.classList.remove("active");
      userInfoContainer.classList.add("active");
      getfromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

function getfromSessionStorage() {
  const localcordinates = sessionStorage.getItem("user-coordinates");
  if (!localcordinates) {
    locationcontainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localcordinates);
    fetchweather(coordinates);
  }
}

async function fetchweather(coordinates) {
  const { lat, lon } = coordinates;
  locationcontainer.classList.remove("active");
  loadingScreen.classList.add("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");

    showWeather(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
    alert("Failed to fetch weather data.");
  }
}

function showWeather(weatherInfo) {
  const cityName = document.querySelector(".city-name");
  const countryIcon = document.querySelector(".city-flag");
  const desc = document.querySelector(".about-sky");  // Fixed the selector by adding a dot (.)
  const weatherIcon = document.querySelector(".sum-img");
  const temp = document.querySelector(".temp");
  const windspeed = document.querySelector(".Windspeed");
  const humidity = document.querySelector(".Humidity");
  const cloudiness = document.querySelector(".Clouds");

  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp} °C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchweather(userCoordinates);
}

function showError(error) {
  alert("Location access denied or unavailable.");
}

grantAccess.addEventListener("click", getLocation);

searchform.addEventListener("submit", (e) => {
  e.preventDefault();  // Prevent form from submitting normally
  let cityName = searchInput.value;
  if (cityName === "") {
    return;
  } else {
    showCityWeather(cityName);
  }
});

async function showCityWeather(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  locationcontainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    showWeather(data);
  } catch (err) {
    alert("City not found.");
    loadingScreen.classList.remove("active");
  }
}
