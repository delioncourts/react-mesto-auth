import React from "react";

function ImagePopup(props) {
    return (
        <article className={`popup popup_${props.name} ${props.isOpen && "popup_opened"}`}>
            <div className="popup__container-open">
                <button className="popup__close" aria-label="закрыть" type="button" onClick={props.onClose}></button>
                <img className="popup__open-photo" alt={props.card.name} src={props.card.link} onClick={props.onClose} />
                <p className="popup__open-photo-subtitle">{props.card.name}</p>
            </div>
        </article>
    )
}

export default ImagePopup;