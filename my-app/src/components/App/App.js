import {useEffect, useState} from 'react';
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

function App() {
  const [isEditProfilePopupOpen, setOpenEditProfile] = useState(false);
  const [isAddPlacePopupOpen, setOpenAddPlace] = useState(false);
  const [isEditAvatarPopupOpen, setOpenEditAvatar] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isImageOpen, setImageOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  useEffect(() => {
    Promise.all([api.getInitialCards(), api.getProfile()])
      .then(([cards, userData]) => {
        setCurrentUser(userData);
        setCards(cards);
      })
      .catch((err) => console.log(err));
  }, []);

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
    <CurrentUserContext.Provider value={currentUser}>
      <div>

        <div className="page">

          <Header />
          <Main
            cards={cards}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete} />
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
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
