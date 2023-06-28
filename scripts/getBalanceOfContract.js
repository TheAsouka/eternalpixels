const { ethers } = require('hardhat');

async function getContractBalance() {
    const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

    // Créez une instance du contrat en utilisant son adresse
    const contract = await ethers.getContractAt('Ethernal', contractAddress);
    console.log(contract)

    // Récupérez la balance du contrat en ethers
    const balance = await ethers.provider.getBalance(contract.address);

    // Convertissez la balance de wei en ethers
    const balanceInEther = ethers.utils.formatEther(balance);

    console.log(`Balance du contrat : ${balanceInEther} ETH`);
}

getContractBalance()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
