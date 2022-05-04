import { Link } from "react-router-dom";

function HeaderInfo({ loggedIn, email, onSignOut }) {
  return (
    <div className='header__info'>
      <p className='header__email'>{email}</p>
      <Link to='sign-up' className={`header__link ${loggedIn && 'header__link_active'}`} onClick={onSignOut}>
        Выйти
      </Link>
    </div>
  )
}

export default HeaderInfo;