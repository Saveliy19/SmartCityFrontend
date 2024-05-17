import './AdminStatisticsPage.css'
import Header from './Header';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { Bar, Line } from 'react-chartjs-2';

const AnalyticsPage = () => {
  const { regionName, cityName } = useParams();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [rowsCount, setRowsCount] = useState(1);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [complaintChart, setComplaintChart] = useState(null);
  const [complaintChartRegion, setComplaintChartRegion] = useState(null);
  const [initiativeChart, setInitiativeChart] = useState(null);
  const [initiativeChartRegion, setInitiativeChartRegion] = useState(null);

  const [complaintsPerDay, setComplaintsPerDay] = useState({});
  const [initiativesPerDay, setInitiativesPerDay] = useState({});

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
      if (complaintChart) {
        complaintChart.clear();
        complaintChart.destroy();
      }

      if (complaintChartRegion) {
        complaintChartRegion.clear();
        complaintChartRegion.destroy();
      }

      if (initiativeChart) {
        initiativeChart.clear();
        initiativeChart.destroy();
      }

      if (initiativeChartRegion) {
        initiativeChartRegion.clear();
        initiativeChartRegion.destroy();
      }
      

      const categoriesCity = Object.keys(analyticsData.count_per_category_city);
      const countDataCity = Object.values(analyticsData.count_per_category_city);
      const categoriesRegion = Object.keys(analyticsData.count_per_category_region);
      const countDataRegion = Object.values(analyticsData.count_per_category_region);

      const initiativeCategoriesCity = Object.keys(analyticsData.count_per_category_city);
      const initiativeCountDataCity = Object.values(analyticsData.count_per_category_city);
      const initiativeCategoriesRegion = Object.keys(analyticsData.count_per_category_region);
      const initiativeCountDataRegion = Object.values(analyticsData.count_per_category_region);

      const updatedChartDataCity = {
        labels: categoriesCity,
        datasets: [
          {
            data: countDataCity,
            label: "Количество",
            borderColor: "#3333ff",
            backgroundColor: "rgba(0, 0, 255, 0.5)",
            fill: true
          }
        ]
      };

      const updatedInitiativeChartDataCity = {
        labels: initiativeCategoriesCity,
        datasets: [
          {
            data: initiativeCountDataCity,
            label: "Количество",
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
            label: "Количество",
            borderColor: "#ff3333",
            backgroundColor: "rgba(255, 0, 0, 0.5)",
            fill: true
          }
        ]
      };

      const updatedInitiativeChartDataRegion = {
        labels: initiativeCategoriesRegion,
        datasets: [
          {
            data: initiativeCountDataRegion,
            label: "Количество",
            borderColor: "#ff3333",
            backgroundColor: "rgba(255, 0, 0, 0.5)",
            fill: true
          }
        ]
      };

      // Создание нового графика
  const ctx = document.getElementById('complaintChart');
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
      width: 400, // Устанавливаем новую ширину графика
      height: 300, // Устанавливаем новую высоту графика
    }
  });
  setComplaintChart(newChart);

  const ctxInitiative = document.getElementById('initiativeChart');
  const newInitiativeChart = new Chart(ctxInitiative, {
    type: 'bar',
    data: updatedInitiativeChartDataCity,
    options: {
      // Заголовок графика
      plugins: {
        title: {
          display: true,
          text: 'Количество инициатив на категорию в городе',
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
  setInitiativeChart(newInitiativeChart);

  // Создание графика для региона
  const ctxRegion = document.getElementById('complaintChartRegion');
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
  setComplaintChartRegion(newChartRegion);

  const ctxInitiativeRegion = document.getElementById('initiativeChartRegion');
  const newInitiativeChartRegion = new Chart(ctxInitiativeRegion, {
    type: 'bar',
    data: updatedInitiativeChartDataRegion,
    options: {
      // Заголовок графика
      plugins: {
        title: {
          display: true,
          text: 'Количество инициатив на категорию в регионе',
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
  setInitiativeChartRegion(newInitiativeChartRegion);
  // Обновление данных о количестве заявок в день
  setComplaintsPerDay(analyticsData.comp_per_day || {});
  setInitiativesPerDay(analyticsData.init_per_day || {});

      }
    }, [analyticsData]);


    // Добавляем функцию для преобразования данных о количестве заявок в день в формат, подходящий для графика
    const combinedChartData = {
      labels: Object.keys(complaintsPerDay),
      datasets: [
          {
              label: 'Жалобы',
              data: Object.values(complaintsPerDay),
              fill: false,
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1
          },
          {
              label: 'Инициативы',
              data: Object.values(initiativesPerDay),
              fill: false,
              borderColor: 'rgb(54, 162, 235)',
              tension: 0.1
          }
      ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Устанавливаем значение false, чтобы можно было задать ширину и высоту графика в пикселях
    width: 400, // Устанавливаем новую ширину графика
    height: 300 // Устанавливаем новую высоту графика
};


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
        <div className='main-info-container'>
              <div>
            <h2>Статистика в городе {cityName}</h2>
            
          <div className='chart-container'>
              <div className='line-chart'>
                  <Line data={combinedChartData} options={chartOptions} />
              </div>
          </div>
          <div className='hist-container'>
            <div className='hist'>
              <canvas id="complaintChartRegion"></canvas>
            </div>
            <div className='hist'>
              <canvas id="complaintChart"></canvas>
            </div>
            <div className='hist'>
              <canvas id="initiativeChartRegion"></canvas>
            </div>
            <div className='hist'>
              <canvas id="initiativeChart"></canvas>
            </div>
          </div>
          
          
          <div className='most-popular-petitions-container'>
            <div className='petition-list-container'>
              <h3>Наиболее популярные жалобы в городе {cityName}: {rowsCount} записей</h3>
              <div className='petitions-container'>
              {analyticsData.most_popular_city_complaints.map(complaint => (
                <div className='info' key={complaint.id}>
                  <p><Link to={`/petition/${complaint.id}`}>ID: {complaint.id} </Link> - {complaint.header}</p>
                  <p>Категория: <strong>{complaint.category}</strong></p>
                  <p>Дата подачи: <strong>{complaint.submission_time}</strong></p>
                  <p>Количество подписей: <strong>{complaint.like_count}</strong></p>
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
                    <p>Категория: <strong>{initiative.category}</strong></p>
                  <p>Дата подачи: <strong>{initiative.submission_time}</strong></p>
                  <p>Количество подписей: <strong>{initiative.like_count}</strong></p>
                  </div>
                ))}
              </div> 
            </div>
          </div>
        </div>
        </div>
        
        )}
    </div>
  );

  

};

export default AnalyticsPage;
