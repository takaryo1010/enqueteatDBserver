import React, { useState } from 'react';
import './Home.css';

export const Home = (): JSX.Element => {
  const [formTitle, setFormTitle] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', choices: [''] },
  ]);

  const handleFormTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormTitle(e.target.value);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const handleChoiceChange = (
    qIndex: number,
    cIndex: number,
    value: string,
  ) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].choices[cIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', choices: [''] }]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const addChoice = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].choices.push('');
    setQuestions(newQuestions);
  };

  const removeChoice = (qIndex: number, cIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].choices.splice(cIndex, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = () => {
    // サーバーにデータを送信する処理を追加
    console.log({ formTitle, questions });
  };

  return (
    <div className="container">
      <h1 className="title">アンケートフォーム作成</h1>
      <div className="form-group">
        <label className="form-label">フォームタイトル:</label>
        <input
          className="form-input"
          type="text"
          value={formTitle}
          onChange={handleFormTitleChange}
        />
      </div>
      {questions.map((question, qIndex) => (
        <div key={qIndex} className="question-group">
          <div className="question-box">
            <label className="form-label">質問文:</label>
            <input
              className="form-input"
              type="text"
              value={question.questionText}
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
      <button className="submit-button" onClick={handleSubmit}>
        フォームを送信
      </button>
    </div>
  );
};
