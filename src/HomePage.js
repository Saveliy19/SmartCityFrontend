import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import emvaIcon from './emva.png'; // Пример пути к изображению герба города
import syktyvkarIcon from './syktyvkar.png'; // Пример пути к изображению герба города
import Header from './Header'; // Импорт компонента Header

function HomePage() {
  return (
    <div>
      <Header />
      <div className='home-page-container'>
        <div className="description-container">
          <div className="description">
            <p style={{ fontSize: '22px', color: 'black' }}>
              Система "Умный Город" создана для обеспечения прозрачной и удобной коммуникации между гражданами города и управляющими ведомствами.<br />
              В рамках этой системы жители могут отправлять жалобы и инициативы по улучшению городской среды, а также голосовать за них.<br />
              Это позволяет активно взаимодействовать с городскими властями, способствует повышению качества жизни и развитию городской инфраструктуры.<br />
              Сейчас система функционирует в следующих городах:<br />
            </p>
          </div>
        </div>


        <div className="city-grid">
          <div className="city-item">
            <img src={syktyvkarIcon} alt="Герб Сыктывкара" />
            <Link to="/syktyvkar">Сыктывкар</Link>
          </div>
          <div className="city-item">
            <img src={emvaIcon} alt="Герб Емвы" />
            <Link to="/emva">Емва</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
