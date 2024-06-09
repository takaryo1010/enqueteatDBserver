import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Answer.css";

const Answer: React.FC = () => {
  const { form_id } = useParams<{ form_id: string }>() ?? { form_id: "" };
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedChoices, setSelectedChoices] = useState<number[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [access_token, setAccess_token] = useState("");
  const [isReloded, setIsReloded] = useState(false);
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

  const handleChoiceToggle = (choiceId: number) => {
    setSelectedChoices((prevChoices) => {
      const index = prevChoices.indexOf(choiceId);
      if (index === -1) {
        return [...prevChoices, choiceId];
      } else {
        return prevChoices.filter((id) => id !== choiceId);
      }
    });
  };

 const handleSubmit = async () => {
   try {
     // Get user data
     const response = await fetch(`${url}users/${user?.email}`);
     const data = await response.json();

     // Check if the form ID matches
     const nowForm_id = window.localStorage.getItem("form_id");
     let check = true;
     for (const formId in data.forms) {
       if (data.forms[formId].form_id == nowForm_id) {
         check = false;
         console.log(
           "data.forms[form_id]:",
           data.forms[formId].form_id,
           nowForm_id
         );
         break;
       }
     }

     console.log("check:", check);

     if (check) {
       // Update user's form ID
       await fetch(`${url}users/${user?.email}`, {
         method: "PATCH",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           form_id: form_id,
         }),
       });

       // Vote for selected choices
       for (const choiceId of selectedChoices) {
         await fetch(`${url}choices/${choiceId}/vote`, {
           method: "PATCH",
           headers: {
             "Content-Type": "application/json",
           },
         });
       }
      alert("投票が完了しました。ありがとうございます。");
       // Fetch data again
       await fetchData();
     } else {
       alert(user?.name+"さんはすでにこのフォームに投票済みです。");
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
    const redirectUri = new URL("http://localhost:3001" + "/Callback");
    const scope =
      "openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    window.location.href = authUrl;
    
  };

  const handleSignoutClick = () => {
    window.location.href =
      new URL(window.location.href).origin + "/Answer/" + form_id;
    window.localStorage.removeItem("access_token");
    window.localStorage.removeItem("name");
    window.localStorage.removeItem("email");
    window.localStorage.removeItem("form_id");
    setAccess_token("");
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const access_token = window.localStorage.getItem("access_token");
   
    if (access_token) {
      setAccess_token(access_token);

    }

    const name = window.localStorage.getItem("name");
    const email = window.localStorage.getItem("email");

    if (name && email) {
      setUser({ name: name, email: email } as { name: string; email: string });
      setIsAuthenticated(true);
    }
    if (form_id) {
      window.localStorage.setItem("form_id", form_id);
    }
    console.log("isAuthenticated", isAuthenticated);

  }, []);

  return (
    <div className="answer-container">
      {!isAuthenticated ? (
        <div>
          <button onClick={handleAuthClick} className="auth-button">
            Googleでログイン
          </button>
          <h1>
            ログインしてフォームに回答することができます。
          </h1>
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
                  <li key={choice.choice_id} className="choice-container">
                    <div className="choice-wrapper">
                      <span>{choice.choice_text}</span>
                      <button
                        className={
                          selectedChoices.includes(choice.choice_id)
                            ? "selected"
                            : "unselected"
                        }
                        onClick={() => handleChoiceToggle(choice.choice_id)}
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
