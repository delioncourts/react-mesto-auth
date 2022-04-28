import React from "react";
import logo from "../images/logo.svg";

function Header() {
  return (
    <>
      <header className="header">
        <img className="header__logo" src={logo} alt="логотип Место" />
      </header>
    </>
  );
}

//  <li><button className="navbar__link navbar__button">Выйти</button></li>
export default Header;

/* Для реализации выхода из системы нужно удалить JWT-токен из localStorage и переадресовать пользователя на страницу /login. 
Поскольку NavBar — функциональный компонент, воспользуемся «Реакт-хуком» useHistory:
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import Logo from './Logo.js';
import './styles/NavBar.css';

function NavBar () {
  const history = useHistory();
  function signOut(){
    localStorage.removeItem('jwt');
    history.push('/login');
  }
  return (
    <div className="navbar">
      <div className="navbar__logo">
        <Logo/>
      </div>
      <ul className="navbar__nav">
        <li><Link to="ducks" className="navbar__link">Утки</Link></li>
        <li><Link to="my-profile" className="navbar__link">Мой профиль</Link></li>
        <li><button onClick={signOut} className="navbar__link navbar__button">Выйти</button></li>
      </ul>
    </div>
  )
}

export default NavBar; 
Мы добавили метод signOut. 
Он удаляет JWT из localStorage и затем использует метод history.push, 
чтобы направить пользователя обратно к роуту /login.
Мы также добавили обработчик onClick, 
который будет вызывать этот метод всякий раз, 
когда пользователь нажимает на элемент <button> внутри компонента NavBar.
*/