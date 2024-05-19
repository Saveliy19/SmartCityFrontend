import './CityPage.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function CityPage({ cityName }) {
  const [cityData, setCityData] = useState(null);
  const [regionData, setRegionData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

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
        if (error.response && error.response.status === 500) {
          setErrorMessage('Сервис жалоб и инициатив временно недоступен');
        } else {
          console.error('Произошла ошибка при загрузке данных:', error);
          setErrorMessage('Произошла ошибка при загрузке данных');
        }
      }
    };

    fetchData();
  }, [cityName]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const renderPieChart = (dataObject, type) => {
    if (!dataObject || Object.keys(dataObject).length === 0) {
      return <p>Нет данных для отображения</p>;
    }
  
    const statusColors = {
      'На модерации': '#47e3ff', // Синий
      'На рассмотрении': '#ffe657', // Оранжевый
      'Отклонено': '#dc3545', // Красный
      'В работе': '#ffe657', // Оранжевый
      'Решено': '#65ff57', // Зеленый
      'Одобрено': '#65ff57' // Зеленый
    };
  
    const labels = Object.keys(dataObject);
    const dataValues = Object.values(dataObject);
    const backgroundColors = labels.map(label => statusColors[label]);
  
    const data = {
      labels: labels,
      datasets: [
        {
          data: dataValues,
          backgroundColor: backgroundColors,
        },
      ],
    };
  
    const options = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || '';
              const value = context.raw || 0;
              return `${label}: ${value}`;
            },
          },
        },
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: type,
        }
      },
    };
  
    return <div className="pie-container"><Pie data={data} options={options} /></div>;
  };

  return (
    <div>
      <Header />
      <div className='city-page-content'>
        <h1>{cityName}</h1>
        {errorMessage && (
          <div className="error-message">
            <p>{errorMessage}</p>
          </div>
        )}
        <div className="data-panel-container">
          <div className="data-column">
            {cityData ? (
              <div>
                <p style={{ fontWeight: 'bold' }}>Результаты работы сервиса в городе за месяц</p>
                <p>Петиций: {cityData.petitions_count}</p>
                <p>Инициатив: {cityData.initiatives_count}</p>
                <p>Самая популярная категория жалоб: {cityData.most_popular_petition}</p>
                <p>Самая популярная категория инициатив: {cityData.most_popular_initiative}</p>
                <div className='pies-container'>
                  {renderPieChart(cityData.complaints_per_status, 'Жалобы')}
                  {renderPieChart(cityData.initiatives_per_status, 'Инициативы')}
                </div>
              </div>
            ) : (
              <p>Загрузка данных...</p>
            )}
          </div>
          <div className="data-column">
            {regionData ? (
              <div>
                <p style={{ fontWeight: 'bold' }}>Результаты работы сервиса в регионе за месяц</p>
                <p>Петиций: {regionData.petitions_count}</p>
                <p>Инициатив: {regionData.initiatives_count}</p>
                <p>Самая популярная категория жалоб: {regionData.most_popular_petition}</p>
                <p>Самая популярная категория инициатив: {regionData.most_popular_initiative}</p>
                <div className='pies-container'>
                  {renderPieChart(regionData.complaints_per_status, 'Жалобы')}
                  {renderPieChart(regionData.initiatives_per_status, 'Инициативы')}
                </div>
              </div>
            ) : (
              <p>Загрузка данных...</p>
            )}
          </div>
        </div>
        <div className="links">
          <div className="petitions">
            <Link to={`/petitions/${cityName}`}>К жалобам</Link>
          </div>
          <button className='button-back' onClick={handleGoBack}>Назад</button>
          <div className="complaints">
            <Link to={`/initiatives/${cityName}`}>К инициативам</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CityPage;
