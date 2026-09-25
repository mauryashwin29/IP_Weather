/* =========================================================
   WEATHERLY
   Weather Information Dashboard
   ========================================================= */


/* =========================================================
   1. CONFIGURATION
   ========================================================= */

const API_URL =
    "http://localhost:8080/api/weather";


/* =========================================================
   2. APPLICATION STATE
   ========================================================= */

let currentWeather = null;

let temperatureUnit = "C";

let refreshTimer = null;


/* =========================================================
   3. DOM ELEMENTS
   ========================================================= */

const cityInput =
    document.getElementById("cityInput");

const searchButton =
    document.getElementById("searchButton");

const weatherDashboard =
    document.getElementById("weatherDashboard");

const errorMessage =
    document.getElementById("errorMessage");

const loadingOverlay =
    document.getElementById("loadingOverlay");

const cityName =
    document.getElementById("cityName");

const countryName =
    document.getElementById("countryName");

const weatherIcon =
    document.getElementById("weatherIcon");

const temperature =
    document.getElementById("temperature");

const temperatureUnitElement =
    document.getElementById("temperatureUnit");

const conditionText =
    document.getElementById("conditionText");

const conditionDetail =
    document.getElementById("conditionDetail");

const highTemperature =
    document.getElementById("highTemperature");

const lowTemperature =
    document.getElementById("lowTemperature");

const feelsLike =
    document.getElementById("feelsLike");

const humidity =
    document.getElementById("humidity");

const forecastContainer =
    document.getElementById("forecastContainer");

const favoriteButton =
    document.getElementById("favoriteButton");

const favouriteList =
    document.getElementById("favouriteList");

const historyList =
    document.getElementById("historyList");

const clearHistoryButton =
    document.getElementById("clearHistoryButton");

const unitToggle =
    document.getElementById("unitToggle");

const settingsUnitToggle =
    document.getElementById("settingsUnitToggle");

const settingsButton =
    document.getElementById("settingsButton");

const closeSettingsButton =
    document.getElementById("closeSettingsButton");

const settingsPanel =
    document.getElementById("settingsPanel");

const settingsBackdrop =
    document.getElementById("settingsBackdrop");

const refreshInterval =
    document.getElementById("refreshInterval");

const settingsRefresh =
    document.getElementById("settingsRefresh");

const refreshStatus =
    document.getElementById("refreshStatus");

const compareCityOne =
    document.getElementById("compareCityOne");

const compareCityTwo =
    document.getElementById("compareCityTwo");

const compareButton =
    document.getElementById("compareButton");

const comparisonResult =
    document.getElementById("comparisonResult");


/* =========================================================
   4. SEARCH
   ========================================================= */

async function searchWeather() {

    const city =
        cityInput.value.trim();

    if (!city) {

        showError(
            "Please enter a city name."
        );

        return;
    }

    await fetchWeather(city);
}


async function fetchWeather(city) {

    hideError();

    showLoading();

    searchButton.classList.add("loading");

    searchButton.textContent =
        "Loading...";

    try {

        const response =
            await fetch(
                `${API_URL}?city=${encodeURIComponent(city)}`
            );

        let data = null;

        try {
            data = await response.json();
        } catch {
            throw new Error(
                "The server returned an invalid response."
            );
        }

        if (!response.ok) {

            throw new Error(
                data.error ||
                "Unable to fetch weather data."
            );
        }

        if (!data.city) {

            throw new Error(
                "Weather information could not be found."
            );
        }

        currentWeather = data;

        displayWeather(data);

        saveSearchHistory(data.city);

        displaySearchHistory();

        updateFavouriteButton();

    } catch (error) {

        console.error(
            "Weather request error:",
            error
        );

        showError(
            error.message ||
            "Unable to fetch weather information."
        );

    } finally {

        hideLoading();

        searchButton.classList.remove(
            "loading"
        );

        searchButton.textContent =
            "Search";
    }
}


