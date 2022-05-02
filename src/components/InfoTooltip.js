import successLogo from "../images/SuccessLogo.svg"
import failLogo from "../images/FailLogo.svg";

export default function InfoTooltip(props) {
    return (
        <div className={`popup ${props.isOpen && "popup_opened"}`}>
            <div className="popup__container-open">
                <button className="popup__close" aria-label="закрыть" type="button" onClick={props.onClose}></button>
                <img className="popup__open-photo" alt="#" src={props.status === "success" ? successLogo : failLogo} />
                <h2 className="popup__open-photo-subtitle">
                    {props.status === "success"
                        ? "Вы успешно зарегистрировались!"
                        : "Что-то пошло не так! Попробуйте ещё раз."}
                </h2>
            </div>
        </div>
    );
}

//Вы успешно зарегистрировались 
//Что-то пошло не так! Попробуйте ешё раз