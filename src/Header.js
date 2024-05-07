// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.png';

function Header({ cityName }) {
  return (
    <header className="header-container">
      <div className="header-left">
        <Link to="/">
          <img src={logo} alt="Логотип Умного Города" />
        </Link>
      </div>
      <div className="header-center">
        <h1>Умный Город - {cityName}</h1>
      </div>
      <div className="header-right">
        <Link to="/registration" className="login-button">Войти</Link>
      </div>
    </header>
  );
}

export default Header;
