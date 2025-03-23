import React from 'react';
import Convo from './Convo';
import { useAuth } from '../Auth/AuthProvider';
import { Navigate } from 'react-router-dom';

const Chat = () => {
  const { isAuthenticated } = useAuth();

  // If user is NOT authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }


  // If user IS authenticated, show the chat with logout button
  return (
    <div>
      <Convo />
    </div>
  );
};

export default Chat;