import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';


function TemperaturesChart({ temperatures }) {
    // Référence à l'élément canvas
    const chartRef = useRef(null);
    // Variable pour stocker l'instance du graphique
    let chartInstance = null;

    // Utilisation de useEffect pour créer et mettre à jour le graphique
    useEffect(() => {
        // Vérifier si l'élément canvas et les données de température sont disponibles
        if (chartRef.current && temperatures.length > 0) {
            // Vérifier s'il existe une instance précédente de Chart.js
            if (chartInstance) {
                // Si oui, la détruire pour éviter les problèmes de réutilisation du canvas
                chartInstance.destroy();
            }

            // Obtenir le contexte 2D du canvas
            const ctx = chartRef.current.getContext('2d');

            // Créer une nouvelle instance de Chart.js
            // eslint-disable-next-line react-hooks/exhaustive-deps
            chartInstance = new Chart(ctx, {
                type: 'line', // Type de graphique (ligne)
                data: {
                    labels: temperatures.map((temp, index) =>`Hour ${index}`), // Libellés pour l'axe des X
                    datasets: [{
                        label: 'Temperature (°C)', // Étiquette du dataset
                        data: temperatures, // Données de température
                        fill: false, // Ne pas remplir la zone sous la ligne
                        borderColor: 'rgb(75, 192, 192)', // Couleur de la ligne
                        tension: 0.1 // Tension de la courbe
                    }]
                }
            });
        }

        // Fonction de nettoyage qui sera appelée lors du démontage du composant
        return () => {
            // Vérifier s'il existe une instance de Chart.js
            if (chartInstance) {
                // Si oui, la détruire pour libérer les ressources
                chartInstance.destroy();
            }
        };
    }, [temperatures]); // Déclencher l'effet à chaque changement des données de température

    // Rendu du composant
    return (
        <div>
            <canvas ref={chartRef} /> {/* Référence à l'élément canvas */}
        </div>
    );
}

export default TemperaturesChart;