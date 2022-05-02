import React from 'react';
import { Link, withRouter } from 'react-router-dom';
//import Logo from './Logo.js';
import * as mestoAuth from '../mestoAuth.js';
///import './styles/Login.css';
import { CurrentUserContext } from '../contexts/CurrentUserContext'; // импортируем контекст

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    handleChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }
    handleSubmit(e) {
        const value = this.context;
        e.preventDefault()
        if (!this.state.email || !this.state.password) {
            return;
        }
        // здесь авторизуем пользователя
        // далее проверяем токен
        // наконец, перенаправляем пользователя на страницу `/ducks`
        mestoAuth.authorize(this.state.email, this.state.password)
        .then((data) => {
            if (!data){
              return this.setState({
                message: 'Что-то пошло не так!'
              });
            }
            if (data.jwt){
              this.setState({email: '', password: '', message: ''} ,() => {
                value.handleLogin(); // подключаем метод из value, обновляем стейт внутри App.js
                this.props.history.push('/mesto'); // и переадресуем пользователя!
                return;
              })
            }
          })
          .catch(err => console.log(err)); // запускается, если пользователь не найден 
        }


        render(){
            return(
              <div onSubmit={this.handleSubmit} className="login">
                <Logo title={'CryptoDucks'}/>
                <p className="login__welcome">
                  Это приложение содержит конфиденциальную информацию. 
                  Пожалуйста, войдите или зарегистрируйтесь, чтобы получить доступ к CryptoDucks.
                </p>
                <p className="login__error">
                  {this.state.message}
                </p>
                <form className="login__form">
                  <label for="username">
                    Логин:
                  </label>
                  <input id="username" required name="username" type="text" value={this.state.username} onChange={this.handleChange} />
                  <label htmlFor="password">
                    Пароль:
                  </label>
                  <input id="password" required name="password" type="password" value={this.state.password} onChange={this.handleChange} />
                  <div className="login__button-container">
                    <button type="submit" className="login__link">Войти</button>
                  </div>
                </form>
        
                <div className="login__signup">
                  <p>Еще не зарегистрированы?</p>
                  <Link to="/register" className="signup__link">Зарегистрироваться</Link>
                </div>
              </div>
            )
          }
        }
        
        export default withRouter(Login); 