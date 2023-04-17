import React from 'react';

export const MyContext = React.createContext({
    isConnected: true,
    setIsConnected: () => {},
  });