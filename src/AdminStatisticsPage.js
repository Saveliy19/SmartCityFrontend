import './AdminStatisticsPage.css'
import Header from './Header';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

const AnalyticsPage = () => {
  const { regionName, cityName } = useParams();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [rowsCount, setRowsCount] = useState(1);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [myChart, setMyChart] = useState(null);
  const [myChartRegion, setMyChartRegion] = useState(null);

  const userToken = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/get_detailed_analysis',
        {
          region_name: regionName,
          city_name: cityName,
          start_time: startTime,
          end_time: endTime,
          rows_count: rowsCount,
          user_token: userToken,
        }
      );
      setAnalyticsData(response.data[0]);

    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Проверяем, есть ли данные для аналитики
    if (analyticsData) {
      // Удаление предыдущего графика, если он был
      if (myChart) {
        myChart.clear();
        myChart.destroy();
      }

      if (myChartRegion) {
        myChartRegion.clear();
        myChartRegion.destroy();
      }
      const categoriesCity = Object.keys(analyticsData.count_per_category_city);
      const countDataCity = Object.values(analyticsData.count_per_category_city);
      const categoriesRegion = Object.keys(analyticsData.count_per_category_region);
      const countDataRegion = Object.values(analyticsData.count_per_category_region);

      const updatedChartDataCity = {
        labels: categoriesCity,
        datasets: [
          {
            data: countDataCity,
            label: "Количество по категориям в городе",
            borderColor: "#3333ff",
            backgroundColor: "rgba(0, 0, 255, 0.5)",
            fill: true
          }
        ]
      };
      
      const updatedChartDataRegion = {
        labels: categoriesRegion,
        datasets: [
          {
            data: countDataRegion,
            label: "Количество по категориям в регионе",
            borderColor: "#ff3333",
            backgroundColor: "rgba(255, 0, 0, 0.5)",
            fill: true
          }
        ]
      };

      // Создание нового графика
const ctx = document.getElementById('myChart');
const newChart = new Chart(ctx, {
  type: 'bar',
  data: updatedChartDataCity,
  options: {
    // Заголовок графика
    plugins: {
      title: {
        display: true,
        text: 'Количество жалоб на категорию в городе',
        font: {
          size: 10,
          weight: 'bold'
        }
      }
    },
    // Подпись оси X
    scales: {
      x: {
        title: {
          display: true,
          text: 'Категория'
        }
      },
      // Подпись оси Y
      y: {
        title: {
          display: true,
          text: 'Количество'
        }
      }
    },
    // Ваши другие настройки графика
    responsive: true,
    maintainAspectRatio: false, // Изменение размера графика без сохранения пропорций
    width: 20, // Устанавливаем новую ширину графика
    height: 10, // Устанавливаем новую высоту графика
  }
});
setMyChart(newChart);

// Создание графика для региона
const ctxRegion = document.getElementById('myChartRegion');
const newChartRegion = new Chart(ctxRegion, {
  type: 'bar',
  data: updatedChartDataRegion,
  options: {
    // Заголовок графика
    plugins: {
      title: {
        display: true,
        text: 'Количество жалоб на категорию в регионе',
        font: {
          size: 10,
          weight: 'bold'
        }
      }
    },
    // Подпись оси X
    scales: {
      x: {
        title: {
          display: true,
          text: 'Категория'
        }
      },
      // Подпись оси Y
      y: {
        title: {
          display: true,
          text: 'Количество'
        }
      }
    },
    // Ваши другие настройки графика
    responsive: true,
    maintainAspectRatio: false, // Изменение размера графика без сохранения пропорций
    width: 400, // Устанавливаем новую ширину графика
    height: 300, // Устанавливаем новую высоту графика
  }
});
setMyChartRegion(newChartRegion);
    }
  }, [analyticsData]);


  return (
    <div>
      <Header />
      
  
      <div className='param-container'>
        <form onSubmit={handleSubmit}>
            <label htmlFor="startTime">Начало периода: </label>
            <input
                type="datetime-local"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
            />
            <label htmlFor="endTime">Конец периода: </label>
            <input
                type="datetime-local"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
            />
            <label htmlFor="rowsCount">Количество наиболее популярных петиций: </label>
            <input
                type="number"
                id="rowsCount"
                value={rowsCount}
                onChange={(e) => setRowsCount(parseInt(e.target.value))}
            />
            <button type="submit" disabled={loading}>Получить детальный отчет</button>
        </form>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      {analyticsData && (
        
        <div>
          <h2>Статистика:</h2>
          <div className='hist-container'>
            <div className='hist'>
              <canvas id="myChart"></canvas>
            </div>
            <div className='hist'>
              <canvas id="myChartRegion"></canvas>
            </div>
          </div>
          
          
          <div className='most-popular-petitions-container'>
            <div className='petition-list-container'>
              <h3>Наиболее популярные жалобы в городе {cityName}: {rowsCount} записей</h3>
              <div className='petitions-container'>
              {analyticsData.most_popular_city_complaints.map(complaint => (
                <div className='info' key={complaint.id}>
                  <p><Link to={`/petition/${complaint.id}`}>ID: {complaint.id} </Link> - {complaint.header}</p>
                </div>
                ))}
              </div>
            </div>

            <div className='petition-list-container'>
              <h3>Наиболее популярные инициативы в городе {cityName}: {rowsCount} записей</h3>
              <div className='petitions-container'>
                {analyticsData.most_popular_city_initiatives.map(initiative => (
                  <div className='info' key={initiative.id}>
                    <p><Link to={`/petition/${initiative.id}`}>ID: {initiative.id}</Link> - {initiative.header}</p>
                  </div>
                ))}
              </div> 
            </div>
          </div>
          

        </div>)}
    </div>
  );

  

};

export default AnalyticsPage;
