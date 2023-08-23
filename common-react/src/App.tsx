import React from "react";
import logo from "./logo.svg";
import "./App.css";
import randomColor from "./utils/random-color";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard/dashboard";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" Component={Dashboard} />
      </Routes>
    </div>
  );
}

export default App;
