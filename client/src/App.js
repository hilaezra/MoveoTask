import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LobbyPage from "./components/LobbyPage/LobbyPage";
import CodeBlockPage from "./components/CodeBlockPage/CodeBlockPage"

function App() {

    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LobbyPage />} />
          <Route path="/codeBlock/:blockId" element={<CodeBlockPage />} />
        </Routes>
      </BrowserRouter>  
    );
  }

export default App
