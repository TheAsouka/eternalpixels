const { ethers } = require('hardhat');

async function getContractBalance() {
    const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

    //Create a contract instance using its address
    const contract = await ethers.getContractAt('Ethernal', contractAddress);

    const balance = await ethers.provider.getBalance(contract.address);

    // Convert balance from wei to ethers
    const balanceInEther = ethers.utils.formatEther(balance);

    console.log(`Balance du contrat : ${balanceInEther} ETH`);
}

getContractBalance()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
