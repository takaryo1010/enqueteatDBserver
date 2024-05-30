// Answer.tsx
import React from 'react';
import { useParams } from 'react-router-dom';

const Answer: React.FC = () => {
  const { form_id } = useParams<{ form_id: string }>();

  return (
    <div>
      <h1>Answer Page</h1>
      <p>Info: {form_id}</p>
    </div>
  );
};

export { Answer };
