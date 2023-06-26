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

    const pixels = [
        {
            id: 0,
            x: 0,
            y: 0,
            color: "red"
        },
        {
            id: 1,
            x: 0,
            y: 100,
            color: "blue"
        }
    ]

    for (var i = 0; i < pixels.length; i++) {
        const transaction = await ethernal.connect(deployer).createPixel(
            pixels[i].id,
            pixels[i].x,
            pixels[i].y,
            pixels[i].color
        )
        await transaction.wait()

        console.log("Pixel OK")
    }

    const transaction = await ethernal.getAllPixels()
    //await transaction.wait()
    console.log(transaction)


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});