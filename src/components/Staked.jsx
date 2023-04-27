import { ethers } from 'ethers';
import React, { useState, useEffect } from 'react';
import stakingabi from '../assets/stakingabi.json';
import ABI from '../assets/myNFTContract.json';
import logo from '../assets/header.22c6a9d7f5e5c2e67ec1.png'

export default function Staked() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const [images, setImages] = useState([]);
  const [address, setAddress] = useState();
  const [stakednfts, setStakedNfts] = useState([]);
  const [endTimes, setEndTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const[ended,setended] = useState([]);
  const[displayDetail,setDisplayDetail] = useState(false);
  const [stakeDuration, setStakeDuration] = useState();
  const [tokenid, setTokenId] = useState();
  const [stakeReward, setstakeReward] = useState();
  const [noStakedNfts,setNoStakedNfts] = useState(false);
  const [loader, setLoader] = useState(true);
  const [time, setTime] = useState([]);
  const myNFTContract = new ethers.Contract('0x3F5A0bB76577e96A2cA9b3C8065D97a8A78d5FdB', ABI, (signer));
  const stakingcontract = new ethers.Contract('0x000e70E0bA6652EED330C4861d4f7000D96D91aB', stakingabi, (signer));

  useEffect(() => {
    async function fetchData() {
      try {
        const userAddress = await signer.getAddress();
        setAddress(userAddress.toString());
        const nids = await stakingcontract.getStakedTokenIds(userAddress);
        const ids = nids.map((id) => id.toNumber());
        setStakedNfts(ids);
        const resolvedEndTimes = await Promise.all(ids.map((id) => stakingcontract.getEndTime(id)));
        setEndTimes(resolvedEndTimes.map((time) => time.toNumber()));
        await getImage(ids);
      } catch (error) {
        if (error.reason === "No NFT staked!") {
          setNoStakedNfts(true);
        } else {
          console.log(error);
        }
      }
    }
    fetchData();
  });

  function gettimeremaining() {
    const date = new Date();
    const currenttimestamp = date.getTime() / 1000;
    let times =[];
    for(let i=0;i<stakednfts.length;i++){
    let endTime=endTimes[i];
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
      times[i]=`${days}:${hours}:${minutes}:${seconds}`;
    }
    else {
      let stakeended = ended;
      stakeended.push(i);
      setended(stakeended)
    }
   }
   setTime(times);
  }
  async function unStake(index){
    const id=stakednfts[index];
    const stake = await stakingcontract.withdrawStake(id);
    await stake.wait();
    const nids = await stakingcontract.getStakedTokenIds(address);
    const ids = nids.map((id) => id.toNumber());
    setStakedNfts(ids);
    setDisplayDetail(false);
    const currentindex= ended.indexOf(index);
    ended[currentindex]=-1;
  }
async function getImage(ids) {
    let image =[];
    for (let i = 0; i < ids.length; i++) {
      const img = await myNFTContract.tokenURI(ids[i]);
      image[i]=img+'.png';
    }
    setImages(image);
    setLoading(false);
    if(endTimes.length===ids.length){
      gettimeremaining();
      setLoader(false)
    }
  }

  async function stakedNftDetail(index){
    const id=stakednfts[index];
    setTokenId(id);
    const duration = (Math.floor((await stakingcontract.getStakeDuration(id)) / 86400));
    setStakeDuration(duration);
    const reward= (Math.ceil((await stakingcontract.stakeRewardCalculator(duration))/10**18));
    setstakeReward(reward);
    setDisplayDetail(true);
  }
 
  return (
    <div>
      {noStakedNfts?
      (<div className='nft-container textstyle'><h1>You don't have any NFTs staked!</h1></div>):
         ( <div>
          
          {loading ? (
              <div className='loading textstyle'>Loading...</div>
                ) : (
              <div>
                    <div className=' stakedNFTDetails '
                 style={{
                  color:'#fff',
                  fontFamily:'MyCustomFont',
                  fontSize:'12px'
                }}>
                  {displayDetail?
                    <div>
                    <h1>Token#{tokenid}</h1>
                    <h1>Stake Duration: {stakeDuration} Days</h1>
                    <h1>Stake Reward: {stakeReward}<img style={{marginLeft:'5px',width:'30px',height:'30px',verticalAlign:'middle'}}  src={logo} alt="Logo" /></h1>
                    </div>:
                    <h1 style={{lineHeight:"20px"}}>Click on NFT to view its details!</h1>
                   
                  }
                   </div>
                   <div className="nft-container" style={{ border: '2px solid' }}>
                   {images.map((image, index) => (
                         <div key={index}>
                         <div className='NFT' onClick={()=>stakedNftDetail(index)}>
                           <img
                             src={image}
                             alt={`image ${index + 1}`}
                             style={{
                               height: '160px',
                               width: '160px'
                             }}
                           />
                         </div>
                         <div>
                          { ended.includes(index) ? 
                          <button className='buttons' onClick={()=>unStake(index)}>WithDraw Stake</button>
                           :loader ?
                           <div className="loader"></div> :
                           <span className='textstyle' style={{
                             fontSize: '20px',
                           }}>{time[index]}</span>}
                         </div>
                       </div>
                     ))}
                   </div>
              </div> )}
         </div>)
       }
    </div>
  );
}
  