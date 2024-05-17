import './AdminStatisticsPage.css';
import Header from './Header';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const AnalyticsPage = () => {
  const { regionName, cityName } = useParams();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [rowsCount, setRowsCount] = useState(1);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    if (analyticsData) {
      const categoriesCity = Object.keys(analyticsData.count_per_category_city);
      const countDataCity = Object.values(analyticsData.count_per_category_city);
      const categoriesRegion = Object.keys(analyticsData.count_per_category_region);
      const countDataRegion = Object.values(analyticsData.count_per_category_region);

      const updatedChartDataCity = {
        labels: categoriesCity,
        datasets: [
          {
            data: countDataCity,
            label: "Количество жалоб в городе",
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
            label: "Количество жалоб в регионе",
            borderColor: "#ff3333",
            backgroundColor: "rgba(255, 0, 0, 0.5)",
            fill: true
          }
        ]
      };

      const initiativeCategoriesCity = Object.keys(analyticsData.init_count_per_category_city);
      const initiativeCountDataCity = Object.values(analyticsData.init_count_per_category_city);
      const initiativeCategoriesRegion = Object.keys(analyticsData.init_count_per_category_region);
      const initiativeCountDataRegion = Object.values(analyticsData.init_count_per_category_region);

      const updatedInitiativeChartDataCity = {
        labels: initiativeCategoriesCity,
        datasets: [
          {
            data: initiativeCountDataCity,
            label: "Количество инициатив в городе",
            borderColor: "#3333ff",
            backgroundColor: "rgba(0, 0, 255, 0.5)",
            fill: true
          }
        ]
      };

      const updatedInitiativeChartDataRegion = {
        labels: initiativeCategoriesRegion,
        datasets: [
          {
            data: initiativeCountDataRegion,
            label: "Количество инициатив в регионе",
            borderColor: "#ff3333",
            backgroundColor: "rgba(255, 0, 0, 0.5)",
            fill: true
          }
        ]
      };

      setComplaintChartData(updatedChartDataCity);
      setInitiativeChartData(updatedInitiativeChartDataCity);
      setComplaintChartRegionData(updatedChartDataRegion);
      setInitiativeChartRegionData(updatedInitiativeChartDataRegion);

      setComplaintsPerDay(analyticsData.comp_per_day || {});
      setInitiativesPerDay(analyticsData.init_per_day || {});
    }
  }, [analyticsData]);

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
    maintainAspectRatio: false,
    width: 400,
    height: 300
  };

  const [complaintChartData, setComplaintChartData] = useState({});
  const [initiativeChartData, setInitiativeChartData] = useState({});
  const [complaintChartRegionData, setComplaintChartRegionData] = useState({});
  const [initiativeChartRegionData, setInitiativeChartRegionData] = useState({});

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
          <h2>Статистика в городе {cityName}</h2>
          <div className='chart-container'>
            <div className='line-chart'>
              <Line data={combinedChartData} options={chartOptions} />
            </div>
          </div>
          <div className='hist-container'>
            {complaintChartRegionData.labels && (
              <div className='hist'>
                <Bar data={complaintChartRegionData} options={chartOptions} />
              </div>
            )}
            {complaintChartData.labels && (
              <div className='hist'>
                <Bar data={complaintChartData} options={chartOptions} />
              </div>
            )}
            {initiativeChartRegionData.labels && (
              <div className='hist'>
                <Bar data={initiativeChartRegionData} options={chartOptions} />
              </div>
            )}
            {initiativeChartData.labels && (
              <div className='hist'>
                <Bar data={initiativeChartData} options={chartOptions} />
              </div>
            )}
          </div>
          <div className='most-popular-petitions-container'>
            <div className='petition-list-container'>
              <h3>Наиболее популярные жалобы в городе {cityName}: {rowsCount}</h3>
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
              <h3>Наиболее популярные инициативы в городе {cityName}: {rowsCount}</h3>
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
      )}
    </div>
  );
};

export default AnalyticsPage;
