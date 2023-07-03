const { ethers } = require('hardhat');

async function getPixels() {
    const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

    // Create a contract instance using its address
    const contract = await ethers.getContractAt('Ethernal', contractAddress);

    const pixels = await contract.getAllPixels()
    console.log(pixels)

    const pixelNumber = await contract.pixelNumber()
    console.log("Number of pixels in blockchain :", pixelNumber)
}

getPixels()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
