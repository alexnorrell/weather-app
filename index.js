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
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`)
        .then((responce) => responce.json())
        .then((data) => {
            let today = {
                date: data.list[0].dt_txt.split(' ')[0].split('-').join('/'), 
                temp: data.list[0].main.temp,
                humidity: data.list[0].main.humidity,
                wind: data.list[0].wind.speed,
                icon: data.list[0].weather[0].icon
            }
             getWeather(data.city.coord, today, city)
          
        })
        .catch((error) => console.log(error))

}

function getWeather(coord, today, city) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=imperial`)
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
            updatePage({city, today, nextFive})
            saveToLocalStorage({city, today, nextFive})
            populateCities()
        })
        .catch((error) => console.log(error))
}

function updatePage(data){
    console.log(data)
    let todayContainer = document.querySelector('.today')
    let todayContent = `
                <h2>${data.city} (${data.today.date}) <img src="https://openweathermap.org/img/w/${data.today.icon}.png"></h2>
                <p>Temp: ${data.today.temp} &deg;F</p>
                <p>Wind: ${data.today.wind} MPH</p>
                <p>Humidity: ${data.today.humidity}%</p>
    `
    todayContainer.innerHTML = todayContent;
    const nextFiveContainer = document.querySelector('.items-container')
    let nextFiveContent = ''
    for (const day of data.nextFive) {
        let div= `         
    <div>
        <h3>${day.date}</h3>
        <h4><img src="https://openweathermap.org/img/w/${day.icon}.png"></h4>
        <p>Temp: ${day.temp} &deg;F</p>
        <p>Wind: ${day.wind} MPH</p>
        <p>Humidity: ${day.humidity}%</p>
    </div>`
    nextFiveContent += div
    }
    nextFiveContainer.innerHTML=nextFiveContent;
}

function saveToLocalStorage(data){
    let db = JSON.parse(localStorage.getItem('cities_db')) ||[]
    db.push(data)
    localStorage.setItem('cities_db', JSON.stringify(db))
}

function readLocalStorage(){
    let db = JSON.parse(localStorage.getItem('cities_db'))
    return db
}

function populateCities(){
    let citiesContainer = document.querySelector('.left-container ul')
    let dbData = readLocalStorage()
    citiesContainer.innerHTML =''
    dbData.forEach(el => {
        let li = document.createElement('li')
        li.textContent =el.city
        li.addEventListener('click', function(event){
            var city= event.target.textContent
            getCityGeoLocation(city)
        })
        citiesContainer.appendChild(li)
    });
}

populateCities()