/* =========================================================
   5. DISPLAY CURRENT WEATHER
   ========================================================= */

function displayWeather(data) {

    weatherDashboard.classList.remove(
        "hidden"
    );

    cityName.textContent =
        data.city || "--";

    countryName.textContent =
        data.country || "--";


    /* Temperature */

    updateTemperatureDisplay();


    /* Weather condition */

    const condition =
        data.condition ||
        getWeatherCondition(
            data.weatherCode
        );

    conditionText.textContent =
        condition;

    conditionDetail.textContent =
        condition;


    /* Weather icon */

    weatherIcon.textContent =
        getWeatherIcon(
            data.weatherCode
        );


    /* Feels like */

    const feelsValue =
        getTemperatureValue(
            data.feelsLike,
            data.feelsLikeFahrenheit
        );

    feelsLike.textContent =
        `${formatTemperature(feelsValue)}°`;


    /* Humidity */

    humidity.textContent =
        `${Number(data.humidity || 0)}%`;


    /* Today's high and low */

    if (
        data.forecast &&
        data.forecast.length > 0
    ) {

        const today =
            data.forecast[0];

        const high =
            getTemperatureValue(
                today.maxTemperature,
                today.maxTemperatureFahrenheit
            );

        const low =
            getTemperatureValue(
                today.minTemperature,
                today.minTemperatureFahrenheit
            );

        highTemperature.textContent =
            `${formatTemperature(high)}°`;

        lowTemperature.textContent =
            `${formatTemperature(low)}°`;
    }


    /* 5-day forecast */

    displayForecast(
        data.forecast || []
    );


    /* Dynamic appearance */

    updateWeatherTheme(
        data.weatherCode
    );


    updateFavouriteButton();

    updateTemperatureButtons();
}


/* =========================================================
   6. TEMPERATURE HANDLING
   ========================================================= */

function getTemperatureValue(
    celsius,
    fahrenheit
) {

    if (temperatureUnit === "F") {

        if (
            fahrenheit !== undefined &&
            fahrenheit !== null
        ) {
            return Number(fahrenheit);
        }

        return (
            Number(celsius) * 9 / 5
        ) + 32;
    }

    return Number(celsius);
}


function formatTemperature(value) {

    if (!Number.isFinite(value)) {
        return "--";
    }

    return value.toFixed(1);
}


function updateTemperatureDisplay() {

    if (!currentWeather) {
        return;
    }

    const value =
        getTemperatureValue(
            currentWeather.temperatureCelsius,
            currentWeather.temperatureFahrenheit
        );

    temperature.textContent =
        formatTemperature(value);

    temperatureUnitElement.textContent =
        `°${temperatureUnit}`;
}


function toggleTemperatureUnit() {

    temperatureUnit =
        temperatureUnit === "C"
            ? "F"
            : "C";

    updateTemperatureDisplay();

    updateTemperatureButtons();

    displayWeatherTemperatureData();

    localStorage.setItem(
        "weatherTemperatureUnit",
        temperatureUnit
    );
}


function displayWeatherTemperatureData() {

    if (!currentWeather) {
        return;
    }

    const feelsValue =
        getTemperatureValue(
            currentWeather.feelsLike,
            currentWeather.feelsLikeFahrenheit
        );

    feelsLike.textContent =
        `${formatTemperature(feelsValue)}°`;


    if (
        currentWeather.forecast &&
        currentWeather.forecast.length > 0
    ) {

        const today =
            currentWeather.forecast[0];

        const high =
            getTemperatureValue(
                today.maxTemperature,
                today.maxTemperatureFahrenheit
            );

        const low =
            getTemperatureValue(
                today.minTemperature,
                today.minTemperatureFahrenheit
            );

        highTemperature.textContent =
            `${formatTemperature(high)}°`;

        lowTemperature.textContent =
            `${formatTemperature(low)}°`;
    }

    displayForecast(
        currentWeather.forecast || []
    );
}


