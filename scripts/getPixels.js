const { ethers } = require('hardhat');

async function getPixels() {
    const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

    // Créez une instance du contrat en utilisant son adresse
    const contract = await ethers.getContractAt('Ethernal', contractAddress);
    console.log(contract)

    const pixels = await contract.getAllPixels()
    console.log(pixels)
}

getPixels()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
