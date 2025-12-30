// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SafeVault is ReentrancyGuard {
    mapping(address => uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    // ✅ FIX: CEI + nonReentrant
    function withdrawAll() external nonReentrant {
        uint256 bal = balances[msg.sender];
        require(bal > 0, "No balance");

        balances[msg.sender] = 0;

        (bool ok, ) = msg.sender.call{value: bal}("");
        require(ok, "Transfer failed");
    }

    receive() external payable {}
}
