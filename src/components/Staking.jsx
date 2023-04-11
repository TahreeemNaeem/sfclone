import { ethers } from 'ethers';
import React, { useContext, useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
export default function Staking() {
  const [display,setDisplay ] = useState(true);

  return(
    <div>
        <div className='linkcontainer'>
          <div className='linktext'><Link to="/Nfts">NFTs</Link></div>
          <div className='linktext'><Link to="/staked">Staked NFTs</Link></div>
        </div>
        <div>
         
        </div>
    </div>
  );
}