import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import { Link, useParams } from 'react-router-dom';
// Импортируем стиль для скроллбара
import './ComplaintsPage.css'; 

function ComplaintsPage() {
  const [petitionsData, setPetitionsData] = useState([]);
  const { cityName } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/get_city_petitions', {
          region: 'Республика Коми',
          name: cityName
        });
        setPetitionsData(response.data[0].petitions);
      } catch (error) {
        console.error('Произошла ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, [cityName]);

  return (
    <div>
      <Header />
      <h2>Петиции города {cityName}</h2>
      <div className="complaints-container">
        <ul className="complaints-list">
          {/* Разместите здесь петиции по 4 в строке */}
          {petitionsData.map((petition, index) => (
            (index % 4 === 0) ? 
              <div key={index} className="complaints-row">
                {petitionsData.slice(index, index + 4).map(petition => (
                  <p key={petition.id} className="complaint-item">
                  <Link to={`/complaint/${petition.id}`} className="complaint-link">
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
    </div>
  );
}


export default ComplaintsPage;
