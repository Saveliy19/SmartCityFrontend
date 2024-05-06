import './CityPage.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Header'; // Импорт компонента Header

function CityPage({ cityName }) {
  const [cityData, setCityData] = useState(null);
  const [regionData, setRegionData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cityResponse = await axios.post('http://127.0.0.1:8000/get_brief_analysis', {
          type: 'city_name',
          name: cityName,
          period: 'month'
        });
        setCityData(cityResponse.data[0]);

        const regionResponse = await axios.post('http://127.0.0.1:8000/get_brief_analysis', {
          type: 'region',
          name: 'Республика Коми',
          period: 'month'
        });
        setRegionData(regionResponse.data[0]);
      } catch (error) {
        console.error('Произошла ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, [cityName]);

  return (
    <div>
      <Header />
      <div className="description-container">
        <div className="description">
          <div className="data-panel-container">
            <div className="data-panel">
              <div className="data-row">
                <div className="data-column">
                  {cityData ? (
                    <div>
                      <p style={{ fontWeight: 'bold' }}>Результаты работы сервиса в городе</p>
                      <p>Петиций: {cityData.petitions_count}</p>
                      <p>Инициатив: {cityData.initiatives_count}</p>
                      <p>Самая популярная категория жалоб: {cityData.most_popular_petition}</p>
                      <p>Самая популярная категория инициатив: {cityData.most_popular_initiative}</p>
                      <p>Решенных проблем: {cityData.solved_percent}%</p>
                      <p><progress value={cityData.solved_percent} max="100"></progress></p>
                      <p>Принятых инициатив: {cityData.accepted_percent}%</p>
                      <p><progress value={cityData.accepted_percent} max="100"></progress></p>
                    </div>
                  ) : (
                    <p>Загрузка данных...</p>
                  )}
                </div>
                <div className="data-column">
                  {regionData ? (
                    <div>
                      <p style={{ fontWeight: 'bold' }}>Результаты работы сервиса в регионе</p>
                      <p>Петиций: {regionData.petitions_count}</p>
                      <p>Инициатив: {regionData.initiatives_count}</p>
                      <p>Самая популярная категория жалоб: {regionData.most_popular_petition}</p>
                      <p>Самая популярная категория инициатив: {regionData.most_popular_initiative}</p>
                      <p>Решенных проблем: {regionData.solved_percent}%</p>
                      <p><progress value={regionData.solved_percent} max="100"></progress></p>
                      <p>Принятых инициатив: {regionData.accepted_percent}%</p>
                      <p><progress value={regionData.accepted_percent} max="100"></progress></p>
                    </div>
                  ) : (
                    <p>Загрузка данных...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="links">
            <div className="petitions">
              <Link to={`/petitions/${cityName}`}>К петициям</Link>
            </div>
            <div className="complaints">
              <Link to={`/initiatives/${cityName}`}>К инициативам</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CityPage;
