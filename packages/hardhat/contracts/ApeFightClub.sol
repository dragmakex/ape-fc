// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract for a guessing game where the closest guess wins the prize.
 * It supports only ApeCoin (an ERC-20 token).
 */
contract ApeFightClub is Ownable {
    uint256 public entryFee;
    address public winner;
    uint256 public totalAmount;
    IERC20 public apeCoin;

    struct Player {
        address playerAddress;
        uint256 guess;
    }

    Player[] public players;
    mapping(address => bool) public hasGuessed;

    event AnswerSubmitted(address indexed player, uint256 guess);
    event GameEnded(address winner, uint256 winningAmount);

    constructor(uint256 _entryFee, address _apeCoinAddress) {
        entryFee = _entryFee;
        apeCoin = IERC20(_apeCoinAddress);
    }

    function joinGame() public {
        require(apeCoin.transferFrom(msg.sender, address(this), entryFee), "Transfer failed");
        totalAmount += entryFee;
        players.push(Player(msg.sender, 0));
    }

    function submitAnswer(uint256 guess) public {
        require(!hasGuessed[msg.sender], "Already submitted an answer");

        for (uint256 i = 0; i < players.length; i++) {
            if (players[i].playerAddress == msg.sender) {
                players[i].guess = guess;
                break;
            }
        }
        hasGuessed[msg.sender] = true;

        emit AnswerSubmitted(msg.sender, guess);
    }

    function endGame(uint256 correctAnswer) public onlyOwner {
        require(players.length > 0, "No players have joined the game");

        uint256 closestGuess = type(uint256).max;
        for (uint256 i = 0; i < players.length; i++) {
            uint256 guessDifference = getDifference(players[i].guess, correctAnswer);
            if (guessDifference < closestGuess) {
                closestGuess = guessDifference;
                winner = players[i].playerAddress;
            }
        }

        uint256 winningAmount = totalAmount;
        totalAmount = 0;

        // Ensure the state is updated before sending ApeCoin
        delete players;

        require(apeCoin.transfer(winner, winningAmount), "Transfer failed");

        emit GameEnded(winner, winningAmount);
    }

    function getDifference(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a > b) return a - b;
        return b - a;
    }
}