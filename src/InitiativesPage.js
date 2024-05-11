import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import { Link, useParams } from 'react-router-dom';
import './ComplaintsPage.css';
import { useNavigate } from 'react-router-dom';

function ComplaintsPage() {
  const [petitionsData, setPetitionsData] = useState([]);
  const { cityName } = useParams();
  const navigate = useNavigate();

  const [sortByStatus, setSortByStatus] = useState("Все");
  const [sortByDate, setSortByDate] = useState("Сначала новые");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/get_city_petitions', {
          region: 'Республика Коми',
          name: cityName,
          is_initiative:  true
        });
        setPetitionsData(response.data[0].petitions);
      } catch (error) {
        console.error('Произошла ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, [cityName]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const filteredPetitions = petitionsData.filter(petition => {
    if (sortByStatus === "Все") {
      return true;
    } else {
      return petition.status === sortByStatus;
    }
  });
  

  if (sortByDate === "Сначала новые") {
    filteredPetitions.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortByDate === "Сначала старые") {
    filteredPetitions.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  return (
    <div>
      <Header />
      <h2>Инициативы города {cityName}</h2>

      {/* Элементы управления для выбора сортировки */}
      <div className='elements'>
        <div className="filter-container">
          <label className="filter-label"></label>
          <select className="filter-select" value={sortByStatus} onChange={e => setSortByStatus(e.target.value)}>
            <option value="Все">Все</option>
            <option value="Отклонено">Отклонено</option>
            <option value="На модерации">На модерации</option>
            <option value="На рассмотрении">На рассмотрении</option>
            <option value="Одобрено">Одобрено</option>
          </select>
        </div>

        <button className="button-back" onClick={handleGoBack}>Назад</button>

        <div className="filter-container">
          <label className="filter-label"></label>
          <select className="filter-select" value={sortByDate} onChange={e => setSortByDate(e.target.value)}>
            <option value="Сначала новые">Сначала новые</option>
            <option value="Сначала старые">Сначала старые</option>
          </select>
        </div>

        
      </div>
      


      <div className="complaints-container">
        <ul className="complaints-list">
          {filteredPetitions.map((petition, index) => (
            (index % 4 === 0) ? 
              <div key={index} className="complaints-row">
                {filteredPetitions.slice(index, index + 4).map(petition => (
                  <p key={petition.id} className="complaint-item">
                    <Link to={`/petition/${petition.id}`} className="complaint-link">
                    <strong><span className="complaint-header">{petition.header}</span></strong>
                      <p>{petition.address}</p>
                      <p>Дата: {petition.date}</p>
                      <p style={{ color: petition.status === 'Решено' || petition.status === 'Одобрено' ? 'green' :
                        petition.status === 'В работе' || petition.status === 'На рассмотрении' ? 'yellow' :
                        petition.status === 'Отклонено' ? 'red' : 'blue', 
                        textTransform: 'uppercase' }}>
                        {petition.status}</p>
                    </Link>
                  </p>
                ))}
              </div>
            : null
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ComplaintsPage;
