import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';

import Hero from './Components/Hero.jsx';
import Chat from './Components/ChatComponents/Chat.jsx';
import Nav from './Components/Nav.jsx';
import Signup from './Components/Auth/Signup.jsx';
import Login from './Components/Auth/Login.jsx';
import AuthProvider from './Components/Auth/AuthProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
      <Nav />
        <Routes>
          <Route path='/' element={<Hero />} />
          <Route path="/chat" element={<Chat />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
