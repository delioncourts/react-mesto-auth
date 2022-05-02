import React, { useState } from 'react';
import Auth from './Auth.js';

function Register({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleEmail(evt) {
    setEmail(evt.target.value)
  }

  function handlePassword(evt) {
    setPassword(evt.target.value)
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    onRegister(password, email)
  }

  return (
    <div className="register">
      <Auth title={'Регистрация'} name={'register'} onSubmit={handleSubmit}>
        
      </Auth>
    </div>
  )
}

export default Register; 