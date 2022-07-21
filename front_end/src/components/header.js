import { Link } from "react-router-dom";
import "../style/header.css";
import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import { FaBars } from "react-icons/fa";

function Header() {
  const history = useHistory();

  function redirect() {
    history.push("/login");
  }

  function logout() {
    localStorage.setItem("token", "");
    localStorage.setItem("id", "");
    localStorage.clear();
    redirect();
  }

  const [show, setShow] = useState(false);

  function displayLinks() {
    setShow(!show);
  }

  return (
    <div>
      <header className="header-container">
        <button className="toggle-nav-btn" onClick={displayLinks}>
          <FaBars />
          <span className="text-nav-btn">menu-btn</span>
        </button>
      </header>
      <nav className={show ? "square active" : "square"}>
        <Link className="header-link" onClick={displayLinks} to="/">
          ACCUEIL
        </Link>
        <Link className="header-link" onClick={displayLinks} to="/profile">
          {" "}
          PROFIL
        </Link>
        <Link className="header-link" onClick={displayLinks} to="/forum">
          {" "}
          FORUM
        </Link>
        <Link className="header-link" onClick={displayLinks} to="/login">
          {" "}
          CONNEXION
        </Link>
        <Link className="header-link" onClick={displayLinks} to="/signup">
          {" "}
          S'ENREGISTRER
        </Link>
        <button className="logout-btn" onClick={logout}>
          DECONNEXION
        </button>
      </nav>
    </div>
  );
}

export default Header;
