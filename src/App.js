import './App.css';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import React, { useEffect, useState} from 'react';
import Connect from './components/wallet';
import Logo from './components/HeaderLodo'
import { ethers } from 'ethers';
import { MyContext } from './components/MyContext'; 
import Connected from './components/connected';
import Staking from './components/Staking';
import Mainpage from './components/mainPage';
import Staked from './components/StakedNfts.jsx';
import Nfts from './components/NftsList.jsx';

function App() {

  const [Display, setDisplay] = useState();
  const [ isConnected,setIsConnected ] = useState(false);

  window.ethereum.on('disconnect', (error) => {
    setIsConnected(false);
 });

  window.ethereum.on('chainChanged', async (chainId) => {
      if(chainId==='0xaa36a7'){
        setDisplay(true)
        console.log(chainId)
        window.location.reload();
      }
      else {
        setDisplay(false)
        console.log(chainId+"false")
        window.location.reload();
      }
  });

  window.ethereum.on('accountChanged', async (chainId) => {
    if(chainId==='0xaa36a7'){
      setDisplay(true)
      console.log(chainId)
      window.location.reload();
    }
    else {
      setDisplay(false)
      console.log(chainId+"false")
      window.location.reload();
    }
});

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if(window.ethereum){
      provider.getNetwork().then((network) => {
        if(network.chainId===11155111)
        setDisplay(true);
        else
        setDisplay(false);
      });

    }
   
  },);
  return (
    <MyContext.Provider value={{ isConnected,setIsConnected,Display}} >
      <div className='App'>
        <div className='header'>
          <Logo/>
          {isConnected? <Connected/> : <Connect  />}
        </div>
        <div>
          {isConnected? Display?
       <Router>
      <div>
        < Staking/>
        <Routes>
          <Route path="/Staked" element={<Staked />} />
          <Route path="/Nfts" element={<Nfts />}  />
        </Routes>
      </div>
    </Router>:
          <h1 className='textstyle' style={{
            fontSize:'calc(1.3rem + 1.3vw)',
            marginTop:'20px',
          }}>
            Incorrect Chain Please Connect To Sepolia Testnet
          </h1> : <Mainpage  />}
          </div>
      </div>
    </MyContext.Provider>
  );
}

export default App;