function updateTemperatureButtons() {

    if (unitToggle) {
        unitToggle.textContent =
            `°${temperatureUnit}`;
    }

    if (settingsUnitToggle) {
        settingsUnitToggle.textContent =
            `°${temperatureUnit}`;
    }
}


/* =========================================================
   7. 5-DAY FORECAST
   ========================================================= */

function displayForecast(forecast) {

    if (!forecastContainer) {
        return;
    }

    forecastContainer.innerHTML = "";

    if (!forecast.length) {

        forecastContainer.innerHTML = `
            <div class="empty-state">
                <span>📅</span>
                <p>Forecast unavailable</p>
            </div>
        `;

        return;
    }


    forecast
        .slice(0, 5)
        .forEach((day, index) => {

            const row =
                document.createElement("div");

            row.className =
                "forecast-row";


            const date =
                new Date(
                    `${day.date}T12:00:00`
                );


            const dayName =
                index === 0
                    ? "Today"
                    : date.toLocaleDateString(
                        "en-IN",
                        {
                            weekday: "short"
                        }
                    );


            const dateText =
                date.toLocaleDateString(
                    "en-IN",
                    {
                        day: "numeric",
                        month: "short"
                    }
                );


            const max =
                getTemperatureValue(
                    day.maxTemperature,
                    day.maxTemperatureFahrenheit
                );


            const min =
                getTemperatureValue(
                    day.minTemperature,
                    day.minTemperatureFahrenheit
                );


            const condition =
                day.condition ||
                getWeatherCondition(
                    day.weatherCode
                );


            const icon =
                getWeatherIcon(
                    day.weatherCode
                );


            row.innerHTML = `

                <div class="forecast-day">

                    ${escapeHTML(dayName)}

                    <span class="forecast-date">
                        ${escapeHTML(dateText)}
                    </span>

                </div>


                <div class="forecast-condition">

                    <span class="forecast-icon">
                        ${icon}
                    </span>

                    <span>
                        ${escapeHTML(condition)}
                    </span>

                </div>


                <div class="forecast-temp">

                    <strong>
                        ${formatTemperature(max)}°
                    </strong>

                    <span>
                        /
                        ${formatTemperature(min)}°
                    </span>

                </div>


                <div class="forecast-uv">
                    Weather forecast
                </div>

            `;


            forecastContainer.appendChild(
                row
            );
        });
}


/* =========================================================
   8. WEATHER ICONS & CONDITIONS
   ========================================================= */

function getWeatherIcon(code) {

    if (code === 0) {
        return "☀️";
    }

    if ([1, 2].includes(code)) {
        return "🌤️";
    }

    if (code === 3) {
        return "☁️";
    }

    if ([45, 48].includes(code)) {
        return "🌫️";
    }

    if (
        [51, 53, 55, 56, 57]
            .includes(code)
    ) {
        return "🌦️";
    }

    if (
        [61, 63, 65, 66, 67, 80, 81, 82]
            .includes(code)
    ) {
        return "🌧️";
    }

    if (
        [71, 73, 75, 77, 85, 86]
            .includes(code)
    ) {
        return "❄️";
    }

    if (
        [95, 96, 99]
            .includes(code)
    ) {
        return "⛈️";
    }

    return "🌤️";
}


