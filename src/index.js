import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Profile from './App';
//import reportWebVitals from './reportWebVitals';
import { WagmiConfig, createClient } from 'wagmi'
import { getDefaultProvider } from 'ethers'

const client = createClient({
 autoConnect: true,
 provider: getDefaultProvider(),
})

function App() {
 return (
 <WagmiConfig client={client}>
 <Profile />
 </WagmiConfig>
 )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

