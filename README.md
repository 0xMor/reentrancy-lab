# Reentrancy Lab

Educational repo showing:
1) a reentrancy-vulnerable contract
2) an attacker contract
3) a fixed version using best practices

## What you’ll find
- `VulnerableVault.sol`: intentionally vulnerable
- `Attacker.sol`: drains the vault via reentrancy
- `SafeVault.sol`: fixed using CEI + ReentrancyGuard
- Unit tests proving the exploit and the fix

## Run locally
```bash
npm install
npx hardhat test
