import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers'

//Components
import Canvas from './Canvas';
import "./App.css"
import Toolbar from './Toolbar';
import Navigation from './Navigation';

// ABIs
import Ethernal from './abis/Ethernal.json';


// Config
import config from './config.json'

const App = () => {

  //Default color is red
  const [selectedColor, setSelectedColor] = useState('red');
  const colors = ['white', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'black'];



  const handleColorSelection = (color) => {
    setSelectedColor(color);
  };

  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  const [ethernal, setEthernal] = useState(null)

  const loadBlockchainData = async () => {
    //Blockchain connection
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()
    console.log("NETWORK : ", network)

    //from config.json
    const address = config[network.chainId].Ethernal.address

    //from ethers.js documentation
    //Contract(address, abi, provider)
    // Abi in src/abis/
    const ethernal = new ethers.Contract(address, Ethernal, provider)
    setEthernal(ethernal)
    console.log("CONTRACT ADDRESS : ", ethernal.address)

    //Get Pixels from blockchain
    const pixelArray = await ethernal.getAllPixels()
    console.log(pixelArray)

    //Refresh account automatically on page
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
    })

    return ethernal
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])


  return (
    <div className='App'>
      <Navigation account={account} setAccount={setAccount} />
      <Toolbar colors={colors} selectedColor={selectedColor} handleColorSelection={handleColorSelection} />
      <Canvas selectedColor={selectedColor} ethernal={ethernal} provider={provider} />
    </div>
  );
};

export default App;