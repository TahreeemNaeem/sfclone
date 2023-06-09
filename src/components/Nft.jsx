import { ethers } from 'ethers';
import React, { useState, useEffect ,useContext} from 'react';
import stakingabi from '../assets/stakingabi.json';
import ABI from '../assets/myNFTContract.json';
import {NftDataContext} from './Nftcontext';

export default function Nft() {
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const {id,Image,duration,tokenCount,setTokenCount } = useContext(NftDataContext);
  const [approvedNfts, setApprovedNfts] = useState();
  const [buttonStatus, setButtonStatus] = useState("Approve");
  const [address, setAddress] = useState();
  const [loader, setLoader] = useState(true);

  const myNFTContract = new ethers.Contract(
    '0x57c02EA259CE9a4b1030CBe21A1F1f215E5A1276',
    ABI,
    provider.getSigner()
  );
  const stakingContract = new ethers.Contract(
    '0xa2402b09fA456D7F39F0f3dF1a6b9CFa50783556',
    stakingabi,
    provider.getSigner()
  );

  useEffect(() => {
    async function fetchData() {
    const userAddress = await provider.getSigner().getAddress();
    setAddress(userAddress.toString());}
    fetchData();
    approvednfts(id);
  },[address,tokenCount]);

  async function approve(id) {
    console.log(id);
    setButtonStatus("Approving...");
    try {
      const approved = await myNFTContract.approve(
        "0xa2402b09fA456D7F39F0f3dF1a6b9CFa50783556",
        id
      );
      setButtonStatus("load");
      await approved.wait();
      setApprovedNfts(true);
      setButtonStatus("Stake");
    } catch (error) {
       if(error.code==='ACTION_REJECTED'){
        console.log("failed")
        setButtonStatus("Failed!");
        resetButtonStatus();
       }
       console.log(error);
       setButtonStatus("Failed!");
        resetButtonStatus();
    }
  }

  async function stake(id) {
    setButtonStatus( "Staking..." );
    try {
      console.log(id,duration)
      const staked = await stakingContract.addStake(id, duration);
      setButtonStatus( "load");
      await staked.wait();
      const tokencount = await myNFTContract.balanceOf(address);
      setTokenCount(tokencount.toNumber());
      console.log('done')
    } catch (error) {
      if(error.code==='ACTION_REJECTED'){
      setButtonStatus("Failed!");
      resetButtonStatus();
      }
      console.log(error)
      setButtonStatus("Failed!");
        resetButtonStatus();
    }
  }

  async function approvednfts(nftIds) {
      if ((await myNFTContract.getApproved(nftIds)).toString() === '0xa2402b09fA456D7F39F0f3dF1a6b9CFa50783556'){
          setApprovedNfts(true)
          setButtonStatus("Stake")
      }
      setLoader(false)
  }
  const resetButtonStatus = () => {
    setTimeout(() => {
      if (!approvedNfts) {
        setButtonStatus("Approve");
      } else {
        setButtonStatus("Stake");
      }
    }, 2000);
  };

  return (
    <div>
        <div className='NFT'>
                  <img
                  src={Image}
                  alt={`image ${1}`}
                  style={{
                    height: '160px',
                    width: '160px'
                  }}
                />
                </div>
           {loader ?
                    <div className="loader"></div> :
                    (approvedNfts ? (
                      buttonStatus === "load" ?
                      <div className="loader"></div> :
                      <button
                        style={{ backgroundColor: '#499bfa' }}
                        className="buttons textstyle"
                        onClick={() => stake(id)}
                        disabled={buttonStatus === "staking"}
                      >
                        {buttonStatus}
                      </button>
                    ) : (
                      buttonStatus === "load" ?
                      <div className="loader"></div> :
                      <button
                        className="buttons textstyle"
                        onClick={() => approve(id)}
                        disabled={buttonStatus === "approving"}
                      >
                        {buttonStatus}
                      </button>
                    ))}
    </div>
  );
}