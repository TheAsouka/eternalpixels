import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers'
import Swal from 'sweetalert2';

//Components
import Canvas from './components/Canvas';
import "./style/App.css"
import Toolbar from './components/Toolbar';
import Navigation from './components/Navigation';

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
  const [pixelarray, setPixelArray] = useState(null)

  const [isLoading, setIsLoading] = useState(true);

  const loadBlockchainData = async () => {
    //Blockchain connection
    //Check if metamask is installed
    const provider = window.ethereum ? new ethers.providers.Web3Provider(window.ethereum) : null;
    if (!provider) {
      Swal.fire({
        icon: 'error',
        title: 'Metamask not installed',
        text: `Please install Metamask in your browser before continuing. \nhttps://metamask.io/download/`,
      })
    }


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
    setPixelArray(pixelArray)

    //Refresh account automatically on page
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
    })

    // Wait for blockchain data to be loaded before rendering canva.
    setIsLoading(false);

  }

  useEffect(() => {
    //Change title (tab)
    document.title = 'EternalPixels';
    loadBlockchainData()
  }, [])


  return (
    //isLoading ensure that blockchain data is loaded before rendering canva.
    <div className='App'>
      <Navigation account={account} setAccount={setAccount} />
      <Toolbar colors={colors} selectedColor={selectedColor} handleColorSelection={handleColorSelection} />
      {isLoading ? (
        <div className='App-header'>Loading blockchain data...</div>
      ) : (
        <Canvas selectedColor={selectedColor} ethernal={ethernal} provider={provider} pixelArray={pixelarray} />
      )}
    </div>
  );
};

export default App;