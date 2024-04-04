// Weather.js
import React, { useState, useEffect } from 'react';
import Days from './Days'; // Importer le composant Days
import '../styles/Weather.css'; // Importer les styles CSS du composant Weather
import dayjs from 'dayjs'; // Importer dayjs pour la manipulation des dates

function Weather({ weatherData, cityName, onCityChange }) {
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
                            <div className="wind">Vent {selectedDayWeather.day.maxwind_kph} km/h ({selectedDayWeather.day.wind_dir})</div>
                            {/* Afficher d'autres données météorologiques selon vos besoins */}
                        </>
                    )}
                </div>
                {/* Afficher les jours de la semaine avec possibilité de sélection */}
                <Days nextFiveDays={nextFiveDays} onDayClick={handleDayClick} selectedDay={selectedDay} />
            </div>
        </div>
    </div>
);
}

export default Weather; // Exporter le composant Weather
