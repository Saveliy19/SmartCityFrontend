import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PetitionMakingPage.css'; 
import Header from './Header'; 

function PetitionMakingPage() {
  const [formData, setFormData] = useState({
    header: '',
    is_initiative: false,
    category: 'ЖКХ',
    description: '',
    address: '',
    region: '',
    city_name: '',
    photos: []
  });
  const [regions, setRegions] = useState({});
  const [cities, setCities] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
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
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    setFormData(prevState => ({
      ...prevState,
      region: selectedRegion,
      city_name: '' // Сбрасываем выбранный город при изменении региона
    }));
    setCities(regions[selectedRegion] || []);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prevState => ({
      ...prevState,
      photos: files
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('Ошибка: Токен не найден');
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append('header', formData.header);
    dataToSend.append('is_initiative', formData.is_initiative);
    dataToSend.append('category', formData.category);
    dataToSend.append('description', formData.description);
    dataToSend.append('address', formData.address);
    dataToSend.append('city_name', formData.city_name);
    formData.photos.forEach(photo => {
      dataToSend.append('photos', photo);
    });
    dataToSend.append('token', token);
    dataToSend.append('region', formData.region);
    
    const url = 'http://127.0.0.1:8000/make_petition';
    axios.post(url, dataToSend)
    .then(response => {
      setErrorMessage(null);
      setSuccessMessage('Заявка успешно отправлена');
      setFormData({
        header: '',
        is_initiative: false,
        category: 'ЖКХ',
        description: '',
        address: '',
        region: '',
        city_name: '',
        photos: []
      });
    })
    .catch(error => {
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage('Ошибка: Пользователь не авторизован. Войдите в систему.');
        } else if (error.response.status === 500) {
          setErrorMessage('Ошибка: Сервис временно недоступен. Попробуйте позже.');
        } else {
          setErrorMessage('Сервис временно недоступен, попробуйте позже!');
        }
      } else if (error.request) {
        setErrorMessage('Сервис временно недоступен, попробуйте позже!');
      } else {
        setErrorMessage('Сервис временно недоступен, попробуйте позже!');
      }
      setSuccessMessage(null);
    });
  };

  return (
    <div>
      <Header />
      <div className="petition-page-container">
        <div className="petition-header">
          <h5>Заполните данные для создания заявки</h5>
        </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
        
        <form onSubmit={handleSubmit} className="petition-form">
          <label>
            Заголовок:
            <input type="text" name="header" value={formData.header} onChange={handleChange} required />
          </label>

          <label>
            Тип заявки:
            <select name="is_initiative" value={formData.is_initiative} onChange={handleChange} required>
              <option value={true}>Инициатива</option>
              <option value={false}>Жалоба</option>
            </select>
          </label>

          <label>
            Категория:
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="ЖКХ">ЖКХ</option>
              <option value="Дороги и транспорт">Дороги и транспорт</option>
              <option value="Экология">Экология</option>
              <option value="Безопасность">Безопасность</option>
              <option value="Развлечения">Развлечения</option>
              <option value="Энергоснабжение">Энергоснабжение</option>
              <option value="Управление отходами">Управление отходами</option>
              <option value="Здравоохранение">Здравоохранение</option>
              <option value="Образование">Образование</option>
              <option value="Культура">Культура</option>
            </select>
          </label>

          <label>
            Описание:
            <textarea name="description" value={formData.description} onChange={handleChange} required />
          </label>

          <label>
            Адрес:
            <input type="text" name="address" value={formData.address} onChange={handleChange} required />
          </label>

          <label>
            Регион:
            <select name="region" value={formData.region} onChange={handleRegionChange} required>
              <option value="">Выберите регион</option>
              {Object.keys(regions).map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </label>

          <label>
            Город:
            <select name="city_name" value={formData.city_name} onChange={handleChange} required disabled={!formData.region}>
              <option value="">Выберите город</option>
              {cities.map((city, index) => (
                <option key={index} value={Object.keys(city)[0]}>{Object.keys(city)[0]}</option>
              ))}
            </select>
          </label>

          <label>
            Фотографии заявки:
            <input type="file" name="photos" onChange={handleFileChange} accept="image/*" multiple required />
          </label>

          <div className="button-group">
            <button type="submit">Отправить заявку</button>
            <button type="button" onClick={() => window.history.back()}>Назад</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PetitionMakingPage;