function getWeatherCondition(code) {

    if (code === 0) {
        return "Clear Sky";
    }

    if (code === 1) {
        return "Mainly Clear";
    }

    if (code === 2) {
        return "Partly Cloudy";
    }

    if (code === 3) {
        return "Overcast";
    }

    if ([45, 48].includes(code)) {
        return "Fog";
    }

    if (
        [51, 53, 55]
            .includes(code)
    ) {
        return "Drizzle";
    }

    if (
        [56, 57]
            .includes(code)
    ) {
        return "Freezing Drizzle";
    }

    if (
        [61, 63, 65]
            .includes(code)
    ) {
        return "Rain";
    }

    if (
        [66, 67]
            .includes(code)
    ) {
        return "Freezing Rain";
    }

    if (
        [71, 73, 75]
            .includes(code)
    ) {
        return "Snowfall";
    }

    if (code === 77) {
        return "Snow Grains";
    }

    if (
        [80, 81, 82]
            .includes(code)
    ) {
        return "Rain Showers";
    }

    if (
        [85, 86]
            .includes(code)
    ) {
        return "Snow Showers";
    }

    if (code === 95) {
        return "Thunderstorm";
    }

    if (
        [96, 99]
            .includes(code)
    ) {
        return "Thunderstorm with Hail";
    }

    return "Unknown Weather";
}


/* =========================================================
   9. WEATHER BACKGROUND
   ========================================================= */

function updateWeatherTheme(code) {

    document.body.classList.remove(
        "clear-theme",
        "cloudy-theme",
        "rain-theme",
        "storm-theme",
        "snow-theme",
        "fog-theme"
    );


    if (code === 0) {

        document.body.classList.add(
            "clear-theme"
        );

    } else if (
        [1, 2, 3].includes(code)
    ) {

        document.body.classList.add(
            "cloudy-theme"
        );

    } else if (
        [45, 48].includes(code)
    ) {

        document.body.classList.add(
            "fog-theme"
        );

    } else if (
        [51, 53, 55, 56, 57,
         61, 63, 65, 66, 67,
         80, 81, 82].includes(code)
    ) {

        document.body.classList.add(
            "rain-theme"
        );

    } else if (
        [71, 73, 75, 77, 85, 86]
            .includes(code)
    ) {

        document.body.classList.add(
            "snow-theme"
        );

    } else if (
        [95, 96, 99].includes(code)
    ) {

        document.body.classList.add(
            "storm-theme"
        );

    } else {

        document.body.classList.add(
            "clear-theme"
        );
    }
}


/* =========================================================
   10. FAVOURITES
   ========================================================= */

function getFavourites() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "weatherFavourites"
            ) || "[]"
        );

    } catch {

        return [];
    }
}


function saveFavourites(favourites) {

    localStorage.setItem(
        "weatherFavourites",
        JSON.stringify(favourites)
    );
}


function isFavourite(city) {

    return getFavourites().some(
        item =>
            item.toLowerCase() ===
            city.toLowerCase()
    );
}


function toggleFavourite() {

    if (!currentWeather) {
        return;
    }

    const city =
        currentWeather.city;

    let favourites =
        getFavourites();


    const existingIndex =
        favourites.findIndex(
            item =>
                item.toLowerCase() ===
                city.toLowerCase()
        );


    if (existingIndex === -1) {

        favourites.push(city);

    } else {

        favourites.splice(
            existingIndex,
            1
        );
    }


    saveFavourites(
        favourites
    );

    displayFavourites();

    updateFavouriteButton();
}


function updateFavouriteButton() {

    if (
        !favoriteButton ||
        !currentWeather
    ) {
        return;
    }

    const city =
        currentWeather.city;


    if (isFavourite(city)) {

        favoriteButton.classList.add(
            "active"
        );

        favoriteButton.innerHTML =
            "★ <span>Remove from Favourites</span>";

    } else {

        favoriteButton.classList.remove(
            "active"
        );

        favoriteButton.innerHTML =
            "☆ <span>Add to Favourites</span>";
    }
}


