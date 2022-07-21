import React, { useContext, useState, useEffect } from "react";
import Axios from "axios";
import DataContext from "../DataContext";
import "../style/profile.css";
import DeleteAccountModal from "../components/DeleteAccountModal";
import { useHistory } from "react-router-dom";

export default function Profile() {
  const history = useHistory();

  const [isOpenDeleteAccountModal, setIsOpenDeleteAccountModal] =
    useState(false);
  const [isprofileDeleted, setisprofileDeleted] = useState(false);

  const { dataUser, LStoken } = useContext(DataContext);

  // On redirige l'utilisateur s'il ne s'est pas loggé. //

  function redirectLogin() {
    history.push("/login");
  }

  useEffect(() => {
    if (!LStoken) {
      redirectLogin();
    }
  }, []);

  function deleteAccount() {
    Axios.delete(`http://localhost:3000/api/user/delete/${dataUser.id}`).then(
      (response) => {
        console.log(response + "Utilisateur supprimé!");
        setisprofileDeleted(true);
        localStorage.setItem("token", "");
        localStorage.setItem("id", "");
      }
    );
  }

  if (isprofileDeleted) {
    return (
      <div className="main-container">
        <div className="delete-profile-msg">Profil supprimé</div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <h1 className="hidden-h1">Profil</h1>
      <div className="info-container">
        <div className="info">
          <h2>Informations sur le profil</h2>
          <div className="underline" />
          <table>
            <thead className="thead">
              <tr>
                <th className="column title" colSpan="1">
                  champs
                </th>
                <th className="column date" colSpan="1">
                  Informations utilisateur
                </th>
              </tr>
            </thead>

            <tr>
              <td>
                {" "}
                <p className="profile-info-input">
                  Nom d&apos;utilisateur :
                </p>{" "}
              </td>
              <td>
                {" "}
                <p className="profile-line-data"> {dataUser.name}</p>{" "}
              </td>
            </tr>

            <tr>
              <td>
                {" "}
                <p className="profile-info-input">E-mail :</p>{" "}
              </td>
              <td>
                {" "}
                <p className="profile-line-data">{dataUser.email}</p>{" "}
              </td>
            </tr>

            <tr>
              <td>
                {" "}
                <p className="profile-info-input">Créé le :</p>{" "}
              </td>
              <td>
                {" "}
                <p className="profile-line-data">{dataUser.createdAt}</p>{" "}
              </td>
            </tr>
          </table>

          {dataUser.moderator == true ? (
            <div className="card-status admin">ADMIN STATUS</div>
          ) : (
            <div className="card-status user">STATUT UTILISATEUR</div>
          )}
        </div>
      </div>
      <button
        className="delete-account-button"
        onClick={() => setIsOpenDeleteAccountModal(true)}
      >
        Supprimer mon compte
      </button>
      <DeleteAccountModal
        open={isOpenDeleteAccountModal}
        onClose={() => setIsOpenDeleteAccountModal(false)}
      >
        Voulez-vous vraiment supprimer votre compte ?
        <div className="answer-btn-box">
          <button
            className="btn-answer yes"
            onClick={() => deleteAccount(dataUser.id)}
          >
            Oui
          </button>
        </div>
      </DeleteAccountModal>
    </div>
  );
}
