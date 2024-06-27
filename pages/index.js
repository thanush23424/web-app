import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [num1, setNum1] = useState(Math.floor(Math.random() * 10));
  const [num2, setNum2] = useState(Math.floor(Math.random() * 10));
  const [userAnswer, setUserAnswer] = useState("");
  const [amount, setAmount] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balanceInWei = await atm.getBalance();
      setBalance(ethers.utils.formatEther(balanceInWei));
    }
  };

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

  const verifyAnswer = () => {
    return parseInt(userAnswer) === num1 * num2;
  };

  const deposit = async (amount) => {
    if (atm && verifyAnswer()) {
      try {
        const tx = await atm.deposit(ethers.utils.parseEther(amount.toString()));
        await tx.wait();
        recordTransaction("Deposit", amount, tx);
        getBalance();
        resetMultiplicationProblem();
      } catch (error) {
        console.error("Deposit failed", error);
        alert("Deposit failed: " + error.message);
      }
    } else {
      alert("Incorrect answer to the multiplication problem.");
    }
  };

  const withdraw = async (amount) => {
    if (atm && verifyAnswer()) {
      try {
        const tx = await atm.withdraw(ethers.utils.parseEther(amount.toString()));
        await tx.wait();
        recordTransaction("Withdraw", amount, tx);
        getBalance();
        resetMultiplicationProblem();
      } catch (error) {
        console.error("Withdrawal failed", error);
        alert("Withdrawal failed: " + error.message);
      }
    } else {
      alert("Incorrect answer to the multiplication problem.");
    }
  };

  const resetMultiplicationProblem = () => {
    setNum1(Math.floor(Math.random() * 10));
    setNum2(Math.floor(Math.random() * 10));
    setUserAnswer("");
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance} ETH</p>
        <div>
          <p>Solve this to proceed: {num1} x {num2}</p>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Your answer"
          />
        </div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
        <button onClick={() => deposit(amount)}>Deposit {amount} ETH</button>
        <button onClick={() => withdraw(amount)}>Withdraw {amount} ETH</button>
        <h2>Transaction History</h2>
        <ul>
          {transactionHistory.map((tx, index) => (
            <li key={index}>
              <p>Status: {tx.status}</p>
              <p>Amount: {tx.amount} ETH</p>
              <p>Transaction Hash: {tx.hash}</p>
              <p>Transaction Fee: {tx.fee} ETH</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  useEffect(() => { getWallet(); }, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters ATM!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}
      </style>
    </main>
  );
}
