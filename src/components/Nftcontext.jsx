import { createContext } from 'react';

export const NftDataContext = createContext({
    tokenCount: 0,
    setTokenCount: () => {},
});


