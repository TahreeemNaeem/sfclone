import { ethers } from 'ethers';
import React, { useState, useEffect,useRef,useCallback } from 'react';
import stakingabi from '../assets/stakingabi.json';
import logo from '../assets/header.22c6a9d7f5e5c2e67ec1.png'

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default function SNft(props) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const [address, setAddress] = useState();
  const [stakednfts, setStakedNfts] = useState();
  const[ended,setended] = useState(false);
  const [loader, setLoader] = useState(true);
  const [time, setTime] = useState();
  const [endTime, setEndTime] = useState();
  const id=props.id;
  const image='';
  setEndTime(props.endtime);
  const stakingcontract = new ethers.Contract('0x000e70E0bA6652EED330C4861d4f7000D96D91aB', stakingabi, (signer));

  
  useEffect(() => {
    async function fetchData() {
      try {
        const userAddress = await signer.getAddress();
        setAddress(userAddress.toString());
       
        gettimeremaining()
        setLoader(false)
      } catch (error) {
          console.log(error);
      }
    }
    fetchData();
  },[]);
  const updateRemainingTime = useCallback(() => {
      gettimeremaining();
      setLoader(false)
  });

  useInterval(updateRemainingTime, 1000);


  function gettimeremaining() {
    const date = new Date();
    const currenttimestamp = date.getTime() / 1000;
    const timestamp = endTime - currenttimestamp;
    if(currenttimestamp<endTime){
      const secondsInADay = 86400;
      const secondsInAnHour = 3600;
      const secondsInAMinute = 60;
      const formatWithLeadingZero = (number) => number.toString().padStart(2,'0');
      const days = formatWithLeadingZero(Math.floor(timestamp / secondsInADay));
      const hours = formatWithLeadingZero(Math.floor((timestamp % secondsInADay) / secondsInAnHour));
      const minutes = formatWithLeadingZero(Math.floor((timestamp % secondsInAnHour) / secondsInAMinute));
      const seconds = formatWithLeadingZero(Math.floor(timestamp % secondsInAMinute));
      setTime(`${days}:${hours}:${minutes}:${seconds}`);
    }
    else {
      setended(true)
    }
  }
  async function unStake(id){
    const stake = await stakingcontract.withdrawStake(id);
    await stake.wait();
    const nids = await stakingcontract.getStakedTokenIds(address);
    const ids = nids.map((id) => id.toNumber());
    setStakedNfts(ids);
    //setDisplayDetail(false);
  }
 
  return (
    <div>
    <div>
     { ended ? 
     <button className='buttons' onClick={()=>unStake(id)}>WithDraw Stake</button>
      :loader ?
      <div className="loader"></div> :
      <span className='textstyle' style={{
        fontSize: '20px',
      }}>{time}</span>}
    </div>
 </div>
  );
}
  