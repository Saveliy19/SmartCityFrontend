import React, { useState } from 'react';
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
    city_name: 'Емва',
    photos: [] // Добавлено новое состояние для фотографий
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('Ошибка: Токен не найден');
      return;
    }
    const dataToSend = new FormData(); // Создаем объект FormData для отправки файлов
    dataToSend.append('header', formData.header);
    dataToSend.append('is_initiative', formData.is_initiative);
    dataToSend.append('category', formData.category);
    dataToSend.append('description', formData.description);
    dataToSend.append('address', formData.address);
    dataToSend.append('city_name', formData.city_name);
    formData.photos.forEach(photo => {
      dataToSend.append('photos', photo); // Добавляем каждую фотографию в FormData
    });
    dataToSend.append('token', token);
    dataToSend.append('region', 'Республика Коми');
    
    const url = 'http://127.0.0.1:8000/make_petition';
    axios.post(url, dataToSend)
      .then(response => {
        setSuccessMessage('Заявка успешно отправлена');
        setFormData({
          header: '',
          is_initiative: false,
          category: '',
          description: '',
          address: '',
          city_name: '',
          photos: [] // Очищаем список фотографий после отправки
        });
      })
      .catch(error => {
        setErrorMessage('Ошибка при отправке данных на сервер');
        console.error('Error:', error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Преобразуем объект FileList в массив
    setFormData(prevState => ({
      ...prevState,
      photos: files
    }));
  };

  return (
    <div>
      <Header />
      <div className="petition-page-container">
        <div className="petition-header">
          <h1>Заполните данные для создания заявки</h1>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
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
            Город:
            <select name="city_name" value={formData.city_name} onChange={handleChange} required>
              <option value="Емва">Емва</option>
              <option value="Сыктывкар">Сыктывкар</option>
            </select>
          </label>

          <label>
            Фотографии (до 4):
            <input type="file" name="photos" onChange={handleFileChange} accept="image/*" multiple />
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
