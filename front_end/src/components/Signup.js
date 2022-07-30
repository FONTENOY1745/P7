import React, { useState } from 'react'
import logo from '../images/icon-left-font.png'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Signup = () => {
  const [lastName, setLastName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signupCheck = (e) => {
    e.preventDefault()
    const inputCheck = () => {
      const textRegex =
        /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,30}$/i
      const emailRegex =
        /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,30})$/i

      if (
        textRegex.test(lastName) &&
        textRegex.test(firstName) &&
        emailRegex.test(email)
      ) {
        return true
      } else {
        alert('Merci de saisir des données valides')
        return false
      }
    }
    if (inputCheck()) {
      axios({
        method: 'POST',
        url: 'http://localhost:3000/users/signup',
        data: {
          lastName,
          firstName,
          email,
          password,
        },
      })
        .then((res) => {
          if (res.status === 201) {
            document.getElementById('message').classList.add('confirmation')
            document.getElementById('message').innerText =
              'Votre compte utilisateur est créé!'
            setLastName('')
            setFirstName('')
            setEmail('')
            setPassword('')
          } else {
            console.log('Erreur')
          }
        })
        .catch((err) => {
          console.log(err)
          document.getElementById('message').classList.add('warning')
          document.getElementById('message').innerText =
            'Une erreur est apparue'
        })
    }
  }

  return (
    <>
      <section className='container'>
        <Link to='/'>
          <img src={logo} alt='logo' className='logo' />
        </Link>
        <article className='form'>
          <form onSubmit={signupCheck}>
            <h1>Inscription</h1>
            <div className='form-control'>
              <label htmlFor='lastName'>Nom de famille :</label>
              <input
                type='text'
                id='lastName'
                name='lastName'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className='form-control'>
              <label htmlFor='firstName'>Prénom :</label>
              <input
                type='text'
                id='firstName'
                name='firstName'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className='form-control'>
              <label htmlFor='email'>Email :</label>
              <input
                type='email'
                id='email'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='form-control'>
              <label htmlFor='password'>Mot de passe :</label>
              <input
                type='password'
                id='password'
                name='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className='advice'>
                Min 8 caractères dont au moins un chiffre, une majuscule, une
                minuscule
              </span>
            </div>
            <button type='submit' className='btn'>
              S'inscrire
            </button>
            <p id='message'></p>
          </form>
          <p>
            Vous avez déjà un compte ?
            <Link to='/login'>
              <span className='signupLink'>Se connecter</span>
            </Link>
          </p>
        </article>
      </section>
    </>
  )
}

export default Signup