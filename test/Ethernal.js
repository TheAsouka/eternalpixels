const { expect } = require("chai")
const { ethers } = require("hardhat")

const NAME = "Ethernal"
const SYMBOL = "ETN"

describe("Ethernal", () => {
    let Ethernal
    //Accounts
    let deployer, buyer

    //Before each test run this code
    //New contract is deployed for each test...
    beforeEach(async () => {
        //Setup accounts - pas compris getSigners
        [deployer, buyer] = await ethers.getSigners()

        //contracts folder
        const Ethernal = await ethers.getContractFactory("Ethernal")
        // Pas compris comment il sait que le compte qui deploy est deployer -> surement premier de la list getsigners
        ethernal = await Ethernal.deploy(NAME, SYMBOL)
        console.log(ethernal.address)

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
})