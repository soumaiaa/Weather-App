import React, { useState, useEffect } from 'react';
import Days from './Days'; // Importer le composant Days
import '../styles/Weather.css'; // Importer les styles CSS du composant Weather
import dayjs from 'dayjs'; // Importer dayjs pour la manipulation des dates
import axios from 'axios'; // Importer axios pour effectuer des requêtes HTTP
import TemperaturesChart from './TemperaturesChart';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY; // Clé d'API pour l'accès aux données météorologiques

function Weather({ cityName, weatherData, onCityChange }) {
    // Définir l'état pour stocker les cinq prochains jours
    const [nextFiveDays, setNextFiveDays] = useState([]);
    // Définir l'état pour stocker le jour sélectionné
    const [selectedDay, setSelectedDay] = useState(null);
    // Définir l'état pour stocker les données météorologiques du jour sélectionné
    const [selectedDayWeather, setSelectedDayWeather] = useState(null);

    // Effet secondaire pour mettre à jour les données lorsque les données météorologiques changent
    useEffect(() => {
        // Vérifier si des données météorologiques sont disponibles et s'il y a des prévisions pour au moins un jour
        if (weatherData && weatherData.forecast && weatherData.forecast.forecastday.length > 0) {
            // Extraire la date du premier jour de prévision et la formater pour obtenir le nom du jour
            setSelectedDay(dayjs(weatherData.forecast.forecastday[0].date).format('dddd'));
            // Mettre à jour les données météorologiques du jour sélectionné avec les données du premier jour de prévision
            setSelectedDayWeather(weatherData.forecast.forecastday[0]);
        }
    }, [weatherData]); // Déclencher l'effet secondaire lorsque les données météorologiques changent

    // Fonction pour gérer le clic sur un jour de la semaine
    const handleDayClick = (day) => {
        // Mettre à jour le jour sélectionné avec le jour cliqué
        setSelectedDay(day);
        // Trouver les données météorologiques du jour sélectionné à partir des données météorologiques disponibles
        const selectedDayData = weatherData?.forecast?.forecastday.find((item) => dayjs(item.date).format('dddd') === day);
        // Mettre à jour les données météorologiques du jour sélectionné avec les données trouvées
        setSelectedDayWeather(selectedDayData);

    };

    // Fonction pour gérer le changement du nom de la ville
    const handleCityInputChange = (event) => {
        // Appeler la fonction de gestion du changement de ville passée en tant que prop
        onCityChange(event);
    };

    // Effet secondaire pour récupérer les données météorologiques basées sur la géolocalisation de l'utilisateur
    useEffect(() => {
        // Vérifier si la géolocalisation est prise en charge par le navigateur
        if ("geolocation" in navigator) {
            // Obtenir les coordonnées de géolocalisation actuelles de l'utilisateur
            navigator.geolocation.getCurrentPosition(function (position) {
                const { latitude, longitude } = position.coords;
                // Effectuer une requête HTTP pour obtenir les données météorologiques basées sur les coordonnées de géolocalisation
                axios.get(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}`)
                    .then(response => {
                        // Extraire le nom de la ville à partir de la réponse
                        const city = response.data.location.name;
                        // Appeler la fonction de gestion du changement de ville pour mettre à jour le nom de la ville dans le composant parent
                        onCityChange({ target: { value: city } });
                    })
                    .catch(error => {
                        // Afficher une erreur en cas d'échec de la récupération des données météorologiques basées sur la géolocalisation
                        console.error('Erreur lors de la récupération des données météo basées sur la géolocalisation:', error);
                    });
            });
        } else {
            console.log("La géolocalisation n'est pas prise en charge par ce navigateur.");
        }
    }, []); // Déclencher l'effet secondaire une seule fois au chargement initial

    // Rendu du composant
    return (
        <div className="row">
            <div className="col s12 m6 push-m3">
                <div className="weather card blue-grey darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Météo</span>
                        {/* Champ de saisie pour entrer le nom de la ville avec gestion du changement */}
                        <input className='input' type="text" placeholder="Entrez le nom de la ville" value={cityName} onChange={handleCityInputChange} />
                        {/* Affichage de l'icône météo */}
                        <p><img className='image' src={selectedDayWeather && selectedDayWeather.day.condition.icon} alt="Weather icon" /></p>
                        {/* Affichage des données météorologiques du jour sélectionné */}
                        {selectedDayWeather && (
                            <>
                                <span className="temperature">{selectedDayWeather.day.avgtemp_c}°</span>
                                <div className="wind">Vent {selectedDayWeather.day.maxwind_kph} km/h ({selectedDayWeather.day.maxtemp_c
                                }°)</div>
                             
                            </>
                        )}
                    
                  

                
                    <TemperaturesChart temperatures={selectedDayWeather && selectedDayWeather.hour ? selectedDayWeather.hour.map(hour => hour.temp_c) : []} />
                    </div>
                    <Days
                        nextFiveDays={nextFiveDays}
                        onDayClick={handleDayClick}
                        selectedDay={selectedDay} />
                </div>
            </div>
        </div>
    );
}

export default Weather; // Exporter le composant Weather