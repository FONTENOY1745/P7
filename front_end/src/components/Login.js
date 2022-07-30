import React, { useState } from 'react'
import logo from '../images/icon-left-font.png'
import { Link, useHistory } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const history = useHistory()

    const emailRegex =
        /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,30})$/i

    const loginCheck = (e) => {
        const errorDisplay = (message) => {
            document.querySelector('.errorMsg').innerText = message
            document
                .querySelector('.errorMsg')
                .animate(
                    [
                        { opacity: '0' },
                        { opacity: '1' },
                        { opacity: '1' },
                        { opacity: '0' },
                    ],
                    { duration: 3000 }
                )
            setEmail('')
            setPassword('')
        }
        e.preventDefault()
        if (!emailRegex.test(email)) {
            errorDisplay('Merci de saisir un email valide')
        } else {
            const init = {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: { 'Content-Type': 'application/json' },
            }
            fetch('http://localhost:3000/users/login', init)
                .then((res) => {
                    if (res.status === 200) {
                        return res.json()
                    } else if (res.status === 400) {
                        errorDisplay('Utilisateur non trouvé')
                    } else if (res.status === 401) {
                        errorDisplay('Mot de passe invalide')
                    } else if (res.status === 429) {
                        errorDisplay(
                            'Nombre maximum de tentatives autorisées. Veuillez recommencer après 60 minutes'
                        )
                    } else {
                        errorDisplay('Une erreur est apparue')
                    }
                })
                .then((data) => {
                    localStorage.setItem('token', JSON.stringify(data.token))
                    history.push('/dashboard')
                })
                .catch((error) => console.log(error))
        }
    }

    return (
        <>
            <section className='container'>
                <Link to='/'>
                    <img src={logo} alt='logo' className='logo' />
                </Link>
                <article className='form'>
                    <form onSubmit={loginCheck}>
                        <h1>Connexion</h1>
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
                        </div>
                        <button type='submit' className='btn'>
                            Se connecter
                        </button>
                        <p className='errorMsg'></p>
                    </form>
                    <div className='messageBox'>
                        <p>
                            Vous n'êtes pas encore inscrit ?
                            <Link to='/signup'>
                                <span className='signupLink'>Créer un compte</span>
                            </Link>
                        </p>
                        <p>
                            Mot de passe oublié ? Contactez <span>admin@groupomania.fr</span>
                        </p>
                    </div>
                </article>
            </section>
        </>
    )
}

export default Login