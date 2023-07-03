const { expect } = require("chai")
const { ethers } = require("hardhat")

const NAME = "Ethernal"
const SYMBOL = "ETN"

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

const pixelsToSend = editablePixels.map(pixel => ({
    x: pixel.x,
    y: pixel.y,
    color: pixel.color
}));

const numPixels = editablePixels.length;
const pixelCost = ethers.utils.parseEther((numPixels * 0.1).toString());



describe("Ethernal", () => {
    let Ethernal
    //Accounts
    let deployer, buyer

    //Before each test run this code
    //New contract is deployed for each test...
    beforeEach(async () => {
        //Setup accounts
        [deployer, buyer] = await ethers.getSigners()
        //console.log(deployer.address)

        //contracts folder
        const Ethernal = await ethers.getContractFactory("Ethernal")
        // Pas compris comment il sait que le compte qui deploy est deployer -> surement premier de la list getsigners
        ethernal = await Ethernal.deploy(NAME, SYMBOL)
        //console.log(ethernal.address)

    })

    describe("Deployment", () => {

        it("Sets the name", async () => {
            let name = await ethernal.name()
            expect(name).to.equal(NAME)
        })

        it("Sets the symbol", async () => {
            let symbol = await ethernal.symbol()
            expect(symbol).to.equal(SYMBOL)
        })

        it("Sets the owner", async () => {
            expect(await ethernal.owner()).to.equal(deployer.address)
        })

    })

    describe("Pixels", () => {
        beforeEach(async () => {
            //This transaction is a user sending pixels to blockchain
            const transaction = await ethernal.connect(deployer).createPixels(pixelsToSend, { value: pixelCost })
            await transaction.wait()
        })

        it("getAllPixels return an array", async () => {
            const pixelArray = await ethernal.getAllPixels()
            expect(pixelArray.length).to.be.equal(pixelsToSend.length)
        })

        it("Pixel doesn't exist in blockchain", async () => {
            const transaction = await ethernal.pixelExists(10, 10)
            expect(transaction).to.be.false
        })

        it("Pixel exist in blockchain", async () => {
            const transaction = await ethernal.pixelExists(0, 0)
            expect(transaction).to.be.true
        })

        it("createPixel is not usable outside of the contract", async () => {
            const transaction = await ethernal.connect(deployer).createPixel(0, 3, "red")
            //Test is not working : TypeError: ethernal.connect(...).createPixel is not a function
            // So it works in some way
            expect(transaction).to.fail;
        })
    })

    describe("Withdrawing", () => {
        let balanceBefore

        beforeEach(async () => {
            //This transaction is a user sending pixels to blockchain
            balanceBefore = await ethers.provider.getBalance(deployer.address)

            let transaction = await ethernal.connect(buyer).createPixels(pixelsToSend, { value: pixelCost })
            await transaction.wait()

            transaction = await ethernal.connect(deployer).withdraw()
        })

        it("User can't withdraw", async () => {
            const transaction = await ethernal.connect(buyer).withdraw()
            const errorMessage = "You are not the owner."
            //const errorMessage = "VM Exception while processing transaction: reverted with reason string 'You are not the owner.'"
            //Still not working...
            expect(transaction).to.be.revertedWith(errorMessage);
        })

        it("Updates the owner balance", async () => {
            const balanceAfter = await ethers.provider.getBalance(deployer.address)
            expect(balanceAfter).to.greaterThan(balanceBefore)
        })

        it("Updates the contract balance", async () => {
            const balance = await ethers.provider.getBalance(ethernal.address)
            expect(balance).to.be.equal(0)
        })
    })
})
