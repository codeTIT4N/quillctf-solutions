const { expect } = require("chai");

describe("Exploit RoadClosed Contract", function () {
    before(async () => {
        // deploying the target contract
        const RoadClosed = await ethers.getContractFactory("RoadClosed");
        target = await RoadClosed.deploy();
    })
    it("Deploy the exploit contract and exploit the RoadClosed contract", async () => {
        const Exploit = await ethers.getContractFactory("ExploitRoadClosed");
        exploit_contract = await Exploit.deploy(target.address);
        const hackedVal = await target.isHacked();
        console.log("Vault of hacked after the exploit: ", hackedVal);
        expect(hackedVal).to.equal(true);
    })
});
