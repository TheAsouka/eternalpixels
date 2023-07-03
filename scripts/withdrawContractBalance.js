const { ethers } = require('hardhat');

async function withdrawContractBalance() {
    const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const [deployer] = await ethers.getSigners()

    //Create a contract instance using its address
    const contract = await ethers.getContractAt('Ethernal', contractAddress);
    const contractBalance = await ethers.provider.getBalance(contract.address)

    console.log("Contract balance :", ethers.utils.formatEther(contractBalance), "ETH");


    const balanceDeployer = await ethers.provider.getBalance(deployer.address);
    console.log("Balance of deployer before withdraw : ", ethers.utils.formatEther(balanceDeployer), "ETH")



    transactionWithdraw = await contract.connect(deployer).withdraw()
    console.log("Withdrawing...")
    await transactionWithdraw.wait()
    const balanceAfter = await ethers.provider.getBalance(deployer.address)
    console.log("Balance of deployer after withdraw : ", ethers.utils.formatEther(balanceAfter), "ETH")
}

withdrawContractBalance()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });