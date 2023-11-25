
const searchDiv = document.getElementById("search");
const currenDayDiv = document.getElementById("current");
const fiveDayDiv = document.getElementById("five-day");


const searchBtn = document.getElementById("search-button")
searchBtn.addEventListener("click", goFetch);

const apiKey = "d39f86ad504a22388ea2e540968ab6af";

function initialPageLoad() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const reverseGeoAPI = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=${apiKey}`
            const fiveDayWeatherAPI = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
            const currentDayWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`

            fetch(reverseGeoAPI)
                .then(function (response) {
                    return response.json();
                })
                .then(function (geoData) {
                    console.log(geoData);
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
                        });
                });
        });
    };
};




//Geocoding API
function goFetch() {
    const inputBox = document.getElementById("input-box");
    const inputBoxVal = inputBox.value;
    const geoAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${inputBoxVal}&limit=1&appid=${apiKey}`;
    fetch(geoAPI)
        .then(function (response) {
            return response.json();
        })
        .then(function (locationData) {
            if (locationData.length !== 0) {
                console.log(locationData)
                const latitude = locationData[0].lat
                const longitude = locationData[0].lon
                const fiveDayWeatherAPI = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
                const currentDayWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
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
                        buildCurrentDay(currentDayWeatherData, locationData);
                    })
            }
        })

}

const buildFiveDay = fiveDayData => {
    const dailyDataArr = fiveDayData.list;
    const fiveDayArr = [];

    for (let i = 0; i < dailyDataArr.length; i += 8) {
        fiveDayArr.push(dailyDataArr[i])
    }

    for (let i = 0; i < fiveDayArr.length; i++) {
        const icon = fiveDayArr[i].weather[0].icon;
        const temp = fiveDayArr[i].main.temp;
        const wind = fiveDayArr[i].wind.speed;
        const humidity = fiveDayArr[i].main.humidity;

        //TODO: CREATE ELEMENTS AND APPEND CONTENT TO PAGE




    }
    console.log(fiveDayArr);
}

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

    //TODO: CREATE ELEMENTS AND APPEND CONTENT TO PAGE


}

initialPageLoad();