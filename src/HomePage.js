import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import logo from './logo.png';
import emvaIcon from './emva.png'; // Пример пути к изображению герба города
import syktyvkarIcon from './syktyvkar.png'; // Пример пути к изображению герба города
import ukhtaIcon from './ukhta.png'; // Пример пути к изображению герба города
import pechoraIcon from './pechora.png'; // Пример пути к изображению герба города

function HomePage() {
  return (
    <div>
      <header className="header-container">
        <div className="header-left">
          <img src={logo} alt="Логотип Умного Города" />
        </div>
        <div className="header-center">
          <h1>Система "Умный Город"</h1>
        </div>
      </header>
      <div className="description-container">
        <div className="description">
          <p style={{ fontSize: '22px', color: 'white' }}>
            Система "Умный Город" создана для обеспечения прозрачной и удобной коммуникации между гражданами города и управляющими ведомствами.<br />
            В рамках этой системы жители могут отправлять жалобы и инициативы по улучшению городской среды, а также голосовать за них.<br />
            Это позволяет активно взаимодействовать с городскими властями, способствует повышению качества жизни и развитию городской инфраструктуры.<br />
            Сейчас система функционирует в следующих городах<br />
          </p>
        </div>
      </div>


      <div className="city-grid">
        <div className="city-item">
          <img src={emvaIcon} alt="Герб Емвы" />
          <Link to="/emva">Емва</Link>
        </div>
        <div className="city-item">
          <img src={syktyvkarIcon} alt="Герб Сыктывкара" />
          <Link to="/syktyvkar">Сыктывкар</Link>
        </div>
        <div className="city-item">
          <img src={ukhtaIcon} alt="Герб Ухты" />
          <Link to="/ukhta">Ухта</Link>
        </div>
        <div className="city-item">
          <img src={pechoraIcon} alt="Герб Печоры" />
          <Link to="/pechora">Печора</Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
