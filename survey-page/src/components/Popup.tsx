// Popup.js
import React from "react";
import "./Popup.css";

export const Popup = ({
  form_id,
  onClose,
}: {
  form_id: number | null;
  onClose: () => void;
}) => {
  const uri = new URL(window.location.href);
  const answerURL = uri.origin + "/Answer/" + form_id;

  const handleClose = () => {
    if (window.confirm("アンケートURLは保存しましたか？")) {
      onClose();
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>フォームが正常に作成されました!</h2>
        <p>
          <a href={answerURL}>{answerURL}</a>
        </p>
        <button className="close-button" onClick={handleClose}>
          閉じる
        </button>
      </div>
    </div>
  );
};
