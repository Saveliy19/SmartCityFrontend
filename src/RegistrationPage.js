import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistrationPage.css'; // Импортируем файл стилей
import Header from './Header'; // Импорт компонента Header

function RegistrationPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    last_name: '',
    first_name: '',
    patronymic: '',
    region: '',
    city: ''
  });
  const [regions, setRegions] = useState({});
  const [cities, setCities] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate(); // Хук для навигации

  useEffect(() => {
    // Загружаем регионы и города при загрузке компонента
    const fetchCities = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/get_cities');
        const data = await response.json();
        if (response.ok) {
          setRegions(data[0]);
        } else {
          setErrorMessage('Не удалось загрузить регионы и города');
        }
      } catch (error) {
        setErrorMessage('Ошибка сети. Пожалуйста, попробуйте позже.');
      }
    };
    fetchCities();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    setFormData({
      ...formData,
      region: selectedRegion,
      city: '' // Сбрасываем выбранный город при изменении региона
    });
    setCities(regions[selectedRegion] || []);
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
      const cityValue = cities.find(city => Object.keys(city)[0] === formData.city)[formData.city];

      const requestData = {
        email: formData.email,
        password: formData.password,
        last_name: formData.last_name,
        first_name: formData.first_name,
        patronymic: formData.patronymic,
        city: cityValue
      };

      const response = await fetch('http://127.0.0.1:8000/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      if (response.ok) {
        setRegistrationSuccess(true);
        setErrorMessage(''); // Сброс сообщения об ошибке
      } else if (response.status === 500) {
        setErrorMessage('Что-то пошло не так, попробуйте позже');
      } else {
        // Обработка других ошибок при регистрации
        setErrorMessage('Пользователь с таким адресом электронной почты уже зарегистрирован в системе!');
      }
    } catch (error) {
      // Обработка ошибки сети или других проблем
      setErrorMessage('Ошибка сети. Пожалуйста, попробуйте позже.');
    }
  };

  const handleReturn = () => {
    navigate(-1); // Перенаправляем пользователя на предыдущую страницу
  };

  return (
    <div>
      <Header />
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
              <label>Регион:</label>
              <select
                name="region"
                value={formData.region}
                onChange={handleRegionChange}
                required
              >
                <option value="">Выберите регион</option>
                {Object.keys(regions).map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Город:</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                disabled={!formData.region}
              >
                <option value="">Выберите город</option>
                {cities.map((city, index) => (
                  <option key={index} value={Object.keys(city)[0]}>{Object.keys(city)[0]}</option>
                ))}
              </select>
            </div>
            <button type="submit">Зарегистрироваться</button>
          </form>
        )}
      </div>
    </div>
    </div>
  );
}

export default RegistrationPage;
