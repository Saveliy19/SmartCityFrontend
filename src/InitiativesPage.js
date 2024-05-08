import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import { Link, useParams } from 'react-router-dom';
// Импортируем стиль для скроллбара
import './ComplaintsPage.css'; 
import { useNavigate } from 'react-router-dom'; // Импорт useNavigate из react-router-dom

function InitiativesPage() {
  const [petitionsData, setPetitionsData] = useState([]);
  const { cityName } = useParams();
  const navigate = useNavigate(); // Использование useNavigate для навигации

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/get_city_petitions', {
          region: 'Республика Коми',
          name: cityName,
          is_initiative: true
        });
        setPetitionsData(response.data[0].petitions);
      } catch (error) {
        console.error('Произошла ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, [cityName]);

  const handleGoBack = () => {
    navigate(-1); // Функция, чтобы вернуться на предыдущую страницу
  };

  return (
    <div>
      <Header cityName={cityName} />
      <h2>Инициативы города {cityName}</h2>
      <div className="complaints-container">
        <ul className="complaints-list">
          {/* Разместите здесь петиции по 4 в строке */}
          {petitionsData.map((petition, index) => (
            (index % 4 === 0) ? 
              <div key={index} className="complaints-row">
                {petitionsData.slice(index, index + 4).map(petition => (
                  <p key={petition.id} className="complaint-item">
                  <Link to={`/petition/${petition.id}`} className="complaint-link">
                    <span className="complaint-id">ID: {petition.id}</span>
                    <span className="complaint-header">{petition.header}</span>
                    <p>{petition.address}</p>
                    <p style={{ color: petition.status === 'Решено' || petition.status === 'Одобрено' ? 'green' : petition.status === 'Отклонено' ? 'red' : 'blue', textTransform: 'uppercase' }}>{petition.status}</p>
                  </Link>
                </p>
                
                ))}
              </div>
            : null
          ))}
        </ul>
      </div>
      <button onClick={handleGoBack}>Назад</button> {/* Кнопка "Назад" */}
    </div>
  );
}


export default InitiativesPage;
