import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./Answer.css";
import { Injectable } from '@nestjs/common';

const Answer: React.FC = () => {
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
  const [csrfToken, setCsrfToken] = useState<Promise<string>>(Promise.resolve(""));
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
    setCsrfToken(fetchCSRFToken());
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

    // console.log("isAuthenticated", isAuthenticated);
  }, [location.search, form_id]);

  const handleChoiceToggle = (questionId: string, choiceId: number) => {
    setSelectedChoices((prevChoices) => {
      const questionChoices = prevChoices[questionId] || [];
      const index = questionChoices.indexOf(choiceId);
      if (index === -1) {
        return { ...prevChoices, [questionId]: [...questionChoices, choiceId] };
      } else {
        return {
          ...prevChoices,
          [questionId]: questionChoices.filter((id) => id !== choiceId),
        };
      }
    });
  };

  const handleChoiceToggleRadio = (questionId: string, choiceId: number) => {
    setSelectedChoices((prevChoices) => {
      const questionChoices = prevChoices[questionId] || [];
      const index = questionChoices.indexOf(choiceId);
      if (index === -1) {
        return { ...prevChoices, [questionId]: [choiceId] };
      } else {
        return {
          ...prevChoices,
          [questionId]: questionChoices.filter((id) => id !== choiceId),
        };
      }
    });
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
  const handleSubmit = async () => {
    for (const questionId in selectedChoices) {
      console.log("selectedChoices[questionId]", selectedChoices[questionId]);
      if (selectedChoices[questionId].length === 0) {
        alert("全ての質問に1つ以上回答してください。");
        return;
      }
    }
    for (const choiceId in inputTexts) {
      console.log("inputTexts[choiceId]", inputTexts[choiceId]);
      if (inputTexts[choiceId] === "") {
        alert("全ての質問に記述し、回答してください。");
        return;
      }
      if(inputTexts[choiceId].length > 100){
        alert("100文字以内で記述してください。");
        return;
      }
    }
    try {
      const response = await fetch(`${url}users/${user?.email}`);
      const data = await response.json();
      const nowForm_id = window.location.pathname.split("/")[2];
      console.log("nowForm_id", nowForm_id);
      let check = true;
      for (const formId in data.forms) {
        console.log("formId", data.forms[formId].form_id);
        if (data.forms[formId].form_id == nowForm_id) {
          check = false;
          break;
        }
      }

      if (check) {
        await fetch(`${url}users/${user?.email}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "csrf-token": await csrfToken,
          },
          body: JSON.stringify({
            form_id: form_id,
          }),
          credentials: "include",
        });

        for (const questionId in selectedChoices) {
          if (selectedChoices[questionId].length === 0) {
            alert("全ての質問に1つ以上回答してください。");
            return;
          }
          for (const choiceId of selectedChoices[questionId]) {
            await fetch(`${url}choices/${choiceId}/vote`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "csrf-token": await csrfToken,
              },
              credentials: "include",
            });
          }
        }
        for (const choice_id in inputTexts) {
          await fetch(`${url}text-answer`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "csrf-token": await csrfToken,
            },
            body: JSON.stringify({
              text: inputTexts[choice_id],
              choice: {
                choice_id: choice_id,
              },
            }),
            credentials: "include",
          });
          await fetch(`${url}choices/${choice_id}/vote`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "csrf-token": await csrfToken,
            },
            credentials: "include",
          });
        }
        alert("投票が完了しました。ありがとうございます。");
        await fetchData();
      } else {
        alert(user?.name + "さんはすでにこのフォームに投票済みです。");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleAuthClick = () => {
    if (form_id) {
      window.localStorage.setItem("form_id", form_id);
    }
    const clientId =
      "606359673208-a1tb3fao58u4sbla1gn0cg28809la9an.apps.googleusercontent.com";
    const redirectUri = new URL(window.location.origin + "/Callback");
    console.log("redirectUri", redirectUri);
    const scope =
      "openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    window.location.href = authUrl;
  };

  const handleSignoutClick = () => {
    window.location.href =
      new URL(window.location.href).origin + "/Answer/" + form_id;
    setUser(null);
    setIsAuthenticated(false);
  };

  const handleInputText =
    (questionId: string, choiceId: number) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputTexts((prevInputTexts) => ({
        ...prevInputTexts,
        [choiceId]: event.target.value,
      }));
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
                      <li key={choice.choice_id} className="choice-container">
                        <div className="radio-choice-wrapper">
                          <span>{choice.choice_text}</span>
                          <button
                            className={
                              (
                                selectedChoices[question.question_id] || []
                              ).includes(choice.choice_id)
                                ? "selected"
                                : "unselected"
                            }
                            onClick={() =>
                              handleChoiceToggleRadio(
                                question.question_id,
                                choice.choice_id
                              )
                            }
                          >
                            ●
                          </button>
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
                      </li>
                    ) : question.question_type === 2 ? (
                      <li key={choice.choice_id} className="choice-container">
                        <div className="choice-wrapper">
                          <span>{choice.choice_text}</span>
                          <button
                            className={
                              (
                                selectedChoices[question.question_id] || []
                              ).includes(choice.choice_id)
                                ? "selected"
                                : "unselected"
                            }
                            onClick={() =>
                              handleChoiceToggle(
                                question.question_id,
                                choice.choice_id
                              )
                            }
                          >
                            選択
                          </button>
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
                      </li>
                    ) : (
                      question.question_type === 3 && (
                        <input
                          onChange={handleInputText(
                            question.question_id,
                            choice.choice_id
                          )}
                        ></input>
                      )
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button className="submit-button" onClick={handleSubmit}>
            送信
          </button>
        </div>
      )}
    </div>
  );
};

export { Answer };
