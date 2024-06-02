// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './components//Home';
import { Answer } from './components/Answer';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Answer/:form_id" element={<Answer />} />
      </Routes>
    </Router>
  );
};

export default App;
