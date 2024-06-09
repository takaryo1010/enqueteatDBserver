import React from "react";
import "./Home.css";

type QuestionProps = {
  form_id: number;
  questions: { question_text: string; choices: string[] }[];
  setQuestions: React.Dispatch<
    React.SetStateAction<{ question_text: string; choices: string[] }[]>
  >;
};

export const Question = ({
  form_id,
  questions,
  setQuestions,
}: QuestionProps): JSX.Element => {
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

  return (
    <div>
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
            <button className="add-button" onClick={() => addChoice(qIndex)}>
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
    </div>
  );
};
