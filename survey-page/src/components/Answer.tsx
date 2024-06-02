import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Answer.css";

const Answer: React.FC = () => {
  const { form_id } = useParams<{ form_id: string }>();
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedChoices, setSelectedChoices] = useState<{
    [key: number]: number[];
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/questions/${form_id}/form`
        );
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [form_id]);

  const handleChoiceToggle = (questionId: number, choiceId: number) => {
    setSelectedChoices((prevChoices) => {
      const selected = prevChoices[questionId] || [];
      const index = selected.indexOf(choiceId);
      if (index === -1) {
        return {
          ...prevChoices,
          [questionId]: [...selected, choiceId],
        };
      } else {
        return {
          ...prevChoices,
          [questionId]: selected.filter((id) => id !== choiceId),
        };
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedChoices),
      });
      // Handle response as needed
    } catch (error) {
      console.error("Error submitting votes:", error);
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
                      selectedChoices[question.question_id]?.includes(
                        choice.choice_id
                      )
                        ? "selected"
                        : "unselected"
                    }
                    onClick={() =>
                      handleChoiceToggle(question.question_id, choice.choice_id)
                    }
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
                  
                  {Math.ceil((choice.vote_counter /
                    question.choices.reduce(
                      (total: number, choice: any) =>
                        total + choice.vote_counter,
                      0
                    )) *
                    100)}
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
