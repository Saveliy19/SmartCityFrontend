// Header.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.png';
import './Header.css';

function Header({ cityName }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModerator, setIsModerator] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const is_moderator = localStorage.getItem('is_moderator');
    if (token) {
      setIsLoggedIn(true);
      if (is_moderator === 'true'){
        setIsModerator(true);
      }
    }
  }, []);



  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('is_moderator');
    setIsLoggedIn(false);
  };

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  const handleLoginSuccess = (token) => {
    setIsLoggedIn(true);
    window.location.reload();
  };

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
        {isLoggedIn ? (
          <>
            {isModerator? (
          <>
            <Link to="/administrate">
              <button className="profile-button">{'Администрирование'}</button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile">
              <button className="profile-button">{'Профиль'}</button>
            </Link>
          </>
        )}
        <button onClick={handleLogout} className="login-button red-button">
              Выйти
            </button>
          </>
        ) : (
          <>
            {showLoginForm ? (
              <LoginForm
                handleLoginSuccess={handleLoginSuccess}
                setError={setError}
                onCancel={toggleLoginForm}
                error={error}
              />
            ) : (
              <button onClick={toggleLoginForm} className="login-button">
                Войти
              </button>
            )}
          </>
        )}
      </div>
    </header>
  );
}

function LoginForm({ handleLoginSuccess, setError, onCancel, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        const token = responseData.access_token;
        const is_moderator = responseData.is_moderator;
        localStorage.setItem('token', token);
        localStorage.setItem('is_moderator', is_moderator);
        handleLoginSuccess(token);
      } else {
        setError(responseData.message || 'Неверный email или пароль');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Ошибка соединения');
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input type="email" placeholder="Email" onChange={handleEmailChange} />
          <input type="password" placeholder="Пароль" onChange={handlePasswordChange} />
        </div>
        {error && <div className="error">{error}</div>}
        <div className="login-buttons">
          <button type="submit" className="login-submit">
            Войти
          </button>
          <button onClick={onCancel} className="cancel-button">
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

export default Header;
