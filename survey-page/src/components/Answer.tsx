import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Answer.css";


const Answer: React.FC = () => {
  const { form_id } = useParams<{ form_id: string }>();
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedChoices, setSelectedChoices] = useState<number[]>([]);
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
    console.log(selectedChoices);
    for (const choiceId of selectedChoices) {
      try {
        await fetch(`${url}choices/${choiceId}/vote`, {
          method: "PATCH",
        });
      } catch (error) {
        console.error("Error submitting data:", error);
      }
    }
    await fetchData(); // 送信完了後にデータを再取得
  };

  return (
    <div className="answer-container">
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
  );
};

export { Answer };
