

//Get elements from the DOM
const searchDiv = document.getElementById("search");
const currenDayDiv = document.getElementById("current");
const fiveDayDiv = document.getElementById("five-day");
const searchBtn = document.getElementById("search-button");

//Add event listener on button for click event, call goFetch function
searchBtn.addEventListener("click", goFetch);

//OpenWeather API Key
const apiKey = "d39f86ad504a22388ea2e540968ab6af";

//Variable to store data to local storage
const pastSearchArr = JSON.parse(localStorage.getItem("saved-searches")) || [];

initialPageLoad();
buildPriorSearches();

//Browswer Location Fetch Geo & Call Weather
function initialPageLoad() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const reverseGeoAPI = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${apiKey}`
            fetch(reverseGeoAPI)
                .then(function (response) {
                    return response.json();
                })
                .then(function (locationData) {
                    console.log(locationData);
                    weatherFetch(lat, lon, locationData)
                });
        });
    };
};

//Search Bar Fetch Geo & Call Weather
function goFetch() {

    const inputBox = document.getElementById("input-box");
    const inputBoxVal = inputBox.value;
    saveLocally(inputBoxVal);
    const geoAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${inputBoxVal}&limit=1&appid=${apiKey}`;
    fetch(geoAPI)
        .then(function (response) {
            return response.json();
        })
        .then(function (locationData) {
            if (locationData.length !== 0) {
                console.log(locationData)
                const lat = locationData[0].lat
                const lon = locationData[0].lon
                weatherFetch(lat, lon, locationData);
            }
        })

}

//Previous Search Fetch Geo & Call Weather
function goFetchAgain(e) {
    const inputBoxVal = e.target.textContent;
    // const inputBox = document.getElementById("input-box");
    // const inputBoxVal = inputBox.value;
    //get value of button text and store into a variable in place of inputboxval

    const geoAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${inputBoxVal}&limit=1&appid=${apiKey}`;
    fetch(geoAPI)
        .then(function (response) {
            return response.json();
        })
        .then(function (locationData) {
            if (locationData.length !== 0) {
                console.log(locationData)
                const lat = locationData[0].lat
                const lon = locationData[0].lon
                weatherFetch(lat, lon, locationData);
            }
        })

}


//Weather Data Fetch & call functions to build site
function weatherFetch(latitude, longitude, geoData) {
    const fiveDayWeatherAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;
    const currentDayWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`
    fetch(fiveDayWeatherAPI)
        .then(function (response) {
            return response.json();
        })
        .then(function (fiveDayWeatherData) {
            console.log(fiveDayWeatherData);
            buildFiveDay(fiveDayWeatherData);
        })
    fetch(currentDayWeatherAPI)
        .then(function (response) {
            return response.json();
        })
        .then(function (currentDayWeatherData) {
            console.log(currentDayWeatherData);
            buildCurrentDay(currentDayWeatherData, geoData);
        })
}

//Build current day portion of site
const buildCurrentDay = (currentDayData, geoData) => {
    const today = dayjs().format('dddd, MMMM D, YYYY');
    const state = geoData[0].state;
    const city = geoData[0].name;
    const country = geoData[0].country;
    const icon = currentDayData.weather[0].icon;
    const description = currentDayData.weather[0].description;
    const temperature = currentDayData.main.temp;
    const humidity = currentDayData.main.humidity;
    const wind = currentDayData.wind.speed;

    const placeEl = document.getElementById("name").textContent = `${city}, ${state} - ${country}`;
    const dateEl = document.getElementById("date").textContent = today;
    const descriptionEl = document.getElementById("description").textContent = description;
    const iconEl = document.getElementById("icon").setAttribute("src", `http://openweathermap.org/img/w/${icon}.png`);
    const tempEl = document.getElementById("temperature").textContent = `Temp: ${temperature}°F`;
    const humidEl = document.getElementById("humidity").textContent = `Humidity: ${humidity}%`;
    const windEl = document.getElementById("wind-speed").textContent = `Wind Speed: ${wind} mph`;
}

//Build five day portion of site
const buildFiveDay = fiveDayData => {

    //Remove Past:
    fiveDayDiv.innerHTML = "";

    const dailyDataArr = fiveDayData.list;
    const fiveDayArr = [];

    //Push data to array to get 5 day forecast
    for (let i = 4; i < dailyDataArr.length; i += 8) {
        fiveDayArr.push(dailyDataArr[i])
    }

    //Create five day forecast cards
    for (let i = 0; i < fiveDayArr.length; i++) {
        const date = fiveDayArr[i].dt_txt;
        const dateSlice = date.slice(5, 10)
        const icon = fiveDayArr[i].weather[0].icon;
        const temperature = fiveDayArr[i].main.temp;
        const wind = fiveDayArr[i].wind.speed;
        const humidity = fiveDayArr[i].main.humidity;

        const divCard = document.createElement("div");
        divCard.classList.add("card", "column", "is-one-sixth", "is-full-mobile", "day", "mx-1");

        const divCardContent = document.createElement("div");
        divCardContent.classList.add("card-content");
        divCard.appendChild(divCardContent);

        const divMedia = document.createElement("div");
        divMedia.classList.add("media");
        divCardContent.appendChild(divMedia);
        const divMediaLeft = document.createElement("div");
        divMediaLeft.classList.add("media-left");
        const divMediaContent = document.createElement("div");
        divMediaContent.classList.add("media-content");
        divMedia.appendChild(divMediaLeft);
        divMedia.appendChild(divMediaContent);
        const dateEl = document.createElement("p");
        dateEl.classList.add("title", "is-4");
        dateEl.textContent = dateSlice;
        divMediaContent.appendChild(dateEl);

        const figure = document.createElement("figure");
        figure.classList.add("image", "is-4by3");
        divCardContent.appendChild(figure);
        const iconEl = document.createElement("img");
        iconEl.setAttribute("src", `http://openweathermap.org/img/w/${icon}.png`);
        iconEl.setAttribute("alt", "icon of future weather conditions");
        figure.appendChild(iconEl);

        const divContent = document.createElement("div");
        divContent.classList.add("content");
        divCardContent.appendChild(divContent);
        const uList = document.createElement("ul");
        divContent.appendChild(uList);
        const tempEl = document.createElement("li");
        tempEl.textContent = `Temp: ${temperature}°F`;
        uList.appendChild(tempEl);
        const humidEl = document.createElement("li");
        humidEl.textContent = `Humidity: ${humidity}%`;
        uList.appendChild(humidEl);
        const windEl = document.createElement("li");
        windEl.textContent = `Wind Speed: ${wind} mph`;
        uList.appendChild(windEl);

        fiveDayDiv.appendChild(divCard);
    }
    console.log(fiveDayArr);
}

//save past searches to an array and save to local storage
function saveLocally(value) {
    if (pastSearchArr.includes(value)) {
        //move value to beginning of array
    } else {
        pastSearchArr.unshift(value);
    }

    localStorage.setItem("saved-searches", JSON.stringify(pastSearchArr));
    buildPriorSearches();
}

//get data from local storage and create buttons for previous searches
function buildPriorSearches() {
    searchDiv.innerHTML = "";
    const searchArray = JSON.parse(localStorage.getItem("saved-searches")) || [];
    if (searchArray.length > 0) {
        for (let i = 0; i < searchArray.length; i++) {
            const button = document.createElement("button");
            button.classList.add("button", "is-warning", "is-rounded", "space");
            button.textContent = searchArray[i];
            button.addEventListener("click", goFetchAgain);
            searchDiv.appendChild(button);
        }
    }
}