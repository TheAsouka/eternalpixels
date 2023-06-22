import React, { useState, useEffect } from 'react';
import Canvas from './Canvas';
import "./App.css"
import Toolbar from './Toolbar';
import Navigation from './Navigation';
import { ethers } from 'ethers'

const App = () => {

  const [selectedColor, setSelectedColor] = useState('red');
  const colors = ['white', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'black'];

  const handleColorSelection = (color) => {
    setSelectedColor(color);
  };

  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)

  const loadBlockchainData = async () => {
    //Blockchain connection
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()
    console.log("NETWORK : ", network)

    //Refresh account automatically on page
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
    })
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])


  return (
    <div className='App'>
      <Navigation account={account} setAccount={setAccount} />
      <Toolbar colors={colors} selectedColor={selectedColor} handleColorSelection={handleColorSelection} />
      <Canvas selectedColor={selectedColor} />
    </div>
  );
};

export default App;