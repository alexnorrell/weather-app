const apiKey = '2f2abf6cd511bbc0a29a57e04c20a501'
const baseURL = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}'
let currentCity = ''

const cityInput = document.getElementById('city-input')
const searchBtn = document.getElementById('search')

searchBtn.addEventListener('click', function () {
    console.log(cityInput.value)
    getCityGeoLocation(cityInput.value)
})

function getCityGeoLocation(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
        .then((responce) => responce.json())
        .then((data) => {
            console.log(data.city.coord)
            getWeather(data.city.coord)
        })
        .catch((error) => console.log(error))

}

function getWeather(coord) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`)
        .then((responce) => responce.json())
        .then((data) => {
            const nextFive = []
            for (let i = 3; i < data.list.length; i += 8) {
                let item = data.list[i]
                nextFive.push({
                    date: item.dt_txt.split(' ')[0].split('-').join('/'),
                    temp: item.main.temp,
                    humidity: item.main.humidity,
                    wind: item.wind.speed,
                    icon: item.weather[0].icon
                })
            }
            console.log(nextFive)
        })
        .catch((error) => console.log(error))
}


