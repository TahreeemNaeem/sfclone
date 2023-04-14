import { ethers } from 'ethers';
import React, { useContext, useState,useEffect } from 'react';
import { MyContext } from './MyContext';
import { Link } from 'react-router-dom';
import stakingabi from '../assets/stakingabi.json';
import ABI from '../assets/myNFTContract.json'
export default function Staked(){
    const provider= (new ethers.providers.Web3Provider(window.ethereum));
    const signer = provider.getSigner();
    const [images,setImages]= useState([])
    const [address,setAddress] = useState();
    const [stakednfts, setStakedNdts] = useState([]);
    const [endTimes, setEndTimes] = useState([]);

    const myNFTContract =  new ethers.Contract('0x82E74b814D1152317b9402918cF41BDdF1148599', ABI, (signer)); 
    const stakingcontract =  new ethers.Contract('0xE0BD2f94907F34D94a09f3820d274a35BE5Eab4a', stakingabi, (signer)); 
   
    const stakedokensidpromise =stakingcontract.getStakedTokenIds(address);
    useEffect(() => {
       
        signer.getAddress().then((resolvedAddress) => {
          setAddress(resolvedAddress.toString());
        });
        stakedokensidpromise.then(async (tokenids) => {
            const ids = tokenids.map((id) => id.toNumber());
            setStakedNdts(ids);
      
            const endTimesPromises = ids.map((id) => stakingcontract.getEndTime(id));
            const resolvedEndTimes = await Promise.all(endTimesPromises);
            setEndTimes(resolvedEndTimes.map((time) => time.toNumber()));
      
            await getImage(ids);
          });
    });

    function gettimeremaining(endTime) {
        const date = new Date();
        const currenttimestamp = date.getTime() / 1000;
        const timestamp = endTime - currenttimestamp;
        const secondsInADay = 86400;
        const secondsInAnHour = 3600;
        const secondsInAMinute = 60;
        const formatWithLeadingZero = (number) => number.toString().padStart(2, '0');
    
        const days = formatWithLeadingZero(Math.floor(timestamp / secondsInADay));
        const hours = formatWithLeadingZero(Math.floor((timestamp % secondsInADay) / secondsInAnHour));
        const minutes = formatWithLeadingZero(Math.floor((timestamp % secondsInAnHour) / secondsInAMinute));
        const seconds = formatWithLeadingZero(Math.floor(timestamp % secondsInAMinute));
    
        return `${days}:${hours}:${minutes}:${seconds}`;
      }
    async function getImage(ids) {
        let image =[]
        for (let i = 0; i < ids.length; i++) {
          const img = await myNFTContract.tokenURI(ids[i]);
          image[i]=img
        }
        setImages(image)
      }
     
    
  return (
    <div className="nft-container" style={{ border: '2px solid' }}>
      {images.map((image, index) => (
        <div>
          <div className='NFT'>
            <img
              key={index}
              src={image}
              alt={`image ${index + 1}`}
              style={{
                height: '160px',
                width: '160px'
              }}
            />
          </div>
          <div>
            <span style={{
              color: 'white',
              fontSize: '20px',
              margin: '0 auto',
              fontFamily: 'myCustomFont'
            }} >{gettimeremaining(endTimes[index])}</span>
          </div>
        </div>
      ))}
    </div>
  );
}