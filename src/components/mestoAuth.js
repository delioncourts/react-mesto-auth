export const BASE_URL = 'https://api.nomoreparties.co';

export const register = (password, email) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      //? 'Accept': 'application/json',
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({password, email})
  })
  /*"password": "somepassword",
"email": "email@yandex.ru" */

  .then((response) => {
    try {
      if (response.status === 200){
        return response.json();
        /* {
    "data": {
        "_id": "5f5204c577488bcaa8b7bdf2",,
        "email": "email@yandex.ru"
    }
} */
      }
    } catch(e){
      return (e)
    }
  })
  .then((res) => {
    return res;
  })
  .catch((err) => console.log(err));
}; 


export const authorize = (identifier, password) => {
  return fetch(`${BASE_URL}/auth/local`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({identifier, password})
  })
  .then((response => response.json()))
  .then((data) => {
    if (data.jwt){
      localStorage.setItem('jwt', data.jwt);
      return data;
    }
  })
  .catch(err => console.log(err))
}; 

export const getContent = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
  .then(res => res.json())
  .then(data => data)
} 

/* // сохраняем username
localStorage.setItem('username', 'Стас Басов');

// получаем username
localStorage.getItem('username'); // "Стас Басов"

// удаляем username
localStorage.removeItem('username');

// если ключа нет, вернётся null
localStorage.getItem('username'); // null 

// сохраняем username
localStorage.setItem('user', JSON.stringify({
  firstName: 'Стас',
  lastName: 'Басов'
}));

// достаём username
JSON.parse(localStorage.getItem('user'));

//  {
//    firstName: 'Стас',
//    lastName: 'Басов'
//  } 

// отправляем запрос на роут аутентификации
fetсh('https://api.mywebsite.com/signin', {
  method: 'POST',
  body: JSON.stringify({
    email: 'stasbasov@yandex.ru',
    password: 'StasBasov1989'
  })
})
.then(res => res.json())
.then((data) => {
  // сохраняем токен
  localStorage.setItem('token', data.token);
}); 

// отправляем запрос на роут аутентификации
fetch('https://api.mywebsite.com/posts', {
  method: 'GET',
  headers: {
    authorization: `Bearer ${localStorage.getItem('token')}`
  }
}); 
*/