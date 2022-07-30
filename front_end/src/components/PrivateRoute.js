import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isLogin } from '../utils'

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (

    // Pour montrer le composant seulement si l'utilisateur est connecté, sinon l'utilisateur est redirigé vers la page d'accès
    <Route
      {...rest}
      render={(props) =>
        isLogin() ? <Component {...props} /> : <Redirect to='/login' />
      }
    />
  )
}

export default PrivateRoute