// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ApeFightClub is Ownable {
	uint256 public entryFee;
	address public winner;
	uint256 public totalAmount;
	IERC20 public apeCoin;

	struct Player {
		address playerAddress;
		uint256 guess;
	}

	struct Question {
		string text;
		uint256 answer;
	}

	Player[] public players;
	mapping(address => bool) public hasGuessed;
	mapping(uint256 => Question) public questions;
	uint256 public questionCount;
	uint256 public currentQuestionId;
	uint256 public questionPickedBlock;

	event AnswerSubmitted(address indexed player, uint256 guess);
	event GameEnded(address winner, uint256 winningAmount);
	event QuestionAdded(uint256 questionId, string text);
	event QuestionPicked(uint256 questionId, string text);

	constructor(
		uint256 _entryFee,
		address _apeCoinAddress
	) Ownable(msg.sender) {
		entryFee = _entryFee;
		apeCoin = IERC20(_apeCoinAddress);
		// Predefine questions
		_addQuestion("What is the birth year of Vitalik Buterin?", 1994);
		_addQuestion("How many Ethereum were in the initial supply?", 72000000);
		_addQuestion("What is the maximum supply of Bitcoin?", 21000000);
		_addQuestion("What year was the Bitcoin whitepaper published?", 2008);
		_addQuestion("What year was the Ethereum mainnet launched?", 2015);
		_addQuestion("How many Bitcoin will ever be created?", 21000000);
		_addQuestion(
			"What is the block reward for Bitcoin as of 2020?",
			625000000
		); // 6.25 BTC in satoshis
		_addQuestion(
			"How many seconds does it take to mine a new block in Ethereum?",
			15
		);
		_addQuestion("What is the block time for Litecoin in seconds?", 150);
		_addQuestion("In what year did Ethereum undergo the 'DAO hack'?", 2016);
		_addQuestion("What year was the first Bitcoin block mined?", 2009);
		_addQuestion(
			"What is the block reward for Ethereum as of 2021?",
			2000000000
		); // 2 ETH in wei
		_addQuestion(
			"What is the total supply of Binance Coin (BNB)?",
			170532785
		);
		_addQuestion("What year was the first Bitcoin transaction made?", 2010);
		_addQuestion(
			"What year did Bitcoin reach a price of $1 for the first time?",
			2011
		);
		_addQuestion("What year was the Mt. Gox hack?", 2014);
		_addQuestion("What year did Bitcoin first reach $10,000?", 2017);
		_addQuestion(
			"What year was the Lightning Network whitepaper published?",
			2015
		);
		_addQuestion("What year did Ethereum first reach $1,000?", 2018);
		_addQuestion("How many Bitcoin were lost in the Mt. Gox hack?", 850000); // 850,000 BTC
		_addQuestion(
			"What is the maximum supply of Chainlink (LINK)?",
			1000000000
		); // 1 billion LINK
	}

	function _addQuestion(string memory text, uint256 answer) internal {
		questions[questionCount] = Question(text, answer);
		emit QuestionAdded(questionCount, text);
		questionCount++;
	}

	function pickQuestion() public onlyOwner {
		require(questionCount > 0, "No questions available");
		currentQuestionId =
			uint256(
				keccak256(abi.encodePacked(block.timestamp, block.difficulty))
			) %
			questionCount;
		questionPickedBlock = block.number;
		emit QuestionPicked(
			currentQuestionId,
			questions[currentQuestionId].text
		);
	}

	function joinGame() public payable {
		require(
			apeCoin.transferFrom(msg.sender, address(this), entryFee),
			"Transfer failed"
		);
		totalAmount += entryFee;
		players.push(Player(msg.sender, 0));
	}

	function submitAnswer(uint256 guess) public {
		require(!hasGuessed[msg.sender], "Already submitted an answer");
		require(
			block.number <= questionPickedBlock + 3,
			"Answer submission period has ended"
		);

		for (uint256 i = 0; i < players.length; i++) {
			if (players[i].playerAddress == msg.sender) {
				players[i].guess = guess;
				break;
			}
		}
		hasGuessed[msg.sender] = true;

		emit AnswerSubmitted(msg.sender, guess);
	}

	function endGame() public payable onlyOwner {
		require(players.length > 0, "No players have joined the game");
		require(
			block.number > questionPickedBlock + 3,
			"Game period has not ended"
		);

		uint256 correctAnswer = questions[currentQuestionId].answer;
		uint256 closestGuess = type(uint256).max;
		for (uint256 i = 0; i < players.length; i++) {
			uint256 guessDifference = getDifference(
				players[i].guess,
				correctAnswer
			);
			if (guessDifference < closestGuess) {
				closestGuess = guessDifference;
				winner = players[i].playerAddress;
			}
		}

		uint256 winningAmount = totalAmount;
		totalAmount = 0;

		// Reset players and hasGuessed mapping
		for (uint256 i = 0; i < players.length; i++) {
			hasGuessed[players[i].playerAddress] = false;
		}
		delete players;

		require(apeCoin.transfer(winner, winningAmount), "Transfer failed");

		emit GameEnded(winner, winningAmount);
	}

	function getDifference(
		uint256 a,
		uint256 b
	) internal pure returns (uint256) {
		if (a > b) return a - b;
		return b - a;
	}
}