function displayFavourites() {

    if (!favouriteList) {
        return;
    }

    const favourites =
        getFavourites();

    favouriteList.innerHTML = "";


    if (favourites.length === 0) {

        favouriteList.innerHTML = `
            <div class="empty-state">

                <span>☆</span>

                <p>
                    No favourite cities yet
                </p>

                <small>
                    Add cities using the star button
                </small>

            </div>
        `;

        return;
    }


    favourites.forEach(city => {

        const item =
            document.createElement("div");

        item.className =
            "city-item";


        item.innerHTML = `

            <button
                class="city-item-main"
                type="button"
            >

                <span class="city-item-icon">
                    ⭐
                </span>

                <span class="city-item-name">
                    ${escapeHTML(city)}
                </span>

            </button>


            <button
                class="city-item-remove"
                type="button"
                aria-label="Remove favourite"
            >
                ×
            </button>

        `;


        const openButton =
            item.querySelector(
                ".city-item-main"
            );


        const removeButton =
            item.querySelector(
                ".city-item-remove"
            );


        openButton.addEventListener(
            "click",
            () => {

                cityInput.value =
                    city;

                searchWeather();
            }
        );


        removeButton.addEventListener(
            "click",
            () => {

                let updated =
                    getFavourites()
                        .filter(
                            favourite =>
                                favourite.toLowerCase() !==
                                city.toLowerCase()
                        );

                saveFavourites(
                    updated
             );

                displayFavourites();

                updateFavouriteButton();
            }
        );


        favouriteList.appendChild(
            item
        );
    });
}


/* =========================================================
   11. SEARCH HISTORY
   ========================================================= */

function getSearchHistory() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "weatherSearchHistory"
            ) || "[]"
        );

    } catch {

        return [];
    }
}


function saveSearchHistory(city) {

    if (!city) {
        return;
    }

    let history =
        getSearchHistory();


    history =
        history.filter(
            item =>
                item.toLowerCase() !==
                city.toLowerCase()
        );


    history.unshift(city);


    history =
        history.slice(0, 8);


    localStorage.setItem(
        "weatherSearchHistory",
        JSON.stringify(history)
    );
}


function displaySearchHistory() {

    if (!historyList) {
        return;
    }

    const history =
        getSearchHistory();

    historyList.innerHTML = "";


    if (history.length === 0) {

        historyList.innerHTML = `
            <div class="empty-state">

                <span>🕘</span>

                <p>
                    No recent searches
                </p>

            </div>
        `;

        return;
    }


    history.forEach(city => {

        const item =
            document.createElement("div");

        item.className =
            "city-item";


        item.innerHTML = `

            <button
                class="city-item-main"
                type="button"
            >

                <span class="city-item-icon">
                    🕘
                </span>

                <span class="city-item-name">
                    ${escapeHTML(city)}
                </span>

            </button>

        `;


        item
            .querySelector(
                ".city-item-main"
            )
            .addEventListener(
                "click",
                () => {

                    cityInput.value =
                        city;

                    searchWeather();
                }
            );


        historyList.appendChild(
            item
        );
    });
}


function clearSearchHistory() {

    localStorage.removeItem(
        "weatherSearchHistory"
    );

    displaySearchHistory();
}


/* =========================================================
   12. COMPARE TWO CITIES
   ========================================================= */

async function compareCities() {

    const cityOne =
        compareCityOne.value.trim();

    const cityTwo =
        compareCityTwo.value.trim();


    if (!cityOne || !cityTwo) {

        showError(
            "Enter both cities to compare them."
        );

        return;
    }


    if (
        cityOne.toLowerCase() ===
        cityTwo.toLowerCase()
    ) {

        showError(
            "Please enter two different cities."
        );

        return;
    }


    hideError();

    compareButton.disabled = true;

    compareButton.textContent =
        "Comparing...";


    comparisonResult.innerHTML = "";


    try {

        const results =
            await Promise.all([
                fetchComparisonWeather(cityOne),
                fetchComparisonWeather(cityTwo)
            ]);


        displayComparison(
            results
        );


    } catch (error) {

        showError(
            error.message ||
            "Unable to compare the cities."
        );

    } finally {

        compareButton.disabled = false;

        compareButton.textContent =
            "Compare Cities";
    }
}


