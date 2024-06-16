// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './components//Home';
import { Answer } from './components/Answer';
import { Callback } from './components/Callback';
import { View } from './components/View';
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Answer/:form_id" element={<Answer />} />
        <Route path="/Callback" element={<Callback />} />
        <Route path="/View/:form_id" element={<View />} />
      </Routes>
    </Router>
  );
};

export default App;
