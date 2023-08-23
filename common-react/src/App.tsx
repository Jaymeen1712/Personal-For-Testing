import React from "react";
import logo from "./logo.svg";
import "./App.css";
import randomColor from "./utils/random-color";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard/dashboard";
import New3dGraph from "./components/graph/3d-graph";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" Component={Dashboard} />
        <Route path="/3d" Component={New3dGraph}/>
      </Routes>
    </div>
  );
}

export default App;
