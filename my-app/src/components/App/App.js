import { useEffect, useState } from 'react';
import Footer from '../Footer';
import Header from '../Header';
import ImagePopup from '../ImagePopup';
import Main from '../Main';
import PopupWithForm from '../PopupWithForm';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import EditProfilePopup from "../EditProfilePopup";
import EditAvatarPopup from "../EditAvatarPopup";
import AddPlacePopup from "../AddPlacePopup";
import api from "../../utils/Api";

import { Route, Switch } from 'react-router-dom';
// импортируем компоненты приложения
import Login from '../Login.js';
import Register from '../Register.js';
import ProtectedRoute from '../ProtectedRoute.js';
import InfoTooltip from '../InfoTooltip.js';


function App() {
  const [isEditProfilePopupOpen, setOpenEditProfile] = useState(false);
  const [isAddPlacePopupOpen, setOpenAddPlace] = useState(false);
  const [isEditAvatarPopupOpen, setOpenEditAvatar] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isImageOpen, setImageOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  /*Стейт-переменную loggedIn. 
  Она будет содержать статус пользователя — вошёл он в систему или нет. 
  Временно установим значение этой переменной false*/
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    Promise.all([api.getInitialCards(), api.getProfile()])
      .then(([cards, userData]) => {
        setCurrentUser(userData);
        setCards(cards);
      })
      .catch((err) => console.log(err));
  }, []);

  /* this.tokenCheck = this.tokenCheck.bind(this);
  this.handleLogin = this.handleLogin.bind(this); */

  /*componentDidMount() {
    // позже здесь тоже нужно будет проверить токен пользователя!
    this.tokenCheck();
  };

  handleLogin(e){
    e.preventDefault();
  this.setState({
    loggedIn: true
  })

 tokenCheck () {
  // если у пользователя есть токен в localStorage,
  // эта функция проверит валидность токена
    const jwt = localStorage.getItem('jwt');
  if (jwt){
    // проверим токен
    duckAuth.getContent(jwt).then((res) => {
      if (res){
                // авторизуем пользователя
        this.setState({
          loggedIn: true,
        }, () => {
                    // обернём App.js в withRouter
                    // так, что теперь есть доступ к этому методу
          this.props.history.push("/ducks");
        });
      }
    }); 
  }
}  
*/

  function handleCardClick(card) {
    setSelectedCard(card);
    setImageOpen(true);
  }

  function handleEditAvatarClick() {
    setOpenEditAvatar(true);
  }

  function handleEditProfileClick() {
    setOpenEditProfile(true);
  }

  function handleAddPlaceClick() {
    setOpenAddPlace(true);
  }

  function closeAllPopups() {
    setOpenEditAvatar(false);
    setOpenEditProfile(false);
    setOpenAddPlace(false);
    setImageOpen(false);
  }

  function handleCardLike(card) {
    // Проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c))
        .catch(error => console.log(error));
    });
  }

  function handleCardDelete(card) {
    // Проверяем принадлежность карточки
    const isOwn = card.owner._id === currentUser._id;

    //Создаём копию массива, исключая удаленную карточку
    if (isOwn) {
      api.deleteCard(card._id)
        .then(() => setCards(state => state.filter(c => c._id !== card._id)))
        .catch(error => console.log(error));
    }
  }

  // Обработчик обновления данных профиля
  function handleUpdateUser({ name, about }) {
    api
      .editProfile(name, about)
      .then((res) => {
        setCurrentUser(res)
        closeAllPopups();
      })
      .catch(error => console.log(error));
  }

  // Обработчик обновления аватара
  function handleUpdateAvatar({ avatar }) {
    api
      .editAvatar(avatar)
      .then((res) => {
        setCurrentUser(res)
        closeAllPopups();
      })
      .catch(error => console.log(error));
  }

  // Обработчик добавления карточки
  function handleAddPlaceSubmit({ name, link }) {
    return api
      .addCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards])
        closeAllPopups();
      })
      .catch(error => console.log(error));
  }

  return (
    <CurrentUserContext.Provider value={{ state: this.state, handleLogin: this.handleLogin }}>


      <div className="page">

        <Header />

        <Switch>

        //авторизация
          <Route path="/login">
            <div className="loginContainer">
              <Login />
            </div>
          </Route>

        //регистрация
          <Route path="/signup">
            <div className="registerContainer">
              <Register />
            </div>
          </Route>

          <Route exact path="/">
            {this.state.loggedIn ? <Redirect to="/users/me" /> : <Redirect to="/signin" />}
          </Route>

        //был Main

          <ProtectedRoute
            path="/"
            component={Main}
            loggedIn={this.state.loggedIn}
            cards={cards}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete} />
        </Switch>
        <Footer />
      </div>

      <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />

      <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

      <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />

      <PopupWithForm name="delete-confirm" title="Вы уверены?" button="Да" onClose={closeAllPopups} />

      <ImagePopup name="photo"
        onClose={closeAllPopups}
        isOpen={isImageOpen}
        card={selectedCard} />
      <InfoTooltip />
    </CurrentUserContext.Provider>
  );
}

export default App;
