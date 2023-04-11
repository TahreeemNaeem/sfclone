import './App.css';
import { BrowserRouter as Router, Route, Navigate,Routes } from 'react-router-dom';
import React, { useEffect, useState} from 'react';
import Connect from './components/ConnectWallet';
import Logo from './components/HeaderLodo'
import { ethers } from 'ethers';
import { MyContext } from './components/MyContext'; 
import Connected from './components/connected';
import Staking from './components/Staking';
import Mainpage from './components/mainPage';
import Staked from './components/Staked.jsx';
import Nfts from './components/Nfts.jsx';


function App() {

  const [Display, setDisplay] = useState();
  const [ myBooleanVariable,setMyBooleanVariable ] = useState(false);

  window.ethereum.on('disconnect', (error) => {
    setMyBooleanVariable(false);
 });

  window.ethereum.on('chainChanged', async (chainId) => {
      if(chainId==='0xaa36a7'){
        setDisplay(true)
        console.log(chainId)
      }
      else {
        setDisplay(false)
        console.log(chainId+"false")
      }
  });

  window.ethereum.on('accountChanged', async (chainId) => {
    if(chainId==='0xaa36a7'){
      setDisplay(true)
      console.log(chainId)
    }
    else {
      setDisplay(false)
      console.log(chainId+"false")
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
    <MyContext.Provider value={{ myBooleanVariable,setMyBooleanVariable,Display}} >
      <div className='App'>
        <div className='header'>
          <Logo/>
          {myBooleanVariable? <Connected/> : <Connect  />}
        </div>
        <div className='center-text'>
          {myBooleanVariable? Display? <Router>
      <div>
        < Staking/>
        <Routes>
        <Route
                exact
                path="/"
                render={() => {
                    return (
                      myBooleanVariable &&
                      <Navigate to="/Nfts" /> 
                    )
                }}
              />
        <Route path="/Staked" element={<Staked />} />
          <Route path="/Nfts" element={<Nfts />}  />
        </Routes>
      </div>
    </Router>:
          <h1 style={{
            fontSize:'calc(1.3rem + 1.3vw)',
            color:'white',
            marginTop:'20px',
            fontFamily: 'MyCustomFont',
          }}>
            Incorrect Chain Please Connect To Sepolia Testnet
          </h1> : <Mainpage  />}
          </div>
      </div>
    </MyContext.Provider>
  );
}

export default App;