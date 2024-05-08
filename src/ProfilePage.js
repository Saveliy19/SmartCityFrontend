import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import userIcon from './user.png';
import './ProfilePage.css';
import leftArrow from './left.png';
import rightArrow from './right.png';
import { Link} from 'react-router-dom';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // Добавляем состояние для текущей страницы заявок
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

  const handlePageChange = (direction) => {
    if (direction === 'prev') {
      setCurrentPage(prevPage => prevPage - 1);
    } else if (direction === 'next') {
      setCurrentPage(prevPage => prevPage + 1);
    }
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
      {userData && userData.petitions && (
        <div className="petitions-container">
          <h2>Вот ваши заявки</h2>
          <div className="petitions-list-container">
            <ul className="petitions-list" style={{ transform: `translateX(-${currentPage * 100}%)` }}>
              {userData.petitions.map((petition) => (
                <p key={petition.id} className="petition-item">
                  <Link to={`/petition/${petition.id}`}><p><strong>Номер заявки:</strong> {petition.id}</p></Link>
                  <p><strong>Заголовок:</strong> {petition.header}</p>
                  <p style={{ color: petition.status === 'Решено' || petition.status === 'Одобрено' ? 'green' :
                   petition.status === 'В работе' || petition.status === 'На рассмотрении' ? 'yellow' :
                  petition.status === 'Отклонено' ? 'red' : 'blue', 
                  textTransform: 'uppercase' }}>
                  {petition.status}</p>
                  <p><strong>Адрес:</strong> {petition.address}</p>
                </p>
              ))}
            </ul>
          </div>
          {userData.petitions.length > 3 && (
            <div className="pagination-buttons">
            <img src={leftArrow} alt="Previous" onClick={() => handlePageChange('prev')} disabled={currentPage === 0} />
            <img src={rightArrow} alt="Next" onClick={() => handlePageChange('next')} disabled={currentPage === Math.ceil(userData.petitions.length / 3) - 1} />
          </div>
          )}
        </div>
      )}
      <button className="back-button" onClick={handleGoBack}>Назад</button>
    </div>
  );
};

export default ProfilePage;
