import React, { useState, useEffect } from "react";
import "./Home.css";
import { Popup } from "./Popup";


export const Home = (): JSX.Element => {
  const url = "http://localhost:3000/";
  const [form_title, setform_title] = useState("");
  const [questions, setQuestions] = useState([
    { question_text: "", choices: [""] },
  ]);
  const [form_id, setform_id] = useState<number | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  type question = {
    question_text: string;
    form: form;
  };
  type form = {
    form_id: number;
  };
  type choice = {
    choice_text: string;
    question: { question_id: number };
  };

  const handleform_titleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setform_title(e.target.value);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question_text = value;
    setQuestions(newQuestions);
  };

  const handleChoiceChange = (
    qIndex: number,
    cIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].choices[cIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question_text: "", choices: [""] }]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const addChoice = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].choices.push("");
    setQuestions(newQuestions);
  };

  const removeChoice = (qIndex: number, cIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].choices.splice(cIndex, 1);
    setQuestions(newQuestions);
  };

  const emailSend = async () => {
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
      const form_id = await sendForm(); // フォームを送信し、form_idを取得
      console.log("form_id", form_id);
      setform_id(form_id);
      await sendQuestions(form_id); // 取得したフォームIDを引数にして質問を送信
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
      return data.form_id; // ここでフォームIDを返す
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const sendQuestions = async (form_id: number) => {
    for (let i = 0; i < questions.length; i++) {
      const question: question = {
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

        // 選択肢を並行して送信するため、Promise.allを使用
        await Promise.all(
          questions[i].choices.map(async (choiceText: string) => {
            const choice: choice = {
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

  const handleSubmit = () => {
    emailSend();
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setform_id(null);
  };

  const handleAuthClick = () => {
    const clientId =
      "606359673208-a1tb3fao58u4sbla1gn0cg28809la9an.apps.googleusercontent.com"; 
    console.log(clientId);
    const redirectUri = new URL(window.location.href).origin; 
    const scope =
      "openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    window.location.href = authUrl;
  };

  const handleSignoutClick = () => {
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = new URL(window.location.href).origin;;
    window.localStorage.removeItem("access_token");
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = new URLSearchParams(hash.substring(1)).get("access_token");
      if (token) {
        fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setIsAuthenticated(true);
            setUser({ name: data.name, email: data.email });
            console.log("Success:", data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }
  }, []);

  return (
    <div className="container">
      {!isAuthenticated ? (
        <div><h2>ログインしてください</h2>
        <button onClick={handleAuthClick} className="auth-button">
          Googleでログイン
        </button></div>
      ) : (
        <div>
          <p>ログイン中: {user?.name}</p>
          <button onClick={handleSignoutClick} className="auth-button">
            ログアウト
            </button>
            
        </div>
      )}
      <h1 className="title">アンケートフォーム作成</h1>

      {isAuthenticated && (
        <div>
          <div className="form-group">
            <label className="form-label">フォームタイトル:</label>
            <input
              className="form-input"
              type="text"
              value={form_title}
              onChange={handleform_titleChange}
            />
          </div>
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="question-group">
              <div className="question-box">
                <label className="form-label">質問文:</label>
                <input
                  className="form-input"
                  type="text"
                  value={question.question_text}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                />
                {question.choices.map((choice, cIndex) => (
                  <div key={cIndex} className="choice-group">
                    <label className="form-label choice-label">
                      選択肢{cIndex + 1}:
                    </label>
                    <div className="choice-box">
                      <input
                        className="form-input choice-input"
                        type="text"
                        value={choice}
                        onChange={(e) =>
                          handleChoiceChange(qIndex, cIndex, e.target.value)
                        }
                      />
                      <button
                        className="cross-button"
                        onClick={() => removeChoice(qIndex, cIndex)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="add-button"
                  onClick={() => addChoice(qIndex)}
                >
                  選択肢を追加
                </button>
                <button
                  className="remove-button"
                  onClick={() => removeQuestion(qIndex)}
                >
                  質問を削除
                </button>
              </div>
            </div>
          ))}
          <button className="add-button" onClick={addQuestion}>
            質問を追加
          </button>
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
