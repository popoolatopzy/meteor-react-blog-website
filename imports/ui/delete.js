// imports/ui/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Hello } from './Hello.jsx';
import { Home } from './Home.jsx';

export const App = () => (
  <BrowserRouter>
    <div>

      {/* All routes must go inside <Routes> */}
      <Routes>
        <Route path="/info" element={<Home />} />
        <Route path="/hello" element={<Hello />} />
        {/* Optional: default route */}
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  </BrowserRouter>
);
