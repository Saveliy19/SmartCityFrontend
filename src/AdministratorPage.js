import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header'; // Импорт компонента Header
import './AdministratorPage.css';
import adminIcon from './admin.png'; // Импорт изображения
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post('http://127.0.0.1:8000/get_admin_data', { token: token })
        .then(response => {
          setAdminData(response.data);
        })
        .catch(error => {
          console.error('Error fetching admin data:', error);
        });
    }
  }, []);

  return (
    <div className="admin-container">
      <Header />
      <h1 className="admin-title">Панель администратора</h1>
      {adminData ? (
        <div className="admin-data">
          <img src={adminIcon} alt="Admin Icon" className="admin-icon" /> {/* Иконка администратора */}
          <p>ID: {adminData.id}</p>
          <p>Email: {adminData.email}</p>
          <p><strong>Фамилия</strong> {adminData.last_name}</p>
          <p><strong>Имя</strong> {adminData.first_name}</p>
          <p><strong>Отчество</strong> {adminData.patronymic}</p>
          <p><strong>Регион</strong> {adminData.region}</p>
          <p><strong>Город</strong> {adminData.city}</p>
          

          {/* Кнопки для перехода на другие страницы */}
          <div className="admin-buttons">
            <Link to={`/admin-petitions/${adminData.city}`}>Жалобы</Link>
            <Link to={`/admin-initiatives/${adminData.city}`}>Инициативы</Link>
            <Link to="/admin-statistics">Статистика</Link>
          </div>
        </div>
      ) : (
        <p className="loading">Loading...</p>
      )}
    </div>
  );
};

export default AdminDashboard;
