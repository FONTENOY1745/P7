import React from "react";
import { Link } from "react-router-dom";

// Style (à revoir au 27/07.2022 --> Button.css à créer)
import styles from "./Button.css";

const Button = (props) => {
    // Couleur du bouton like/dislike selon la réaction de l'utilisateur
    let reactionColor = "";

    switch (props.reaction) {
        case "like":
            reactionColor = "icon_green";
            break;
        case "dislike":
            reactionColor = "icon_red";
            break;
        case null:
            reactionColor = "";
            break;
        default:
            console.log("Quelque chose ne va pas dans le module Button");
    }

    // Type d'icône apparaissant :
    let icon;
    switch (props.icon) {
        case "like":
            icon = like;
            break;
        case "dislike":
            icon = dislike;
            break;
        case "comment":
            icon = comment;
            break;
        case "comments":
            icon = comments;
            break;
        default:
            console.log("Quelque chose ne va pas dans le module Button");
    }

    // Type de bouton apparaissant :
    let btn;
    switch (props.btnType) {
        case "functional":
            btn = (
                <button
                    name={props.name}
                    className={`${styles.reaction_btn} ${props.styling}`}
                    onClick={props.onReaction}
                >
                    <img className={`${styles.icon} ${reactionColor}`} src={icon} alt="" />
                    <span>{props.text}</span>
                </button>
            );
            break;
        case "link":
            btn = (
                <Link to={props.link} className={`${styles.reaction_btn} ${props.styling}`}>
                    <img className={`${styles.icon} ${reactionColor}`} src={icon} alt="" />
                    <span>{props.text}</span>
                </Link>
            );
            break;
        case "decor":
            btn = (
                <div className={`${styles.reaction_btn} ${props.styling}`}>
                    <img className={`${styles.icon} ${reactionColor}`} src={icon} alt="" />
                    <span>{props.text}</span>
                </div>
            );
            break;
        default:
            console.log("Quelque chose ne va pas dans le module Button");
    }

    return <>{btn}</>;
};

export default Button;