# Gamble Machine Smart Contract

## Overview

The Gamble Machine Smart Contract allows users to participate in a gambling game by sending ETH. Based on a calculated winning chance, they may win a prize. Users can also donate to the contract, and the owner can withdraw the accumulated funds.

## Functions

### enterGame()

Users can enter the game by sending ETH. The function checks if the sent amount is greater than zero and processes the game logic. The probability of winning is determined by the amount sent relative to the contract's balance. A random number is generated, and if the player wins, they receive 95% of the contract's balance as a prize.

### donate()

Allows users to donate ETH to the contract. Donations trigger the DonationReceived event.

### withdraw()

This function allows the contract owner to withdraw the entire balance of the contract. Only the owner can perform this action.

## Private Functions

### _processGame()

Handles the core game logic:
- Calculates the winning chance.
- Generates a random number.
- Determines if the player wins and sends the prize if applicable.
- Updates game result variables and emits a GameResult event.

### _generateRandomNumber()

Generates a pseudo-random number using the current block timestamp and the sender's address.

### _sendPrize()

Sends the prize amount to the winning player, ensuring the transfer is successful.

## Summary

The Gamble Machine Smart Contract facilitates a gambling game with ETH, providing a chance to win based on a calculated probability. Users can also donate to the contract, and the owner can withdraw the funds. Game results and donations are logged through events.