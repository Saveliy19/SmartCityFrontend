import './CityPage.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import logo from './logo.png';

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
      <header className="header-container">
        <div className="header-left">
          <Link to="/">
            <img src={logo} alt="Логотип Умного Города" />
          </Link>
        </div>
        <div className="header-center">
          <h1>Умный Город.{ cityName }</h1>
        </div>
        <div className="header-right">
          <Link to="/login" className="login-button">Войти</Link>
        </div>
      </header>
      <div className="description-container">
        <div className="description">
          <div className="data-panel">
            <div className="data-row">
              <div className="data-column">
                <h3>Статистика работы сервиса в городе за месяц</h3>
                {cityData ? (
                  <div>
                    <p>Петиций: {cityData.petitions_count}</p>
                    <p>Инициатив: {cityData.initiatives_count}</p>
                    <p>Самая популярная категория жалоб: {cityData.most_popular_petition}</p>
                    <p>Самая популярная категория инициатив: {cityData.most_popular_initiative}</p>
                    <p>Процент решенных: {cityData.solved_percent}%</p>
                    <p>Процент принятых: {cityData.accepted_percent}%</p>
                  </div>
                ) : (
                  <p>Загрузка данных...</p>
                )}
              </div>
              <div className="data-column">
                <h3>Статистика работы сервиса в регионе за месяц</h3>
                {regionData ? (
                  <div>
                    <p>Петиций: {regionData.petitions_count}</p>
                    <p>Инициатив: {regionData.initiatives_count}</p>
                    <p>Самая популярная категория жалоб: {regionData.most_popular_petition}</p>
                    <p>Самая популярная категория инициатив: {regionData.most_popular_initiative}</p>
                    <p>Процент решенных: {regionData.solved_percent}%</p>
                    <p>Процент принятых: {regionData.accepted_percent}%</p>
                  </div>
                ) : (
                  <p>Загрузка данных...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CityPage;
