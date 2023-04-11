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
  
  const myNFTContract =  new ethers.Contract('0x7d17E6348291ff3be3c580bAEF2Fd221f284ff3A', ABI, (provider.getSigner())); 


    async function approve(index){
       const id = nftIds[index];
       console.log(id)
       const approved =await myNFTContract.approve(id,'0xE0BD2f94907F34D94a09f3820d274a35BE5Eab4a');
       approved.wait();
       setApprovedNfts([...approvedNfts, index]);
    }

    useEffect(() => {
      signer.getAddress().then((resolvedAddress) => {
        setAddress(resolvedAddress.toString());
      });

      const alltokenidspromise = myNFTContract.allTokensOwned(provider.getSigner().getAddress());
    
      alltokenidspromise.then(async (tokenids) => {
        const ids = tokenids.map((id) => id.toNumber());
        setNftIds(ids)
       await getImage(ids)
      });
       
      const tokencountpromise = myNFTContract.balanceOf(address);
    
      tokencountpromise.then((balance) => {
        settokencount(balance.toNumber());
      });
      
      async function approvednfts(nftIds) {
        let nfts =[]
        for (let i = 0; i < tokencount; i++) {
          if(( await myNFTContract.approved(nftIds[i])).toString()!=='0x0000000000000000000000000000000000000000')
             nfts[i]=i;
        }
        setApprovedNfts(nfts)
      }
      approvednfts(nftIds)
     
    },);
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
             }} >Stake</button>
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