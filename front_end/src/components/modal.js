import React from "react";
import "../style/Modal.css";
import { GrFormClose } from "react-icons/gr";

export default function Modal({ open, children, onClose }) {
  if (!open) return null;
  return (
    <div>
      <div className="overlay" />
      <div className="Modal">
        <button className="close-btn" onClick={onClose}>
          <GrFormClose />
        </button>
        {children}
      </div>
    </div>
  );
}
