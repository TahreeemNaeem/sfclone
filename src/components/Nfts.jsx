import { ethers } from 'ethers';
import React, { useContext, useState,useEffect } from 'react';
import { MyContext } from './MyContext';
import { Link } from 'react-router-dom';
import stakingabi from '../assets/stakingabi.json';
import ABI from '../assets/myNFTContract.json'

export default function Nfts(){
  const provider= (new ethers.providers.Web3Provider(window.ethereum));
  const [nftIds, setNftIds] = useState([]);
  const [images,setImages]= useState([])
  const [approvedNfts, setApprovedNfts] = useState([]);
  
  const myNFTContract =  new ethers.Contract('0x7465278896C47292301045d6bE4298794204594C', ABI, (provider.getSigner())); 

  async function  getImage(id) {
    for(let i=0;i<id.length;i++){
    const URL =  await myNFTContract.tokenURI(id[i]);
    fetch(URL)
    .then(res => res.json())
       .then(async metadata =>{
        const img =metadata.image
            setImages(arr => [...arr, img]);
            console.log(true)
          })
         .catch(err => { throw err });
        }
    }

  useEffect(() => {

    const getNftIds = async () => {
      const signer = provider.getSigner();

      const nftIds = new Array();;
      const balance = (await myNFTContract.balanceOf(signer.getAddress())).toNumber();
      let userids=0;
      console.log(balance);
      for (let id= 1; userids <=balance; id++) {
        if((await (signer.getAddress())).toString()===(await myNFTContract.ownerOf(id)).toString()){
          setNftIds(arr => [...arr, id]);
          userids++;
          console.log(true)
        }
      }
      getImage(nftIds);
    };

    getNftIds();
  },[]);
  console.log(nftIds)
  return (
    <div className="nft-container" style={{border:'2px solid'}}>
      {images.map((image, index) => (
        <div>
          <div className='NFT'><img
          key={index}
          src={image}
          alt={`image ${index + 1}`}
           /></div>
          <div>
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
         }}>Approve</button>
           </div>
        </div>
      ))}
    </div>
  );
}