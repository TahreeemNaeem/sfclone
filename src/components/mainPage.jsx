import { ethers } from 'ethers';
import React, { useContext, useState,useEffect } from 'react';
import { MyContext } from './MyContext';
import logo from '../assets/header.22c6a9d7f5e5c2e67ec1.png';
import ABI from '../assets/stakingabi.json'
import myNFTContrac from '../assets/myNFTContract.json'
export default function Mainpage() {
  const {myBooleanVariable,setMyBooleanVariable } = useContext(MyContext);
  const [rewardReceived,setRewardReceived] = useState('')
  const [percent,setPercentage] = useState('')
  const [stakeCount,setStakeCount] = useState('')
  const [totalSupply,settotalSupply] = useState();
  const provider= (new ethers.providers.Web3Provider(window.ethereum));
  const signer = provider.getSigner()

  const StakingContract =  new ethers.Contract('0xE0BD2f94907F34D94a09f3820d274a35BE5Eab4a', ABI, (provider.getSigner()));
  const myNFTContract =  new ethers.Contract('0x82E74b814D1152317b9402918cF41BDdF1148599', myNFTContrac, (provider.getSigner())); 
  useEffect(() => {
    const stakecountpromise =  StakingContract.stakeCount();
    const rewardreceivedpromise =  StakingContract.totalRewardReceived();
    const totalSupplypromise = myNFTContract.totalSupply();
    stakecountpromise.then((stakecount) => {
        setStakeCount(stakecount.toString());
    });
    rewardreceivedpromise.then((rewardreceived) => {
        setRewardReceived((rewardreceived.toString()));
    });

    totalSupplypromise.then((totalSupply) => {
      settotalSupply((totalSupply.toString()));
  });

     },);
  return(
    <div >
      <div className="text-with-line">
      <div className='text'>
        <h1>{stakeCount} of {totalSupply}</h1>
        <h1
        style={{fontSize:'20px',paddingLeft:'5px',display:'inline-block',paddingTop:'10px'}}>NFTs</h1>
        <h1 className='text1'>Staked</h1>
      </div>

      <div className="line"></div>

      <div className='text'>
        <h1>{(stakeCount*100/totalSupply).toFixed(3)}</h1>
        <h1
        style={{fontSize:'20px',paddingLeft:'5px',display:'inline-block',paddingTop:'10px'}}>of NFTs</h1>
        <h1 className='text1' >Staked</h1>
      </div>
    </div>
    <div className='text' style={{
     textAlign:'center',
     width:'100%',
     marginTop:'50px',
     display:'block'
    }}>
       <div style={{ display:'inline-flex'}}> 
        <h1 style={{display:'inline-flex',alignItems:'center'}}> {rewardReceived}
        <img style={{marginLeft:'5px',width:'30px',height:'30px',display:'inline-flex'}}  src={logo} alt="Logo" /></h1>

         <h1 style={{marginLeft:'5px', fontSize:'20px' , display:'inline-flex',alignItems:'center'}}>HoHoHo</h1></div>
     
      <div><h1 className='text1'>Rewarded</h1></div>
    </div>

        <h1 className='connect-wallet-text'
        style={{
            color:'white',
            fontFamily: 'MyCustomFont',
            lineHeight:'auto',
            fontSize:'calc(1.3rem + 1.2vw)',
            width:'max-content',
            height:'max-content'
            
        }}>Please Connect Your Wallet</h1>
    </div>
  );
}