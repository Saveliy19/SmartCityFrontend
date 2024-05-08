import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import userIcon from './user.png';
import './ProfilePage.css'

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenData = localStorage.getItem('token');
    if (tokenData) {
      axios.post('http://127.0.0.1:8000/me', { token: tokenData })
        .then(response => {
          setUserData(response.data);
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            setError('Ошибка: не авторизован! Пожалуйста, нажмите кнопку "Выйти" и перезайдите в систему.');
          } else {
            console.error('Error fetching user data:', error);
          }
        });
    }
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <Header />
      <div className="profile-page">
        {error ? (
          <p className="error">{error}</p>
        ) : userData ? (
          <div className="user-info-container">
            <div className="user-info">
              <div className="user-icon">
                <img src={userIcon} alt="User" className="profile-image" />
              </div>
              <p className="user-name">{`${userData.last_name} ${userData.first_name} ${userData.patronymic}`}</p>
              <p>ID пользователя: {userData.id}</p>
              <p><strong>Регион:</strong> {userData.region}</p>
              <p><strong>Город:</strong> {userData.city}</p>
              <p><strong>Рейтинг:</strong> {userData.rating}</p>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        
      </div>
      <button className="back-button" onClick={handleGoBack}>Назад</button>
    </div>
  );
};

export default ProfilePage;
