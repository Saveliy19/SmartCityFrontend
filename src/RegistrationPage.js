import React, { useState } from 'react';
import './RegistrationPage.css'; // Импортируем файл стилей

function RegistrationPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    last_name: '',
    first_name: '',
    patronymic: '',
    city: ''
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let cityValue = '';
      if (formData.city === 'Емва') {
        cityValue = 3;
      } else if (formData.city === 'Сыктывкар') {
        cityValue = 1;
      }
      
      const response = await fetch('http://127.0.0.1:8000/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          city: cityValue
        })
      });
      
      if (response.ok) {
        console.log('Регистрация успешна');
        // Здесь вы можете выполнить дополнительные действия после успешной регистрации, например, перенаправление на другую страницу
      } else {
        console.error('Ошибка при регистрации');
        // Обработка ошибки при регистрации
      }
    } catch (error) {
      console.error('Ошибка:', error);
      // Обработка ошибки сети или других проблем
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-header">
        <h2>Форма регистрации</h2>
      </div>
      <div className="registration-form">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Пароль:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Фамилия:</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Имя:</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Отчество:</label>
            <input
              type="text"
              name="patronymic"
              value={formData.patronymic}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Город:</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            >
              <option value="">Выберите город</option>
              <option value="Емва">Емва</option>
              <option value="Сыктывкар">Сыктывкар</option>
            </select>
          </div>
          <button type="submit">Зарегистрироваться</button>
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;
