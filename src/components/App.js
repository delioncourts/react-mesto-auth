import { useEffect, useState } from 'react';
import { useNavigate, Route, Routes, Navigate } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import ImagePopup from './ImagePopup';
import Main from './Main';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import api from "../utils/Api";
import Login from './Login.js';
import Register from './Register.js';
import ProtectedRoute from './ProtectedRoute.js';
import InfoTooltip from './InfoTooltip.js';
import { register, authorize, getContent } from '../utils/mestoAuth';
// логотипы
import successLogo from "../images/SuccessLogo.svg"
import failLogo from "../images/FailLogo.svg";

function App() {
    const navigate = useNavigate();

    const [isEditProfilePopupOpen, setOpenEditProfile] = useState(false);
    const [isAddPlacePopupOpen, setOpenAddPlace] = useState(false);
    const [isEditAvatarPopupOpen, setOpenEditAvatar] = useState(false);
    const [selectedCard, setSelectedCard] = useState({});
    const [isImageOpen, setImageOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    const [cards, setCards] = useState([]);

    const [loggedIn, setLoggedIn] = useState(false);
    const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
    const [message, setMessage] = useState(false);
    const [email, setEmail] = useState('');
    const [userInfo, setUserInfo] = useState(null);


    useEffect(() => {
        handleTokenCheck();
        if (loggedIn) {
            navigate('/');
            Promise.all([api.getInitialCards(), api.getProfile()])
                .then(([cards, userData]) => {
                    setCurrentUser(userData);
                    setCards(cards);
                })
                .catch((err) => console.log(err))
        }
    }, [loggedIn])

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

    function handleTokenCheck() {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            getContent(jwt)
                .then((res) => {
                    if (res) {
                        setLoggedIn(true);
                        setEmail(res.currentUser.email)
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    function handleRegister(email, password) {
        register(email, password)
            .then((result) => {
                if (result) {
                    setMessage({ imgPath: successLogo, text: 'Вы успешно зарегистрировались!' });
                    navigate('/signin');
                }
            })
            .catch(() => setMessage({ imgPath: failLogo, text: 'Что-то пошло не так! Попробуйте ещё раз.' }))
            .finally(() => setIsInfoTooltipOpen(true))
    }


    function handleLogin(email, password) {
        authorize(email, password)
            .then((result) => {
                if (result) {
                    navigate('/');
                    localStorage.setItem('jwt', result.token);
                    setLoggedIn(true);
                }
            })
            .catch(() => {
                setMessage({ imgPath: failLogo, text: 'Что-то пошло не так! Попробуйте ещё раз.' })
                setIsInfoTooltipOpen(true)
            })
    }

    function handleSignOut() {
        localStorage.removeItem('jwt');
        navigate('/signin');
    }

    return (
        <div className="page">
            <CurrentUserContext.Provider value={currentUser}>

                <Header
                    email={userInfo}
                    signOut={handleSignOut} />

                <Routes>
                    <ProtectedRoute
                        exact path='/'
                        loggedIn={loggedIn}
                        component={Main}
                        cards={cards}
                        onEditProfile={handleEditProfileClick}
                        onAddPlace={handleAddPlaceClick}
                        onEditAvatar={handleEditAvatarClick}
                        onCardClick={handleCardClick}
                        onCardLike={handleCardLike}
                        onCardDelete={handleCardDelete}
                    />
                    <Route path='/sign-in'>
                        <Register
                            isOpen={isEditProfilePopupOpen}
                            onRegister={handleRegister}
                            isInfoTooltipOpen={isInfoTooltipOpen}
                        />
                    </Route>
                    <Route path='/sign-up'>
                        <Login
                            isOpen={isEditProfilePopupOpen}
                            onLogin={handleLogin}
                        />
                    </Route>
                </Routes>

                <Footer />

                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                    onUpdateUser={handleUpdateUser} />

                <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopups}
                    onUpdateAvatar={handleUpdateAvatar} />

                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                    onAddPlace={handleAddPlaceSubmit} />

                <PopupWithForm name="delete-confirm"
                    title="Вы уверены?"
                    button="Да"
                    onClose={closeAllPopups} />

                <ImagePopup name="photo"
                    onClose={closeAllPopups}
                    isOpen={isImageOpen}
                    card={selectedCard} />

            </CurrentUserContext.Provider>
        </div>
    );
}

export default App;