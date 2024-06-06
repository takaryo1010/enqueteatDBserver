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
   function copyToClipboard() {
     const textField = document.createElement("textarea");
     textField.innerText = answerURL;
     document.body.appendChild(textField);
     textField.select();
     document.execCommand("copy");
     textField.remove();
     alert("URLがクリップボードにコピーされました！");
   }
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>フォームが正常に作成されました!</h2>
        <p>
          <a href={answerURL}>{answerURL}</a>
        </p>
        <input value={answerURL}></input>
        <button className="copyTarget" onClick={copyToClipboard}>Copy text</button>
        <button className="close-button" onClick={handleClose}>
          閉じる
        </button>
      </div>
    </div>
  );
};
