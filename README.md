# EternalPixels
This app is a decentralized pixel drawing application powered by blockchain technology. Users can create, color, and own pixels on a shared canvas. The app integrates with MetaMask for authentication and to interact with the blockchain.  
The app leverages React.js for the frontend, Hardhat for blockchain integration and tests, and Solidity for smart contract development.

## Technology Stack & Tools

- Solidity (Writing Smart Contracts & Tests)
- Javascript (React & Testing)
- [NodeJS](https://nodejs.org/en/) v18.16.0
- [Hardhat](https://hardhat.org/) v 2.12.7 (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) v5.7.2 (Blockchain Interaction)
- [React.js](https://reactjs.org/) (Frontend Framework)
- [MetaMask](https://metamask.io/)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/). Recommended to use the LTS version.
- Install [MetaMask](https://metamask.io/) on your browser.

## Setting Up
### 1. Clone/Download the Repository
- `$ git clone https://github.com/TheAsouka/eternalpixels.git`
- `$ cd eternalpixels`

### 2. Install Dependencies:
`$ npm install`

### 3. Run tests
`$ npx hardhat test`

### 4. Start Hardhat node
`$ npx hardhat node`

### 5. Run deployment script
In a separate terminal execute:
`$ npx hardhat run ./scripts/deploy.js --network localhost`

### 6. Start frontend
`$ npm run start`

### 7. In case of transaction error
Reset your nonce on metamask or use a custom one (Metamask/Settings/Advanced settings)

## Usage
Once you have metamask installed and configured with a local network :
- Connect Metamask to local network
- Import an hardhat account by private key in Metamask (account #0 is the deployer)
<img src="https://github.com/TheAsouka/eternalpixels/blob/main/img/hardhat_accounts.png" width="360" height="360">  

- Click "Connect" button on front-end
- Do some pixel art
- Click "Confirm" button.

## Metamask setup
Ensure you have a local network configured as follow :  
<img src="https://github.com/TheAsouka/eternalpixels/blob/main/img/metamask_localhost.png" width="360" height="558">

## Change
### 1. Canva size
You can change de Canva size by editing values at :
- `src/components/Canvas.js`
- `line 12 => const canvasWidth = 22;`
- `line 13 => const canvasHeight = 50;`

### 2. Pixel cost
You can change cost of a pixel at :
- `contracts/Ethernal.sol`
- `line 9 => uint256 public pixelCreationCost = 0.1 ether;`
- `src/components/Canvas.js`
- `line 129 => const pixelCost = ethers.utils.parseEther((numPixels * 0.1).toString());`

### 3. Editing smart contract
If you change anything in the smart contract :
- Deploy it using `$ npx hardhat run ./scripts/deploy.js --network localhost` it will be complied again.
- Then go to `artifacts/contracts/Ethernal.sol/Ethernal.json`
- Copy the array after `abi : [...]` 
- Paste it into `src/abis/Ethernal.json`


## Improvements
- Gas cost efficiency
- User interface
- Handle uncaught runtime error (provider is null) if metamask is not installed (App.js)
- Better handling of rendering Canva after a successfull transaction
- Mapping pixel owners and pixels and display address by hovering a pixel
- Deploy on testnet
- ...
