// Home.tsx
import React, { useState } from "react";
import "./Home.css";
import { Popup } from "./Popup";
import { Question } from "./Question";
import { Auth } from "./AuthHome";

export const Home = (): JSX.Element => {
  const url = "http://localhost:3000/";
  const [form_title, setForm_title] = useState("");
  const [form_id, setForm_id] = useState<number>(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [questions, setQuestions] = useState([
    { question_text: "", choices: [""] },
  ]);

  const handleForm_titleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm_title(e.target.value);
  };

  const sendQuestions = async (form_id: number): Promise<void> => {
    for (let i = 0; i < questions.length; i++) {
      const question = {
        question_text: questions[i].question_text,
        form: { form_id },
      };
      console.log(question);
      try {
        const response = await fetch(url + "questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(question),
        });
        const data = await response.json();
        console.log("Success:", data);
        const question_id = data.question_id;

        await Promise.all(
          questions[i].choices.map(async (choiceText: string) => {
            const choice = {
              choice_text: choiceText,
              question: { question_id },
            };
            try {
              const choiceResponse = await fetch(url + "choices", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(choice),
              });
              const choiceData = await choiceResponse.json();
              console.log("Success:", choiceData);
            } catch (error) {
              console.error("Error:", error);
              throw error;
            }
          })
        );
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    }
  };

  const SendToServer = async () => {
    if (!isAuthenticated) {
      alert("ログインしてください");
      return;
    }
    if (form_title === "") {
      alert("フォームタイトルを入力してください");
      return;
    }
    if (form_title.length > 100) {
      alert("フォームタイトルは100文字以内で入力してください");
      return;
    }
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].question_text === "") {
        alert("質問文を入力してください");
        return;
      }
      if (questions[i].question_text.length > 100) {
        alert("質問文は100文字以内で入力してください");
        return;
      }
      for (let j = 0; j < questions[i].choices.length; j++) {
        if (questions[i].choices[j] === "") {
          alert("選択肢を入力してください");
          return;
        }
        if (questions[i].choices[j].length > 100) {
          alert("選択肢は100文字以内で入力してください");
          return;
        }
      }
    }
    try {
      const form_id = await sendForm();
      console.log("form_id", form_id);
      setForm_id(form_id);
      await sendQuestions(form_id);
      setIsPopupVisible(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const sendForm = async () => {
    try {
      const response = await fetch(url + "forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ form_title }),
      });
      const data = await response.json();
      console.log("Success:", data);
      return data.form_id;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const handleSubmit = () => {
    SendToServer();
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setForm_id(0);
  };

  return (
    <div className="container">
      <Auth
        isAuthenticated={isAuthenticated}
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />
      <h1 className="title">アンケートフォーム作成</h1>

      {isAuthenticated && (
        <div>
          <div className="form-group">
            <label className="form-label">フォームタイトル:</label>
            <input
              className="form-input"
              type="text"
              value={form_title}
              onChange={handleForm_titleChange}
            />
          </div>
          <Question
            form_id={form_id}
            questions={questions}
            setQuestions={setQuestions}
          />

          <button className="submit-button" onClick={handleSubmit}>
            フォームを送信
          </button>
          {isPopupVisible && (
            <Popup form_id={form_id} onClose={handleClosePopup} />
          )}
        </div>
      )}
    </div>
  );
};
