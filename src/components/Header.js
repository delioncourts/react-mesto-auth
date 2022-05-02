import HeaderInfo from "./HeaderInfo";
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from "../images/logo.svg";

function Header({ loggedIn, email, onSignOut }) {
  const location = useLocation();
  const [menu, setMenu] = useState(false);

  function openMenu() {
    setMenu(!menu);
  }

  useEffect(() => {
    setMenu(false);
  }, [location])

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
      <>
        <button onClick={openMenu} className={"burger"}>
          <span className={`burger__line ${menu && "burger__line_open"}`}></span>
          <span className={`burger__line ${menu && "burger__line_open"}`}></span>
          <span className={`burger__line ${menu && "burger__line_open"}`}></span>
        </button>
      </>
    </header>
  )
}

export default Header;