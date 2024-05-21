const apiKey = 'dd945fd9462ea92b706ca988b2ebaabc';
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');
const history = document.getElementById('history');

searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        getCoordinates(city);
    }
});

history.addEventListener('click', function (event) {
    if (event.target.tagName === 'LI') {
        getCoordinates(event.target.textContent);
    }
});

function getCoordinates(city) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                getWeather(lat, lon, city);
                saveToHistory(city);
            } else {
                alert('City not found');
            }
        });
}

function getWeather(lat, lon, city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data.list[0], city);
            displayForecast(data.list);
        });
}

function displayCurrentWeather(data, city) {
    currentWeather.innerHTML = `
        <div class="weather-card">
            <h3>${city} (${new Date(data.dt_txt).toLocaleDateString()})</h3>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
            <p>Temp: ${data.main.temp} °C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind: ${data.wind.speed} m/s</p>
        </div>
    `;
}

function displayForecast(data) {
    forecast.innerHTML = '';
    for (let i = 0; i < data.length; i += 8) {
        const weather = data[i];
        forecast.innerHTML += `
            <div class="weather-card">
                <h3>${new Date(weather.dt_txt).toLocaleDateString()}</h3>
                <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt="${weather.weather[0].description}">
                <p>Temp: ${weather.main.temp} °C</p>
                <p>Humidity: ${weather.main.humidity}%</p>
                <p>Wind: ${weather.wind.speed} m/s</p>
            </div>
        `;
    }
}

function saveToHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        updateHistory();
    }
}

function updateHistory() {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history.innerHTML = '';
    searchHistory.forEach(city => {
        history.innerHTML += `<li>${city}</li>`;
    });
}

updateHistory();
