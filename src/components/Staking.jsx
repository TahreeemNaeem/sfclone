import { ethers } from 'ethers';
import React, { useContext, useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import Nfts from './Nfts';
import Staked from './Staked';
import { BrowserRouter as Router, Route, Navigate,Routes, } from 'react-router-dom';

export default function Staking() {
  return(
    <div>
         <Router>
      <div className="App">
        <nav>
        <div className='linkcontainer'>
          <div className='linktext'><Link to="/Nfts">NFTs</Link></div>
          <div className='linktext'><Link to="/staked">Staked NFTs</Link></div>
        </div>
        </nav>

        <Routes>
          <Route path="/" exact element={<Staking />} />
          <Route path="/Staked" element={<Staked />} />
          <Route path="/Nfts" element={<Nfts />}  />
        </Routes>
      </div>
    </Router>
    </div>
  );
}