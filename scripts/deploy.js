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

    const etherValue = (n) => {
        return ethers.utils.parseUnits(n.toString(), 'ether')
    }

    const editablePixels = [
        {
            x: 0,
            y: 0,
            color: "red"
        },
        {
            x: 0,
            y: 1,
            color: "yellow"
        }
    ]

    const numPixels = editablePixels.length;
    const pixelCost = ethers.utils.parseEther((numPixels * 0.1).toString());

    const pixelsToSend = editablePixels.map(pixel => ({
        x: pixel.x,
        y: pixel.y,
        color: pixel.color
    }));

    console.log(pixelsToSend)


    const transaction = await ethernal.connect(deployer).createPixels(pixelsToSend, { value: pixelCost })
    await transaction.wait()
    console.log("Pixels created !")
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});