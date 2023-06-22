const hre = require("hardhat")

async function main() {
    // Setup accounts & variables
    const [deployer] = await ethers.getSigners()
    const NAME = "Ethernal"
    const SYMBOL = "ETN"

    // Deploy contract
    const Ethernal = await ethers.getContractFactory("Ethernal")
    const ethernal = await Ethernal.deploy(NAME, SYMBOL)
    await ethernal.deployed()

    console.log(`Deployed ${NAME} Contract at: ${ethernal.address}\n`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});