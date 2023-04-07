import React from 'react';

export const MyContext = React.createContext({
    myBooleanVariable: true,
    setMyBooleanVariable: () => {},
  });