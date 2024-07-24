# Metacrafters ATM

Welcome to the Metacrafters ATM! This decentralized application allows users to interact with a smart contract to deposit and withdraw Ethereum. Users must solve a simple multiplication problem to proceed with transactions, adding an extra layer of security. The project leverages MetaMask for wallet management and ethers.js for Ethereum interactions.

## Table of Contents
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Smart Contract](#smart-contract)
- [MetaMask Integration](#metamask-integration)
- [Security Features](#security-features)
- [Transaction History](#transaction-history)
- [Contribution](#contribution)
- [License](#license)

## Getting Started

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [MetaMask](https://metamask.io/) browser extension


## Usage
1. Open the application in your browser.
2. Ensure MetaMask is installed and connected to your browser.
3. Connect your MetaMask wallet by clicking the "Please connect your Metamask wallet" button.
4. Solve the multiplication problem displayed on the screen.
5. Enter the amount of ETH you wish to deposit or withdraw.
6. Click the respective button to perform the transaction.

## Smart Contract
The smart contract `Assessment.sol` is used to handle the deposit and withdrawal operations. The contract address is specified in the code as `0x5FbDB2315678afecb367f032d93F642f64180aa3`. Ensure this address is updated to match your deployed contract address if necessary.

### Contract ABI
The contract ABI is imported from the `artifacts` directory:
```javascript
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";
const atmABI = atm_abi.abi;
```

## MetaMask Integration
The application integrates with MetaMask for Ethereum wallet management. Users can connect their MetaMask wallet, check their balance, and perform transactions.

### Connecting MetaMask
The `connectAccount` function handles MetaMask wallet connection:
```javascript
const connectAccount = async () => {
  if (!ethWallet) {
    alert('MetaMask wallet is required to connect');
    return;
  }

  const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
  handleAccount(accounts);
  getATMContract();
};
```

## Security Features
To enhance security, users must solve a simple multiplication problem before performing any transaction. This is implemented in the `verifyAnswer` function:
```javascript
const verifyAnswer = () => {
  return parseInt(userAnswer) === num1 * num2;
};
```

## Transaction History
The application keeps a record of all transactions including the status, amount, transaction hash, and a fixed transaction fee:
```javascript
const recordTransaction = (status, amount, tx) => {
  const transactionFee = 0.01;
  const transaction = {
    status,
    amount,
    hash: tx.hash,
    fee: transactionFee,
  };
  setTransactionHistory((prevHistory) => [...prevHistory, transaction]);
};
```

Transaction history is displayed on the user interface for easy reference.

## Contribution
Contributions are welcome! Please submit a pull request or open an issue to discuss your ideas.

## License
This project is licensed under the MIT License.
