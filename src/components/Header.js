import HeaderInfo from "./HeaderInfo";
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from "../images/logo.svg";

function Header({ loggedIn, email, onSignOut }) {
  const location = useLocation();


  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="логотип Место" />
      {
        loggedIn ?
          <HeaderInfo email={email} loggedIn={loggedIn} onSignOut={onSignOut} /> :
          (<>
            {
              location.pathname === '/sign-up' ?
                <Link className='header__link' to='/sign-in'>Войти</Link> :
                <Link className='header__link' to='/sign-up'>Регистрация</Link>
            }
          </>)
      }
    </header>
  )
}

export default Header;