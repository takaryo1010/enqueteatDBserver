import React from "react";
import "./Home.css";

type QuestionProps = {
  form_id: number;
  questions: {
    question_text: string;
    question_type: number;
    choices: string[];
  }[];
  setQuestions: React.Dispatch<
    React.SetStateAction<
      { question_text: string; question_type: number; choices: string[] }[]
    >
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

  const handleQuestionTypeChange = (index: number, value: number) => {
    const newQuestions = [...questions];
    newQuestions[index].question_type = value;
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
    setQuestions([
      ...questions,
      { question_text: "", question_type: 1, choices: [""] },
    ]);
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
            <select
              name="question_type"
              value={question.question_type}
              onChange={(e) =>
                handleQuestionTypeChange(qIndex, Number(e.target.value))
              }
            >
              <option value="1">ラジオボタン</option>
              <option value="2">チェックボックス</option>
              <option value="3">テキスト</option>
            </select>
            <label className="form-label">質問文:</label>

            <input
              className="form-input"
              type="text"
              value={question.question_text}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
            />

            {question.question_type === 1 || question.question_type === 2 ? (
              <div>
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
              </div>
            ) : null}

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
