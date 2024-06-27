pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount, uint256 timestamp);
    event Withdraw(uint256 amount, uint256 timestamp);

    struct Transaction {
        string transactionType;
        uint256 amount;
        uint256 timestamp;
        bytes32 txHash;
    }

    Transaction[] public transactionHistory;

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount, block.timestamp);

        // record the transaction
        transactionHistory.push(Transaction({
            transactionType: "Deposit",
            amount: _amount,
            timestamp: block.timestamp,
            txHash: blockhash(block.number - 1)
        }));
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount, block.timestamp);

        // record the transaction
        transactionHistory.push(Transaction({
            transactionType: "Withdraw",
            amount: _withdrawAmount,
            timestamp: block.timestamp,
            txHash: blockhash(block.number - 1)
        }));
    }

    function multiply(uint8 num1, uint8 num2) public pure returns (uint8) {
        require(num1 < 10 && num2 < 10, "Inputs must be single digits (0-9)");
        return num1 * num2;
    }

    function getTransactionHistory() public view returns (Transaction[] memory) {
        return transactionHistory;
    }
}
