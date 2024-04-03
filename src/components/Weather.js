import React, { useState, useEffect } from 'react';
import Days from './Days';
import '../styles/Weather.css';
import image from '../assets/icons/sun.svg';
import axios from 'axios';
import dayjs from 'dayjs';

const API_KEY = '4143a0e9c20e447cbf7112046240304';

function Weather() {
    const [weatherData, setWeatherData] = useState(null);
    const [nextFiveDays, setNextFiveDays] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedDayWeather, setSelectedDayWeather] = useState(null);
    const [cityName, setCityName] = useState(''); // État pour stocker le nom de la ville saisie par l'utilisateur

    useEffect(() => {
        const fetchWeatherData = async (city) => {
            try {
                const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5`);
                setWeatherData(response.data);
                console.log('Prévisions météo pour 5 jours:', response.data);

                // Calculer les 5 prochains jours
                const today = dayjs();
                const nextDays = [];
                for (let i = 0; i < 5; i++) {
                    const nextDay = today.add(i, 'day').format('dddd');
                    nextDays.push(nextDay);
                }
                setNextFiveDays(nextDays);
            } catch (error) {
                console.error('Erreur lors de la récupération des données météo:', error);
            }
        };

        // Si cityName est vide, alors on utilise la géolocalisation
        if (cityName === '') {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    const { latitude, longitude } = position.coords;
                    axios.get(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}`)
                        .then(response => {
                            const city = response.data.location.name;
                            fetchWeatherData(city);
                        })
                        .catch(error => {
                            console.error('Erreur lors de la récupération des données météo:', error);
                        });
                });
            } else {
                console.log("La géolocalisation n'est pas prise en charge par ce navigateur.");
            }
        } else {
            // Sinon, on utilise le nom de la ville saisi par l'utilisateur
            fetchWeatherData(cityName);
        }
    }, [cityName]);

    useEffect(() => {
        if (weatherData && weatherData.forecast && weatherData.forecast.forecastday.length > 0) {
            setSelectedDay(dayjs(weatherData.forecast.forecastday[0].date).format('dddd'));
            setSelectedDayWeather(weatherData.forecast.forecastday[0]);
        }
    }, [weatherData]);

    const handleDayClick = (day) => {
        setSelectedDay(day);
        const selectedDayData = weatherData?.forecast?.forecastday.find((item) => dayjs(item.date).format('dddd') === day);
        setSelectedDayWeather(selectedDayData);
    };

    const handleCityInputChange = (event) => {
        setCityName(event.target.value);
    };

    return (
        <div className="row">
            <div className="col s12 m6 push-m3">
                <div className="weather card blue-grey darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Météo</span>
                        <input className='input' type="text" placeholder="Entrez le nom de la ville" value={cityName} onChange={handleCityInputChange} />
                        <p><img className='image' src={selectedDayWeather && selectedDayWeather.day.condition.icon} alt="Weather icon" /></p>
                        {selectedDayWeather && (
                            <>                             
                                <span className="temperature">{selectedDayWeather.day.avgtemp_c}°</span>
                                <div className="wind">Vent {selectedDayWeather.day.maxwind_kph} km/h ({selectedDayWeather.day.wind_dir})</div>
                                {/* Afficher d'autres données météorologiques selon vos besoins */}
                            </>
                        )}
                    </div>
                    <Days nextFiveDays={nextFiveDays} onDayClick={handleDayClick} selectedDay={selectedDay} />
                </div>
            </div>
        </div>
    );
}

export default Weather;