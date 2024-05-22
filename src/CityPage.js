import './CityPage.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function CityPage({ cityName }) {
  const [cityData, setCityData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/get_brief_analysis', {
          region: 'Республика Коми',
          name: cityName,
          period: 'year'
        });
        setCityData(response.data[0]);
      } catch (error) {
        if (error.response && error.response.status === 500) {
          setErrorMessage('Сервис жалоб и инициатив временно недоступен, попробуйте позже');
        } else {
          setErrorMessage('Сервис жалоб и инициатив временно недоступен, попробуйте позже');
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

  const renderBarChart = (dataObject, type) => {
    if (!dataObject || Object.keys(dataObject).length === 0) {
      return <p>Нет данных для отображения</p>;
    }

    const labels = Object.keys(dataObject);
    const dataValues = Object.values(dataObject);
    const backgroundColors = labels.map((label, index) => `hsl(${index * 360 / labels.length}, 70%, 50%)`);

    const data = {
      labels: labels,
      datasets: [
        {
          label: type,
          data: dataValues,
          backgroundColor: backgroundColors,
        },
      ],
    };

    const options = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: type,
        }
      },
      scales: {
        x: {
          beginAtZero: true,
        },
      },
    };

    return <div className="bar-container"><Bar data={data} options={options} /></div>;
  };

  return (
    <div className="city-page">
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
                <p style={{ fontWeight: 'bold' }}>Результаты работы сервиса в городе за год</p>
                <p>Инициатив получено: {Object.values(cityData.city_initiatives_count_per_status).reduce((a, b) => a + b, 0)}</p>
                <p>Жалоб получено: {Object.values(cityData.city_complaints_count_per_status).reduce((a, b) => a + b, 0)}</p>
                <div className='pies-container'>
                  {renderPieChart(cityData.city_complaints_count_per_status, 'Жалобы')}
                  {renderPieChart(cityData.city_initiatives_count_per_status, 'Инициативы')}
                </div>
                <div className='bars-container'>
                  {renderBarChart(cityData.most_popular_city_complaints, 'Топ 3 самых популярных категорий жалоб')}
                  {renderBarChart(cityData.most_popular_city_initiatives, 'Топ 3 самых популярных категорий инициатив')}
                </div>
              </div>
            ) : (
              <p>Загрузка данных...</p>
            )}
          </div>
          <div className="data-column">
            {cityData ? (
              <div>
                <p style={{ fontWeight: 'bold' }}>Результаты работы сервиса в регионе за год</p>
                <p>Инициатив получено: {Object.values(cityData.region_initiatives_count_per_status).reduce((a, b) => a + b, 0)}</p>
                <p>Жалоб получено: {Object.values(cityData.region_complaints_count_per_status).reduce((a, b) => a + b, 0)}</p>
                <div className='pies-container'>
                  {renderPieChart(cityData.region_complaints_count_per_status, 'Жалобы')}
                  {renderPieChart(cityData.region_initiatives_count_per_status, 'Инициативы')}
                </div>
                  {renderBarChart(cityData.most_popular_region_complaints, 'Топ 3 самых популярных категорий жалоб')}
                  {renderBarChart(cityData.most_popular_region_initiatives, 'Топ 3 самых популярных категорий инициатив')}
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
