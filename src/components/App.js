import React, { useState, useEffect } from 'react';
import Header from './Header'; // Importer le composant Header
import '../styles/App.css'; // Importer les styles CSS de l'application
import Weather from './Weather'; // Importer le composant Weather
import axios from 'axios'; // Importer axios pour effectuer des requêtes HTTP

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY; // Clé d'API pour l'accès aux données météorologiques

function App() {
    // Définir l'état pour stocker le nom de la ville
    const [cityName, setCityName] = useState('');
    // Définir l'état pour stocker les données météorologiques
    const [weatherData, setWeatherData] = useState(null);

    // Effet secondaire pour récupérer les données météorologiques
    useEffect(() => {
        // Fonction pour récupérer les données météorologiques
        const fetchWeatherData = async (city) => {
            try {
                // Effectuer une requête HTTP pour obtenir les données météorologiques de la ville
                const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5`);
                // Mettre à jour l'état avec les données météorologiques récupérées
                setWeatherData(response.data);
                // Afficher les données météorologiques dans la console
                console.log('Prévisions météo pour 5 jours:', response.data);
            } catch (error) {
                // Afficher une erreur en cas d'échec de la récupération des données météorologiques
                console.error('Erreur lors de la récupération des données météo:', error);
            }
        };

        // Définir la ville de Lyon par défaut si la géolocalisation est bloquée, refusée ou non prise en charge
        const defaultCity = "Lyon";

        // Vérifier si aucun nom de ville n'est saisi
        if (cityName === '') {
            // Vérifier si la géolocalisation est prise en charge par le navigateur
            if ("geolocation" in navigator) {
                // Obtenir les coordonnées de géolocalisation actuelles de l'utilisateur
                navigator.geolocation.getCurrentPosition(function (position) {
                    const { latitude, longitude } = position.coords;
                    // Effectuer une requête HTTP pour obtenir la ville basée sur les coordonnées de géolocalisation
                    axios.get(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}`)
                        .then(response => {
                            // Extraire le nom de la ville à partir de la réponse
                            const city = response.data.location.name;
                            // Appeler la fonction pour récupérer les données météorologiques de la ville
                            fetchWeatherData(city);
                        })
                        .catch(error => {
                            // Afficher une erreur en cas d'échec de la récupération des données météorologiques basées sur la géolocalisation
                            console.error('Erreur lors de la récupération des données météo:', error);
                            // Si la récupération par géolocalisation échoue, utiliser Lyon par défaut
                            fetchWeatherData(defaultCity);
                        });
                });
            } else {
                // Afficher un message si la géolocalisation n'est pas prise en charge par le navigateur
                console.log("La géolocalisation n'est pas prise en charge par ce navigateur.");
                // Si la géolocalisation n'est pas prise en charge, utiliser Lyon par défaut
                fetchWeatherData(defaultCity);
            }
        } else {
            // Si un nom de ville est saisi, appeler la fonction pour récupérer les données météorologiques de la ville saisie
            fetchWeatherData(cityName);
        }
    }, [cityName]); // Déclencher l'effet secondaire lorsque le nom de la ville change

    // Fonction pour gérer le changement du nom de la ville
    const handleCityInputChange = (event) => {
        // Mettre à jour l'état avec le nouveau nom de la ville
        setCityName(event.target.value);
    };

    // Rendu du composant
    return (
        <div className="App">
            <Header /> {/* Afficher le composant Header */}
            {/* Afficher le composant Weather avec les données météorologiques, le nom de la ville et la fonction de gestion du changement de ville */}
            <Weather
                weatherData={weatherData}
                cityName={cityName}
                onCityChange={handleCityInputChange}
            />
        </div>
    );
}

export default App; // Exporter le composant App