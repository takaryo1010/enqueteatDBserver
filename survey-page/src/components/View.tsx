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

  const url = `http://localhost:3000/`;

  const fetchData = async () => {
    try {
      const response = await fetch(`${url}questions/${form_id}/form`);
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching data:", error);
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
          <p>ログイン中: {user?.name}</p>
          <button onClick={handleSignoutClick} className="auth-button">
            ログアウト
          </button>
        </div>
      )}
      {isAuthenticated && (
        <div>
          <h1>{questions.length > 0 ? questions[0].form.form_title : ""}</h1>
          <h2>質問一覧</h2>
          {questions.map((question) => (
            <div key={question.question_id} className="question-container">
              <div className="question-header">
                <h3>{question.question_text}</h3>
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
