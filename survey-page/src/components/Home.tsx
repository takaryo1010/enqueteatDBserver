// Home.tsx
import React, { useState } from "react";
import "./Home.css";
import { Popup } from "./Popup";
import { Question } from "./Question";
import { Auth } from "./AuthHome";
import { ToggleBar } from "./ToggleBar";

export const Home = (): JSX.Element => {
  const url = "http://localhost:3000/";
  const [form_title, setForm_title] = useState("");
  const [form_id, setForm_id] = useState<number>(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isToggleBarOpen, setIsToggleBarOpen] = useState(false); // State for the ToggleBar

  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [questions, setQuestions] = useState([
    { question_text: "", question_type: 1, choices: [""] },
  ]);

  const handleForm_titleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm_title(e.target.value);
  };
  const toggleOpen = () => {
    setIsToggleBarOpen(!isToggleBarOpen);
  };
  // CSRFトークンの取得関数
  const fetchCSRFToken = async () => {
    try {
      const response = await fetch(url + "csrf-token", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      return data.csrfToken;
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
      throw error;
    }
  };

  // 質問の送信関数
  const sendQuestions = async (
    form_id: number,
    csrfToken: string
  ): Promise<void> => {
    try {
      const questionPromises = questions.map(async (questionItem) => {
        const question = {
          question_text: questionItem.question_text,
          question_type: questionItem.question_type,
          form: { form_id },
        };
        
        const response = await fetch(url + "questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken, // CSRFトークンをヘッダーに含める
          },
          body: JSON.stringify(question),
          credentials: "include",
        });

        const data = await response.json();
        console.log("Success:", data);
        const question_id = data.question_id;

        const choicePromises = questionItem.choices.map(
          async (choiceText: string) => {
            const choice = {
              choice_text: choiceText,
              question: { question_id },
            };
            try {
              const choiceResponse = await fetch(url + "choices", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "CSRF-Token": csrfToken, // CSRFトークンをヘッダーに含める
                },
                credentials: "include",
                body: JSON.stringify(choice),
              });
              const choiceData = await choiceResponse.json();
              console.log("Success:", choiceData);
              console.log("choiceData.statusCode", choiceData.statusCode);

              if (choiceResponse.status === 201) {
                setIsPopupVisible(true);
              } else {
                alert(
                  "エラーが発生しました\n\n" +
                    "ステータスコード" +
                    choiceResponse.status +
                    "\n" +
                    choiceResponse.statusText
                );
              }
            } catch (error) {
              console.error("Error:", error);
              throw error;
            }
          }
        );

        await Promise.all(choicePromises);
      });

      await Promise.all(questionPromises);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  // フォームの送信関数
  const sendForm = async (csrfToken: string) => {
    try {
      console.log(csrfToken);
      const response = await fetch(url + "forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken, // CSRFトークンをヘッダーに含める
        },
        body: JSON.stringify({
          form_title: form_title,
          form_administrator: user?.email,
        }),
        credentials: "include",
      });

      const data = await response.json();
      console.log("Success:", data);
      return data.form_id;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  const SendToServer = async () => {
    if (checkSendData()) {
      try {
        const csrfToken = await fetchCSRFToken();
        const form_id = await sendForm(csrfToken);
        console.log("form_id", form_id);
        setForm_id(form_id);
        await sendQuestions(form_id, csrfToken);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleSubmit = () => {
    SendToServer();
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setForm_id(0);
  };
  const checkSendData = (): boolean => {
    if (!isAuthenticated) {
      alert("ログインしてください");
      return false;
    }
    if (form_title === "") {
      alert("フォームタイトルを入力してください");
      return false;
    }
    if (form_title.length > 100) {
      alert("フォームタイトルは100文字以内で入力してください");
      return false;
    }

    if (questions.length === 0) {
      alert("質問を入力してください");
      return false;
    }
    if (questions.length > 10) {
      alert("質問は10個までです");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      if (questions[i].question_text === "") {
        alert("質問文を入力してください");
        return false;
      }
      if (questions[i].question_text.length > 100) {
        alert("質問文は100文字以内で入力してください");
        return false;
      }

      if (
        questions[i].question_type === 1 ||
        questions[i].question_type === 2
      ) {
        if (questions[i].choices.length < 2) {
          alert(
            "ラジオボタンやチェックボックスの質問には少なくとも2つの選択肢が必要です"
          );
          return false;
        }
        if (questions[i].choices.length > 10) {
          alert("選択肢は10個までです");
          return false;
        }
        for (let j = 0; j < questions[i].choices.length; j++) {
          if (questions[i].choices[j] === "") {
            alert("選択肢を入力してください");
            return false;
          }
          if (questions[i].choices[j].length > 100) {
            alert("選択肢は100文字以内で入力してください");
            return false;
          }
        }
      }
    }

    return true;
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
          <ToggleBar
            isOpen={isToggleBarOpen}
            toggleOpen={toggleOpen}
            name={user?.name}
            email={user?.email}
          />{" "}
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
