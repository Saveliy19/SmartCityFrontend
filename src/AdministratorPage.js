import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header'; // Импорт компонента Header
import './AdministratorPage.css';
import adminIcon from './admin.png'; // Импорт изображения
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post('http://127.0.0.1:8000/get_admin_data', { token: token })
        .then(response => {
          setAdminData(response.data);
        })
        .catch(error => {
          if (error.response) {
            if (error.response.status === 401) {
              setErrorMessage('Возможно, Ваш сеанс закончился! Пожалуйста, перезайдите в систему!');
            } else if (error.response.status === 500) {
              setErrorMessage('Личный кабинет временно недоступен');
            } else {
              setErrorMessage('Произошла ошибка. Пожалуйста, попробуйте позже');
            }
          } else {
            setErrorMessage('Произошла ошибка. Пожалуйста, попробуйте позже');
          }
        });
    }
  }, []);

  return (
    <div className="admin-container">
      <Header />
      <h1 className="admin-title">Панель администратора</h1>
      {errorMessage ? (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      ) : adminData ? (
        <div className="admin-data">
          <img src={adminIcon} alt="Admin Icon" className="admin-icon" /> {/* Иконка администратора */}
          <p><strong>{adminData.last_name} {adminData.first_name} {adminData.patronymic}</strong></p>
          <p><strong>ID:</strong> {adminData.id}</p>
          <p><strong>Email:</strong> {adminData.email}</p>
          <p><strong>Регион</strong> {adminData.region}</p>
          <p><strong>Город</strong> {adminData.city}</p>
          
          {/* Кнопки для перехода на другие страницы */}
          <div className="admin-buttons">
            <Link to={`/admin-petitions/${adminData.region}/${adminData.city}`}>К петициям</Link>
            <Link to={`/admin-statistics/${adminData.region}/${adminData.city}`}>Статистика</Link>
          </div>
        </div>
      ) : (
        <p className="loading">Loading...</p>
      )}
    </div>
  );
};

export default AdminDashboard;
