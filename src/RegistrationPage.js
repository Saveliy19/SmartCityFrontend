import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistrationPage.css'; // Импортируем файл стилей

function RegistrationPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    last_name: '',
    first_name: '',
    patronymic: '',
    city: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate(); // Хук для навигации

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Пароли не совпадают');
      return;
    }
    if (!formData.city) {
      setErrorMessage('Пожалуйста, выберите город');
      return;
    }
    if (!/^[А-ЯЁ][а-яё]*$/i.test(formData.last_name) ||
        !/^[А-ЯЁ][а-яё]*$/i.test(formData.first_name) ||
        (formData.patronymic && !/^[А-ЯЁ][а-яё]*$/i.test(formData.patronymic))) {
      setErrorMessage('Фамилия, имя и отчество должны быть указаны кириллицей и начинаться с заглавной буквы');
      return;
    }
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
        setRegistrationSuccess(true);
        setErrorMessage(''); // Сброс сообщения об ошибке
      } else {
        console.error('Ошибка при регистрации');
        // Обработка ошибки при регистрации
        setErrorMessage('Пользователь с таким адресом электронной почты уже зарегистрирован в системе!');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      // Обработка ошибки сети или других проблем
      setErrorMessage('Ошибка сети. Пожалуйста, попробуйте позже.');
    }
  };

  const handleReturn = () => {
    navigate(-1); // Перенаправляем пользователя на предыдущую страницу
  };

  return (
    <div className="registration-page">
      <div className="registration-header">
        <h2>Форма регистрации</h2>
      </div>
      <div className="registration-form">
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {registrationSuccess ? (
          <div>
            <p>Регистрация успешна!</p>
            <button onClick={handleReturn}>Вернуться</button>
          </div>
        ) : (
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
              <label>Повторите пароль:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
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
        )}
      </div>
    </div>
  );
}

export default RegistrationPage;
