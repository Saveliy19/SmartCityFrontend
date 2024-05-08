import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from './Header'; // Импорт компонента Header
import './AboutPetitionPage.css'; // Подключаем файл со стилями
import { useNavigate } from 'react-router-dom'; // Импорт useNavigate из react-router-dom
import likeIcon from './like.png';


function PetitionPage() {
  const [petition, setPetition] = useState(null);
  const { petitionId } = useParams();
  const navigate = useNavigate(); // Использование useNavigate для навигации
  const [isLiked, setIsLiked] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/get_petition_data', {
          id: petitionId 
        });
        setPetition(response.data[0]);
      } catch (error) {
        console.error('Произошла ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, [petitionId]);

  const handleGoBack = () => {
    navigate(-1); // Функция, чтобы вернуться на предыдущую страницу
  };

  const handleLike = () => {
    setIsLiked(!isLiked); // Изменение состояния при каждом нажатии
  };
  

  if (!petition) {
    return <div>Loading...</div>; // Добавим заглушку для загрузки данных
  }

  return (
    <div>
    <Header />
    <div className="petition-container">
      <div className="petition-content">
        <p>ID: {petition.id} {petition.header}</p>
        <p>ID заявителя: {petition.petitioner_id}</p>
        <p>Адрес: {petition.region}, город {petition.city_name}, {petition.address}</p>
        <p><span className={petition.is_initiative ? "text-green" : "text-red"}>
          {petition.is_initiative ? "ИНИЦИАТИВА" : "ЖАЛОБА"}</span> в категории "{petition.category}"</p>
        <p>Описание: {petition.description}</p>
        <p>Дата подачи: {petition.submission_time}</p>
        <p style={{ color: petition.status === 'Решено' || petition.status === 'Одобрено' ? 'green' :
                   petition.status === 'В работе' || petition.status === 'На рассмотрении' ? 'yellow' :
                  petition.status === 'Отклонено' ? 'red' : 'blue', 
                  textTransform: 'uppercase' }}>
                  {petition.status}</p>
        <p>Количество подписей: {petition.likes_count}</p>
        <button onClick={handleGoBack}>Назад</button> {/* Кнопка "Назад" */}
        {isLiked ? (
          <img
            src={likeIcon}
            alt="Like"
            className="like-icon"
            onClick={handleLike}
          />
        ) : (
          <button onClick={handleLike}>Поставить подпись</button>
        )}
        {/* Дополните отображение данных о петиции по вашему усмотрению */}
      </div>
    </div>
    </div>
  );
}

export default PetitionPage;