async function fetchComparisonWeather(city) {

    const response =
        await fetch(
            `${API_URL}?city=${encodeURIComponent(city)}`
        );


    let data = null;


    try {

        data =
            await response.json();

    } catch {

        throw new Error(
            "Invalid weather server response."
        );
    }


    if (!response.ok) {

        throw new Error(
            data.error ||
            `Unable to find ${city}.`
        );
    }


    return data;
}


function displayComparison(results) {

    comparisonResult.innerHTML = "";


    results.forEach(data => {

        const card =
            document.createElement("article");

        card.className =
            "comparison-card";


        const value =
            getTemperatureValue(
                data.temperatureCelsius,
                data.temperatureFahrenheit
            );


        const condition =
            data.condition ||
            getWeatherCondition(
                data.weatherCode
            );


        card.innerHTML = `

            <div class="comparison-card-header">

                <div class="comparison-city">
                    ${escapeHTML(data.city)}
                </div>

                <div class="comparison-icon">
                    ${getWeatherIcon(data.weatherCode)}
                </div>

            </div>


            <div class="comparison-temperature">
                ${formatTemperature(value)}°
            </div>


            <div class="comparison-condition">
                ${escapeHTML(condition)}
            </div>


            <div class="comparison-stats">

                <div class="comparison-stat">

                    <span>
                        HUMIDITY
                    </span>

                    <strong>
                        ${Number(data.humidity || 0)}%
                    </strong>

                </div>


                <div class="comparison-stat">

                    <span>
                        FEELS LIKE
                    </span>

                    <strong>
                        ${formatTemperature(
                            getTemperatureValue(
                                data.feelsLike,
                                data.feelsLikeFahrenheit
                            )
                        )}°
                    </strong>

                </div>


                <div class="comparison-stat">

                    <span>
                        HIGH
                    </span>

                    <strong>
                        ${getComparisonHigh(data)}
                    </strong>

                </div>


                <div class="comparison-stat">

                    <span>
                        LOW
                    </span>

                    <strong>
                        ${getComparisonLow(data)}
                    </strong>

                </div>

            </div>

        `;


        comparisonResult.appendChild(
            card
        );
    });
}


function getComparisonHigh(data) {

    if (
        !data.forecast ||
        !data.forecast.length
    ) {
        return "--";
    }

    const today =
        data.forecast[0];

    const value =
        getTemperatureValue(
            today.maxTemperature,
            today.maxTemperatureFahrenheit
        );

    return `${formatTemperature(value)}°`;
}


function getComparisonLow(data) {

    if (
        !data.forecast ||
        !data.forecast.length
    ) {
        return "--";
    }

    const today =
        data.forecast[0];

    const value =
        getTemperatureValue(
            today.minTemperature,
            today.minTemperatureFahrenheit
        );

    return `${formatTemperature(value)}°`;
}


/* =========================================================
   13. AUTO REFRESH
   ========================================================= */

function setupAutoRefresh(minutes) {

    clearAutoRefresh();

    const value =
        Number(minutes);


    if (!value || value <= 0) {

        updateRefreshStatus(
            false
        );

        return;
    }


    refreshTimer =
        setInterval(
            () => {

                if (
                    currentWeather &&
                    currentWeather.city
                ) {

                    fetchWeather(
                        currentWeather.city
                    );
                }

            },
            value * 60 * 1000
        );


    updateRefreshStatus(
        true,
        value
    );


    localStorage.setItem(
        "weatherRefreshInterval",
        String(value)
    );
}


function clearAutoRefresh() {

    if (refreshTimer) {

        clearInterval(
            refreshTimer
        );

        refreshTimer = null;
    }
}


function updateRefreshStatus(
    active,
    minutes = 0
) {

    if (!refreshStatus) {
        return;
    }


    if (active) {

        refreshStatus.textContent =
            `● ${minutes} MIN`;

        refreshStatus.classList.add(
            "active"
        );

    } else {

        refreshStatus.textContent =
            "● OFF";

        refreshStatus.classList.remove(
            "active"
        );
    }
}


