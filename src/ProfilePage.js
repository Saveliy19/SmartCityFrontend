import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import userIcon from './user.png';
import leftArrow from './left.png';
import rightArrow from './right.png';
import { Link } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
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
            setError('Произошла ошибка при загрузке данных пользователя. Пожалуйста, попробуйте позже.');
          }
        });
    }
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCreatePetition = () => {
    navigate('/create-petition');
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
        <div>
          <div className="button-container">
            <button className='profile-button' onClick={handleGoBack}>Назад</button>
            <button className='red-button' onClick={handleCreatePetition}>Создать петицию</button>
          </div>
          <h2>Вот ваши заявки</h2>
          <div className="petitions-list-container">
            <ul className="petitions-list" style={{ transform: `translateX(-${currentPage * 100}%)` }}>
              {userData.petitions.sort((a, b) => b.id - a.id).map((petition) => (
                <li key={petition.id} className="petition-item">
                  <Link to={`/petition/${petition.id}`}><p><strong>Номер заявки:</strong> {petition.id}</p></Link>
                  <p><strong>Заголовок:</strong> {petition.header}</p>
                  <p style={{ color: petition.status === 'Решено' || petition.status === 'Одобрено' ? 'green' :
                   petition.status === 'В работе' || petition.status === 'На рассмотрении' ? 'orange' :
                  petition.status === 'Отклонено' ? 'red' : 'blue', 
                  textTransform: 'uppercase' }}>
                  {petition.status}</p>
                  <p><strong>Адрес:</strong> {petition.address}</p>
                  <p><strong>Подписей:</strong> {petition.likes}</p>
                </li>
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
    </div>
  );
};

export default ProfilePage;
