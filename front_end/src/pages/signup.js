import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import "../style/form.css";

export default function Signup() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function redirect() {
    history.push("/login");
  }

  const emailReg =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+[a-zA-Z0-9-]+)/;
  const passwordReg = /^[A-Za-z0-9]\w{8,}$/;

  const signup = () => {
    Axios.post("http://localhost:3000/api/user/signup", {
      name: name,
      email: email,
      password: password,
    }).then((response) => {
      console.log(response);
      redirect();
    });
  };

  function emailValidation(email, password) {
    if (!email.match(emailReg)) {
      alert("Erreur : L'adresse e-mail n'est pas valide!");
      return;
    }
    /*else if (!password.match(passwordReg)) {
      alert("Erreur : Le mot de passe n'est pas valide!");
      return;
    }*/
    signup();
  }

  return (
    <div className="form-container">
      <h1 className="main-title">Sign up to Groupomania</h1>

      <div className="form-container-box">
        <div className="inputs">
          <div className="input">
            <label htmlFor="inputName">Name:</label>
            <input
              placeholder="name"
              className="form-control"
              id="inputName"
              type="text"
              onChange={(e) => {
                setName(e.target.value);
              }}
            ></input>
          </div>

          <div className="input">
            <label htmlFor="inputEmail">Email:</label>
            <input
              placeholder="email"
              type="email"
              className="form-control"
              id="inputEmail"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></input>
          </div>

          <div className="input">
            <label htmlFor="inputPassword">password:</label>
            <input
              placeholder="password"
              className="form-control"
              id="inputPassword"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></input>
            <p>
              (Attention : Le mot de passe doit contenir au moins 8 caractères)
            </p>
          </div>
        </div>

        <div className="button-login-container">
          <button
            className="submit-btn-login"
            onClick={(() => signup, () => emailValidation(email, password))}
          >
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
}
