import React from "react";
import "../style/Modal.css";
import { GrFormClose } from "react-icons/gr";

export default function modifyModal({ openModify, children, onClose }) {
  if (!openModify) return null;
  return (
    <div>
      <div className="overlay" />
      <div className="modal modify">
        <button className="close-btn" onClick={onClose}>
          <GrFormClose />
        </button>
        {children}
      </div>
    </div>
  );
}
