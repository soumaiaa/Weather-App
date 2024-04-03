import React from 'react';
import dayjs from 'dayjs';

function Days({ nextFiveDays, onDayClick, selectedDay  }) {
  // Obtenir la date actuelle
  const currentDate = dayjs();

  // Tableau des noms des jours de la semaine
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Index du jour actuel (0 pour dimanche, 1 pour lundi, etc.)
  const currentDayIndex = currentDate.day();

  // Réorganiser le tableau pour commencer par aujourd'hui
  const reorderedDaysOfWeek = [
    ...daysOfWeek.slice(currentDayIndex),  // Les jours après aujourd'hui
    ...daysOfWeek.slice(0, currentDayIndex) // Les jours avant aujourd'hui
  ];

  // Extraire les cinq premiers jours à partir de l'index actuel
  const nextFiveDaysArray = reorderedDaysOfWeek.slice(0, 5); // Renommez la variable locale pour éviter le conflit

  const handleClick = (day) => {
    // console.log('Clicked day:', day);
    // Appeler la fonction onDayClick avec le jour cliqué
    onDayClick(day);
  };

  return (
    <div className="card-action">
      {nextFiveDaysArray.map((day, index) => (
        <a key={index} href="#" style={{ fontWeight: day === selectedDay ? 'bold' : 'normal' }} onClick={() => handleClick(day)}>
          {day}
        </a>
      ))}
    </div>
  );
}

export default Days;