/* =========================================================
   14. SETTINGS PANEL
   ========================================================= */

function openSettings() {

    settingsPanel.classList.add(
        "open"
    );

    settingsBackdrop.classList.add(
        "active"
    );
}


function closeSettings() {

    settingsPanel.classList.remove(
        "open"
    );

    settingsBackdrop.classList.remove(
        "active"
    );
}


/* =========================================================
   15. LOADING & ERROR
   ========================================================= */

function showLoading() {

    if (loadingOverlay) {
        loadingOverlay.style.display =
            "flex";
    }
}


function hideLoading() {

    if (loadingOverlay) {
        loadingOverlay.style.display =
            "none";
    }
}


function showError(message) {

    if (!errorMessage) {
        return;
    }

    errorMessage.textContent =
        message;

    errorMessage.style.display =
        "block";
}


function hideError() {

    if (!errorMessage) {
        return;
    }

    errorMessage.style.display =
        "none";

    errorMessage.textContent =
        "";
}


/* =========================================================
   16. LOCAL STORAGE INITIALIZATION
   ========================================================= */

function loadSavedSettings() {

    const savedUnit =
        localStorage.getItem(
            "weatherTemperatureUnit"
        );


    if (
        savedUnit === "C" ||
        savedUnit === "F"
    ) {

        temperatureUnit =
            savedUnit;
    }


    const savedRefresh =
        localStorage.getItem(
            "weatherRefreshInterval"
        );


    if (savedRefresh !== null) {

        if (refreshInterval) {
            refreshInterval.value =
                savedRefresh;
        }

        if (settingsRefresh) {
            settingsRefresh.value =
                savedRefresh;
        }

        setupAutoRefresh(
            savedRefresh
        );

    } else {

        setupAutoRefresh(0);
    }


    updateTemperatureButtons();
}


/* =========================================================
   17. SAFE HTML TEXT
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   18. EVENT LISTENERS
   ========================================================= */


/* Search */

if (searchButton) {

    searchButton.addEventListener(
        "click",
        searchWeather
    );
}


if (cityInput) {

    cityInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                searchWeather();
            }
        }
    );
}


/* Temperature */

if (unitToggle) {

    unitToggle.addEventListener(
        "click",
        toggleTemperatureUnit
    );
}


if (settingsUnitToggle) {

    settingsUnitToggle.addEventListener(
        "click",
        toggleTemperatureUnit
    );
}


/* Favourite */

if (favoriteButton) {

    favoriteButton.addEventListener(
        "click",
        toggleFavourite
    );
}


/* History */

if (clearHistoryButton) {

    clearHistoryButton.addEventListener(
        "click",
        clearSearchHistory
    );
}


/* Comparison */

if (compareButton) {

    compareButton.addEventListener(
        "click",
        compareCities
    );
}


/* Auto refresh */

if (refreshInterval) {

    refreshInterval.addEventListener(
        "change",
        event => {

            const value =
                event.target.value;


            if (settingsRefresh) {
                settingsRefresh.value =
                    value;
            }


            setupAutoRefresh(
                value
            );
        }
    );
}


if (settingsRefresh) {

    settingsRefresh.addEventListener(
        "change",
        event => {

            const value =
                event.target.value;


            if (refreshInterval) {
                refreshInterval.value =
                    value;
            }


            setupAutoRefresh(
                value
            );
        }
    );
}


/* Settings */

if (settingsButton) {

    settingsButton.addEventListener(
        "click",
        openSettings
    );
}


if (closeSettingsButton) {

    closeSettingsButton.addEventListener(
        "click",
        closeSettings
    );
}


if (settingsBackdrop) {

    settingsBackdrop.addEventListener(
        "click",
        closeSettings
    );
}


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeSettings();
        }
    }
);


/* =========================================================
   19. START APPLICATION
   ========================================================= */

displayFavourites();

displaySearchHistory();

loadSavedSettings();