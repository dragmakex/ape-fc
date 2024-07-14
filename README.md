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

https://ethglobal.com/events/brussels/project

Introducing Scout the Stakes — a revolutionary decentralized mini gambling game, expertly crafted and deployed on the robust Ethereum blockchain. This state-of-the-art smart contract game offers a transparent, trustless gaming experience, allowing users to wager and win in an environment that emphasizes safety and fairness.

Key Features of EtherWager:

Immutable Ownership: Securely set, the ownership of the contract lies with the creator, ensuring a stable and reliable platform where only the designated owner can perform critical administrative tasks.

Transparent Game Results: Every game action is logged and public. From the amount wagered by the last player, their chances of winning, to the outcome of each game, everything is traceable and verifiable, enhancing player confidence and trust.

Real-Time Event Notifications: With events like GameResult and DonationReceived, players and donors receive immediate confirmations of their transactions and actions, ensuring a seamless and engaging user experience.

User-Driven Participation: Anyone can participate by simply sending ETH to the contract. The enterGame function allows for straightforward gameplay, and the smart contract logic ensures that your chances of winning are fairly calculated based on your wager relative to the total contract balance.

Secure Random Number Generation: Utilizing a pseudo-random number generated through the Ethereum blockchain’s keccak256 algorithm, the game provides an adequately random outcome for the casual gambling environment, ensuring each game is both exciting and fair.

Generous Payouts: Winners receive a substantial payout, calculated as 95% of the contract's current balance, delivered directly and securely through the Ethereum network.

Open for Donations: EtherWager accepts donations that enhance the prize pool, making the games more exciting and increasing the stakes for all participants. Each donation is acknowledged through blockchain events, adding to the donor's recognition.

Exclusive Withdrawal Rights: Designed with security in mind, only the contract owner can withdraw the balance, ensuring that the accumulated funds are managed responsibly and with integrity.

Scout the Stakes is not just a game; it’s a secure, decentralized platform where the thrill of gambling meets the transparency and reliability of blockchain technology. Dive into the future of online gambling where every bet is safe, every game is fair, and every transaction is recorded on the Ethereum blockchain. Join us at EtherWager and place your bets in the world's most trustless and transparent gambling arena!


You like to gamble? You like to loose money and appear as the biggest looser? We might have a leaderboard you can concur!