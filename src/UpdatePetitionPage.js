import React, { useState } from 'react';
import './UpdatePetitionPage.css';
import Header from './Header'; // Импорт компонента Header
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function PetitionStatusForm({ onUpdateStatus, onCancel }) {
  const [status, setStatus] = useState('на модерации');
  const [comment, setComment] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { petitionId } = useParams();
  const navigate = useNavigate();

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Проверка на пустые поля
    if (status.trim() === '' || comment.trim() === '') {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    // Если поля не пусты, отправляем данные
    const token = localStorage.getItem('token'); // Получаем токен из localStorage
    const data = {
      id: petitionId,
      user_token: token,
      status: status,
      comment: ('Новый статус: ' + status + '. Комментарий администратора: ' + comment)
    };

    // Отправляем данные на сервер
    axios.post('http://127.0.0.1:8000/update_petition', data)
      .then(response => {
        // Обработка успешного ответа от сервера
        setSuccessMessage('Статус заявки успешно обновлен.');
        setErrorMessage(null); // Очистка сообщения об ошибке
        onUpdateStatus(status, comment);
      })
      .catch(error => {
        // Обработка ошибки при запросе
        if (error.response) {
          if (error.response.status === 500) {
            setErrorMessage('Что-то пошло не так, попробуйте позже.');
          } else if (error.response.status === 401) {
            setErrorMessage('Необходима повторная авторизация. Пожалуйста, перезайдите в систему.');
          } else {
            setErrorMessage('Ошибка при отправке запроса. Пожалуйста, попробуйте позже.');
          }
        } else {
          setErrorMessage('Ошибка сети. Пожалуйста, попробуйте позже.');
        }
      });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <Header />
      
      <div className="petition-status-form">
      {successMessage  && <div className="success">{successMessage}</div>}
      {errorMessage && !successMessage && <div className="error-message">{errorMessage}</div>}
        <p>Заявка № {petitionId}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="status">Выберите новый статус: </label>
            <select id="status" value={status} onChange={handleStatusChange}>
              <option value="на модерации">На модерации</option>
              <option value="На рассмотрении">На рассмотрении</option>
              <option value="Отклонено">Отклонено</option>
              <option value="В работе">В работе</option>
              <option value="Решено">Решено</option>
              <option value="Одобрено">Одобрено</option>
            </select>
          </div>
          <div className="form-group">
            <textarea 
              id="comment" 
              value={comment} 
              onChange={handleCommentChange} 
              placeholder="Введите ваш комментарий здесь" 
            />
          </div>
          <div className="button-group">
            <button type="submit" className="update-button">Обновить статус</button>
            <button type="button" className="cancel-button" onClick={handleGoBack}>Назад</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PetitionStatusForm;
