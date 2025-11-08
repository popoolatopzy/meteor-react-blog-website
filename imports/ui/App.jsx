// imports/ui/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Home } from "./Home.jsx";
import { SinglePost } from "./SinglePost.jsx";
import { NewPost } from "./NewPost.jsx";

const { public: publicSettings, HYGRAPH_TOKEN } = Meteor.settings;

const HYGRAPH_API = publicSettings.HYGRAPH_API;


export const App = () => (

  <BrowserRouter>
    <div>

      <Routes>
        <Route path="/" element={<Home HYGRAPH_API={HYGRAPH_API} />} />
        <Route path="/post/:id" element={<SinglePost HYGRAPH_API={HYGRAPH_API} />} />
        <Route path="/new-post" element={<NewPost HYGRAPH_API={HYGRAPH_API} HYGRAPH_TOKEN={HYGRAPH_TOKEN} />} />
      </Routes>
    </div>
  </BrowserRouter>
);
