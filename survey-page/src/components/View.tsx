import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./Answer.css";

const View: React.FC = () => {
  const { form_id } = useParams<{ form_id: string }>() ?? { form_id: "" };
  const location = useLocation();
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedChoices, setSelectedChoices] = useState<{
    [key: string]: number[];
  }>({});
  const [inputTexts, setInputTexts] = useState<{ [key: string]: string }>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [access_token, setAccess_token] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [questionTexts, setQuestionTexts] = useState<{ [key: string]: string }>(
    {}
  );

  const url = `http://localhost:3000/`;

  const fetchData = async () => {
    try {
      const response = await fetch(`${url}questions/${form_id}/form`);
      const data = await response.json();
      setQuestions(data);
      if (data.length > 0) {
        setFormTitle(data[0].form.form_title);
        const initialQuestionTexts = data.reduce(
          (acc: { [key: string]: string }, question: any) => {
            acc[question.question_id] = question.question_text;
            return acc;
          },
          {}
        );
        setQuestionTexts(initialQuestionTexts);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
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
  useEffect(() => {
    fetchData();
  }, [form_id]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("access_token");
    const name = queryParams.get("name");
    const email = queryParams.get("email");

    if (token) {
      setAccess_token(token);
    }

    if (name && email) {
      setUser({ name: name, email: email } as { name: string; email: string });
      setIsAuthenticated(true);
    }
  }, [location.search]);

  useEffect(() => {
    console.log("isAuthenticated", isAuthenticated);
    console.log("user", user);
  }, [isAuthenticated, user]);

  const handleAuthClick = () => {
    if (form_id) {
      window.localStorage.setItem("form_id", form_id);
    }
    const clientId =
      "606359673208-a1tb3fao58u4sbla1gn0cg28809la9an.apps.googleusercontent.com";
    const redirectUri = new URL(window.location.origin + "/Callback");
    const scope =
      "openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    window.location.href = authUrl;
  };

  const handleSignoutClick = () => {
    window.location.href = new URL(window.location.href).origin;
    setUser(null);
    setIsAuthenticated(false);
  };
  const handleBackClick = () => {
    window.location.href =
      new URL(window.location.href).origin +
      `#access_token=${access_token}&name=${user?.name}&email=${user?.email}`;
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const csrfToken= await fetchCSRFToken();
      fetch(`${url}forms/${form_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        credentials: "include",

        body: JSON.stringify({ form_title: formTitle }),
      });
      questions.forEach(async (question) => {
        await fetch(`${url}questions/${question.question_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
          },
          credentials: "include",

          body: JSON.stringify({
            question_text: questionTexts[question.question_id],
          }),
        });
      });
      setIsEditing(false);
      fetchData();
      window.location.reload();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleFormTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormTitle(e.target.value);
  };

  const handleQuestionTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    questionId: string
  ) => {
    setQuestionTexts({
      ...questionTexts,
      [questionId]: e.target.value,
    });
  };

  return (
    <div className="answer-container">
      {!isAuthenticated ? (
        <div>
          <button onClick={handleAuthClick} className="auth-button">
            Googleでログイン
          </button>
          <h1>ログインしてフォームに回答することができます。</h1>
        </div>
      ) : (
        <div>
          <div>
            <button className="back-button" onClick={handleBackClick}>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </button>
          </div>
          <button onClick={handleSignoutClick} className="auth-button">
            ログアウト
          </button>
          <p>ログイン中: {user?.name}</p>
        </div>
      )}
      {isAuthenticated && (
        <div>
          {isEditing ? (
            <div>
              <button onClick={handleSaveClick} className="edit-button">
                保存
              </button>
              <p></p>
              <input
                type="text"
                value={formTitle}
                onChange={handleFormTitleChange}
              />
            </div>
          ) : (
            <div>
              <button onClick={handleEditClick} className="edit-button">
                編集
              </button>

              <h1>{formTitle}</h1>
            </div>
          )}
          <h2>質問一覧</h2>

          {questions.map((question) => (
            <div key={question.question_id} className="question-container">
              <div className="question-header">
                {isEditing ? (
                  <input
                    type="text"
                    value={questionTexts[question.question_id]}
                    onChange={(e) =>
                      handleQuestionTextChange(e, question.question_id)
                    }
                  />
                ) : (
                  <h3>{question.question_text}</h3>
                )}
                <span className="total-votes">
                  総投票数:
                  {question.choices.reduce(
                    (total: number, choice: any) => total + choice.vote_counter,
                    0
                  )}
                </span>
              </div>
              <ul className="choice-list">
                {question.choices.map((choice: any) => (
                  <li key={choice.choice_id} className="choice-item">
                    {question.question_type === 1 ? (
                      <div className="choice-container">
                        <div className="radio-choice-wrapper">
                          <span>{choice.choice_text}</span>
                        </div>
                        {!isNaN(
                          choice.vote_counter /
                            question.choices.reduce(
                              (total: number, choice: any) =>
                                total + choice.vote_counter,
                              0
                            )
                        ) && (
                          <div
                            className="choice-vote-bar"
                            style={{
                              width: `${
                                (choice.vote_counter /
                                  question.choices.reduce(
                                    (total: number, choice: any) =>
                                      total + choice.vote_counter,
                                    0
                                  )) *
                                100
                              }%`,
                            }}
                          >
                            {Math.ceil(
                              (choice.vote_counter /
                                question.choices.reduce(
                                  (total: number, choice: any) =>
                                    total + choice.vote_counter,
                                  0
                                )) *
                                100
                            )}
                            %
                          </div>
                        )}
                      </div>
                    ) : question.question_type === 2 ? (
                      <div className="choice-container">
                        <div className="choice-wrapper">
                          <span>{choice.choice_text}</span>
                        </div>
                        {!isNaN(
                          choice.vote_counter /
                            question.choices.reduce(
                              (total: number, choice: any) =>
                                total + choice.vote_counter,
                              0
                            )
                        ) && (
                          <div
                            className="choice-vote-bar"
                            style={{
                              width: `${
                                (choice.vote_counter /
                                  question.choices.reduce(
                                    (total: number, choice: any) =>
                                      total + choice.vote_counter,
                                    0
                                  )) *
                                100
                              }%`,
                            }}
                          >
                            {Math.ceil(
                              (choice.vote_counter /
                                question.choices.reduce(
                                  (total: number, choice: any) =>
                                    total + choice.vote_counter,
                                  0
                                )) *
                                100
                            )}
                            %
                          </div>
                        )}
                      </div>
                    ) : (
                      question.question_type === 3 && (
                        <div className="text-answer-box">
                          {choice.textAnswers.map(
                            (
                              answer: { answer_id: number; text: string },
                              index: number
                            ) => (
                              <div key={index} className="text-answer">
                                <span>{answer.text}</span>
                              </div>
                            )
                          )}
                        </div>
                      )
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { View };
