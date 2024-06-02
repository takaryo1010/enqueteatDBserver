import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Answer.css";
import { url } from "inspector";

const Answer: React.FC = () => {
  const { form_id } = useParams<{ form_id: string }>();
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedChoices, setSelectedChoices] = useState<number[]>([]); // クエスチョンIDに関係なく選択された選択肢のIDを格納する配列
  const url = `http://localhost:3000/`;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${url}questions/${form_id}/form`
        );
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [form_id]);

  const handleChoiceToggle = (choiceId: number) => {
    setSelectedChoices((prevChoices) => {
      const index = prevChoices.indexOf(choiceId);
      if (index === -1) {
        return [...prevChoices, choiceId]; // 選択された選択肢IDを配列に追加
      } else {
        return prevChoices.filter((id) => id !== choiceId); // 選択された選択肢IDを配列から削除
      }
    });
  };

  const handleSubmit = async () => {
    console.log(selectedChoices);
    for (const choiceId of selectedChoices) {
      try {
        await fetch(
          `${url}choices/${choiceId}/vote`,
          {
            method: "PATCH",
          }
        );
      } catch (error) {
        console.error("Error submitting data:", error);
      }
    }
  };

  return (
    <div className="answer-container">
      <h1>{questions.length > 0 ? questions[0].form.form_title : ""}</h1>
      <h2>質問一覧</h2>
      {questions.map((question) => (
        <div key={question.question_id} className="question-container">
          <h3>{question.question_text}</h3>
          <ul className="choice-list">
            {question.choices.map((choice: any) => (
              <li key={choice.choice_id} className="choice-container">
                <div className="choice-wrapper">
                  <span>{choice.choice_text}</span>
                  <button
                    className={
                      selectedChoices.includes(choice.choice_id) // 選択された選択肢IDが配列に含まれているかを確認
                        ? "selected"
                        : "unselected"
                    }
                    onClick={() => handleChoiceToggle(choice.choice_id)}
                  >
                    選択
                  </button>
                </div>
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
