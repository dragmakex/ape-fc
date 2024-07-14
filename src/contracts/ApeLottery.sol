//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract ApeLottery {
	address public immutable owner;

	// State variables to hold the last game result
	address public lastPlayer;
	uint256 public lastAmount;
	uint256 public lastWinningChance;
	uint256 public lastRandomNumber;
	bool public lastGameWon;

	event GameResult(
		address indexed player,
		uint256 amount,
		uint256 winningChance,
		uint256 randomNumber,
		bool won
	);

	event DonationReceived(address indexed donor, uint256 amount);

	constructor(address _owner) {
		owner = _owner;
	}

	function enterGame() external payable {
		require(msg.value > 0, "Must send ETH to enter");
		_processGame();
	}

	function donate() external payable {
		require(msg.value > 0, "Must send ETH to donate");
		emit DonationReceived(msg.sender, msg.value);
	}

	function _processGame() private {
		uint256 contractBalance = address(this).balance;
		uint256 winningChance = (msg.value * 100) / contractBalance;
		uint256 randomNumber = _generateRandomNumber() % 100;
		bool won = randomNumber < winningChance;
		uint256 prizeAmount = (contractBalance * 95) / 100;

		if (won) {
			_sendPrize(prizeAmount);
		}

		lastPlayer = msg.sender;
		lastAmount = msg.value;
		lastWinningChance = winningChance;
		lastRandomNumber = randomNumber;
		lastGameWon = won;

		emit GameResult(
			msg.sender,
			msg.value,
			winningChance,
			randomNumber,
			won
		);
	}

	function withdraw() public {
		require(msg.sender == owner, "Not the Owner");
		(bool success, ) = owner.call{ value: address(this).balance }("");
		require(success, "Failed to send Ether");
	}

	function _generateRandomNumber() private view returns (uint256) {
		return
			uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender)));
	}

	function _sendPrize(uint256 amount) private {
		(bool success, ) = payable(msg.sender).call{ value: amount }("");
		require(success, "Failed to send Ether");
	}
}
