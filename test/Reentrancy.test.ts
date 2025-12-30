import { expect } from "chai";
import { ethers } from "hardhat";

describe("Reentrancy Lab", function () {
  it("drains VulnerableVault via reentrancy", async () => {
    const [victim, attackerEOA] = await ethers.getSigners();

    const V = await ethers.getContractFactory("VulnerableVault");
    const vault = await V.deploy();

    // victim funds the vault
    await vault.connect(victim).deposit({ value: ethers.parseEther("10") });

    const A = await ethers.getContractFactory("Attacker");
    const attacker = await A.connect(attackerEOA).deploy(await vault.getAddress());

    // attack with 1 ETH and up to 30 re-entries
    await attacker.connect(attackerEOA).attack(30, { value: ethers.parseEther("1") });

    const vaultBal = await ethers.provider.getBalance(await vault.getAddress());
    expect(vaultBal).to.equal(0n);
  });

  it("SafeVault prevents the drain", async () => {
    const [victim, attackerEOA] = await ethers.getSigners();

    const V = await ethers.getContractFactory("SafeVault");
    const vault = await V.deploy();

    await vault.connect(victim).deposit({ value: ethers.parseEther("10") });

    const A = await ethers.getContractFactory("Attacker");
    const attacker = await A.connect(attackerEOA).deploy(await vault.getAddress());

    // should revert because of nonReentrant
    await expect(
      attacker.connect(attackerEOA).attack(30, { value: ethers.parseEther("1") })
    ).to.be.reverted;

    const vaultBal = await ethers.provider.getBalance(await vault.getAddress());
    expect(vaultBal).to.equal(ethers.parseEther("10"));
  });
});
