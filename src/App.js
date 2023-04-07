import './App.css';
import React, { useEffect, useState} from 'react';
import Connect from './components/connectwallet';
import Logo from './components/HeaderLodo'
import { ethers } from 'ethers';
import { MyContext } from './components/MyContext';

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

  useEffect(() => {
    
    if(window.ethereum){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      provider.getNetwork().then((network) => {
        if(network.chainId===11155111)
        setDisplay(true);
        else
        setDisplay(false);
      });

      const checkConnection = async () => {
      const signer = await provider.getSigner();
      if (await signer.getAddress() !== null) {
        setMyBooleanVariable(true);
      } else {
        setMyBooleanVariable(false);
      }
      };
      checkConnection();
    }

    return () => {
      window.ethereum.on('disconnect', (error) => {
        console.log('diconnect',error)
     });
    }
  },);
  return (
    <MyContext.Provider value={{ myBooleanVariable,setMyBooleanVariable,Display}} >
      <div className='App'>
        <div className='header'>
          <Logo/>
          <Connect />
        </div>
      </div>
    </MyContext.Provider>
  );
}

export default App;