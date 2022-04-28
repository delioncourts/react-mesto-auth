import React from "react";
import { Route, Redirect } from "react-router-dom";
import { CurrentUserContext } from '../contexts/CurrentUserContext'; // импортируем контекст

// этот компонент принимает другой компонент в качестве пропса
// он также может взять неограниченное число пропсов и передать их новому компоненту
const ProtectedRoute = ({ component: Component, ...props }) => {
    const value = React.useContext(CurrentUserContext); // получаем значения из контекста
    return (
      <Route>
        {
          () => value.state.loggedIn === true ? <Component {...props} userData={value.state.userData} /> : <Redirect to="./login" />
        }
      </Route>
  )}

export default ProtectedRoute;
