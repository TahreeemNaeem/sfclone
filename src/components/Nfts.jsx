import { ethers } from 'ethers';
import React, { useContext, useState,useEffect } from 'react';
import { MyContext } from './MyContext';
import { Link } from 'react-router-dom';
import stakingabi from '../assets/stakingabi.json';
import ABI from '../assets/myNFTContract.json'

export default function Nfts(){
  const provider= (new ethers.providers.Web3Provider(window.ethereum));
  const signer = provider.getSigner();
  const [nftIds, setNftIds] = useState([]);
  const [images,setImages]= useState([])
  const [address,setAddress] = useState();
  const [tokencount,settokencount] = useState();
  const [approvedNfts, setApprovedNfts] = useState([]);

  
  const myNFTContract =  new ethers.Contract('0x82E74b814D1152317b9402918cF41BDdF1148599', ABI, (provider.getSigner())); 
  const stakingcontract =  new ethers.Contract('0xE0BD2f94907F34D94a09f3820d274a35BE5Eab4a', stakingabi, (provider.getSigner())); 


    async function approve(index){
       const id = nftIds[index];
       console.log(id)
       const approved =await myNFTContract.approve(id,'0xE0BD2f94907F34D94a09f3820d274a35BE5Eab4a');
       approved.wait();
       setApprovedNfts([...approvedNfts, index]);
    }

    async function stake(index){
      const id = nftIds[index];
      console.log(id)
      const staked =await stakingcontract.addStake(id,1);
      staked.wait();
   }
   const alltokenidspromise = myNFTContract.allTokensOwned(address);
   const tokencountpromise = myNFTContract.balanceOf(address);

    useEffect(() => {
      signer.getAddress().then((resolvedAddress) => {
        setAddress(resolvedAddress.toString());
      });
      alltokenidspromise.then((resolvedtokenids) => {
        const ids = resolvedtokenids.map((id) => id.toNumber());
        setNftIds(ids)
        getImage(ids)
      });
       
      tokencountpromise.then((resolvedcount) => {
        settokencount(resolvedcount.toNumber());
      });
      
      approvednfts(nftIds)
  });
 


  async function approvednfts(nftIds) {
    let nfts =[]
    for (let i = 0; i < tokencount; i++) {
      if(( await myNFTContract.approved(nftIds[i])).toString()!=='0x0000000000000000000000000000000000000000')
         nfts[i]=i;
    }
    setApprovedNfts(nfts)
  }
    async function getImage(ids) {
      let image =[]
      for (let i = 0; i < tokencount; i++) {
        const img = await myNFTContract.tokenURI(ids[i]);
        image[i]=img
      }
      setImages(image)
    }
    
  return (
    <div className="nft-container" style={{border:'2px solid'}}>

      {images.map((image, index) => (
        <div>
          <div className='NFT'><img
          key={index}
          src={image}
          alt={`image ${index + 1}`}
          style={{
            height:'160px',
            width:'160px'
          }}
           /></div>
          <div>
          {approvedNfts.includes(index) ? (
            <button style={{
              backgroundColor:'red' ,
               height: '30px',
               width: 'max-content',
               color: 'white',
               fontSize: '20px',
               border: 'none',
               cursor: 'pointer',
               margin: '0 auto',
               borderRadius: '10px',
               boxShadow: 'none',
               fontFamily: 'myCustomFont'
             }} onClick={() => stake(index)} >Stake</button>
          ) : (
            <button  style={{
              backgroundColor:'red' ,
               height: '30px',
               width: 'max-content',
               color: 'white',
               fontSize: '20px',
               border: 'none',
               cursor: 'pointer',
               margin: '0 auto',
               borderRadius: '10px',
               boxShadow: 'none',
               fontFamily: 'myCustomFont'
             }} onClick={() => approve(index)}>Approve</button>
          )}
           </div>
        </div>
      ))}
    </div>
  );
}