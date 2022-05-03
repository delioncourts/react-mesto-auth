import React from 'react'
import { Link } from 'react-router-dom';

function Auth({ formName, onSubmit, title, children, buttonText }) {
    return (
        <div className='auth'>
            <form className='auth__form' name={formName} noValidate onSubmit={onSubmit} >
                <h2 className='auth__title'>{title}</h2>
                {children}
                {formName === 'register' &&
                    <Link className='auth__link' to='/sign-in'>Уже зарегистрированы? Войти</Link>
                }
            </form>
        </div>
    )
}

export default Auth;