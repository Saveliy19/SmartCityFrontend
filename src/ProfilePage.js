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
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPetitions, setFilteredPetitions] = useState([]);
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

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPetitions(userData ? userData.petitions : []);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = (userData ? userData.petitions : []).filter(petition =>
        petition.id.toString().includes(lowerCaseQuery) ||
        petition.header.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredPetitions(filtered);
    }
  }, [searchQuery, userData]);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Решено':
      case 'Одобрено':
        return 'green';
      case 'В работе':
      case 'На рассмотрении':
        return 'orange';
      case 'Отклонено':
        return 'red';
      default:
        return 'blue';
    }
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  const startIndex = currentPage * 4;
  const endIndex = startIndex + 4;

  return (
    <div>
      <Header />
      <div className="profile-page">
        {error ? (
          <p className="error">{error}</p>
        ) : (
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
        )}
      </div>

      {userData.petitions && (
        <div>
          <div className="button-container">
            <button className='profile-button' onClick={handleGoBack}>Назад</button>
            <button className='red-button' onClick={handleCreatePetition}>Создать петицию</button>
          </div>
          <h2>Вот ваши заявки</h2>
          
          <div className="petitions-list-container">
            <ul className="petitions-list">
              {filteredPetitions.slice(startIndex, endIndex).map((petition) => (
                <div key={petition.id} className="petition-item">
                  <p><strong>Номер заявки:</strong> <Link to={`/petition/${petition.id}`}>{petition.id}</Link></p>
                  <p><strong>Заголовок:</strong> {petition.header}</p>
                  <p style={{ color: getStatusColor(petition.status) }}>{petition.status}</p>
                  <p><strong>Адрес:</strong> {petition.address}</p>
                  <p><strong>Подписей:</strong> {petition.likes}</p>
                </div>
              ))}
            </ul>
          </div>
          {userData.petitions.length > 3 && (
            <div className="pagination-buttons">
              <button onClick={() => handlePageChange('prev')} disabled={currentPage === 0}>
                <img src={leftArrow} alt="Previous" />
              </button>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Поиск по ID или заголовку"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <button onClick={() => handlePageChange('next')} disabled={endIndex >= userData.petitions.length}>
                <img src={rightArrow} alt="Next" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
