import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import { Link, useParams } from 'react-router-dom';
import './AdminPetitionsPage.css'; // Импортируем стили

function AdminPetitionsPage() {
  const [petitionsData, setPetitionsData] = useState([]);
  const { regionName, cityName } = useParams();

  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dateDesc');
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const requestData = {
          token: token,
          region: regionName,
          city_name: cityName
        };
        const response = await axios.post('http://127.0.0.1:8000/get_admin_petitions', requestData);
        setPetitionsData(response.data[0].petitions);
      } catch (error) {
        console.error('Произошла ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, [regionName, cityName]);

  const filteredPetitions = petitionsData.filter(petition => {
    const statusFilterCondition = statusFilter === 'all' || petition.status === statusFilter;
    const typeFilterCondition = typeFilter === 'all' || petition.type === typeFilter;
    const searchFilterCondition = petition.id.toString().toLowerCase().includes(searchQuery.toLowerCase());
    return statusFilterCondition && typeFilterCondition && searchFilterCondition;
  });
  
  

  if (sortBy === 'dateDesc') {
    filteredPetitions.sort((a, b) => new Date(b.date) - new Date(a.date)); // Сначала новые
  } else if (sortBy === 'dateAsc') {
    filteredPetitions.sort((a, b) => new Date(a.date) - new Date(b.date)); // Сначала старые
  } else if (sortBy === 'likes') {
    filteredPetitions.sort((a, b) => b.likes - a.likes); // Сортировка по количеству лайков
  }

  const handleStatusChange = event => {
    setStatusFilter(event.target.value);
  };

  const handleTypeChange = event => {
    setTypeFilter(event.target.value);
  };

  const handleSortChange = event => {
    setSortBy(event.target.value);
  };

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };
  

  return (
    <div>
      <Header />
      <div className='management-container'>
        <h2>Петиции. {regionName}, город {cityName}</h2>
          
          <div className="filters">
            <div className="filters-item">
              <label>Поиск по ID: </label>
              <input type="text" value={searchQuery} onChange={handleSearchChange} />
            </div>

            <div className='filters-item'>
              <label>Фильтр по статусу: </label>
              <select value={statusFilter} onChange={handleStatusChange}>
                <option value="all">Все</option>
                <option value="ожидает модерации">Ожидает модерации</option>
                <option value="Решено">Решено</option>
                <option value="В работе">В работе</option>
                <option value="Отклонено">Отклонено</option>
                <option value="На рассмотрении">На рассмотрении</option>
                <option value="Одобрено">Одобрено</option>
              </select>
            </div>
            
            <div className="filters-item">
              <label>Фильтр по типу: </label>
              <select value={typeFilter} onChange={handleTypeChange}>
                <option value="all">Все</option>
                <option value="Жалоба">Жалоба</option>
                <option value="Инициатива">Инициатива</option>
              </select>
            </div>
            
            <div className="filters-item">
              <label>Сортировать по: </label>
              <select value={sortBy} onChange={handleSortChange}>
                <option value="dateDesc">Сначала новые</option>
                <option value="dateAsc">Сначала старые</option>
                <option value="likes">Сначала популярные</option>
              </select>
            </div>
            
          </div>
      </div>
      
      <div className='admin-petitions-container'>
        

        <div className="petitions">
            {filteredPetitions.map(petition => (
              <div className='petition-container'>
                <div className='petition-container-item'>
                  <p key={petition.id}>
                  <Link to={`/petition/${petition.id}`}>ID: {petition.id}</Link>
                    <p className='petition-header'><strong>{petition.header}</strong></p>
                    <p><strong>Адрес:</strong> {petition.address}</p>
                    <p><strong>Дата:</strong> {petition.date}</p>
                    <p style={{ color: petition.status === 'Решено' || petition.status === 'Одобрено' ? 'green' :
                    petition.status === 'В работе' || petition.status === 'На рассмотрении' ? 'yellow' :
                    petition.status === 'Отклонено' ? 'red' : 'blue', 
                    textTransform: 'uppercase' }}>
                    {petition.status}</p>
                    <p><strong>Подписей: </strong>{petition.likes}</p>
                    <p><strong>Тип:</strong> {petition.type}</p>
                  </p>
                </div>
                <div className='petition-container-item'>
                </div>
                
              </div>
              
            ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPetitionsPage;
