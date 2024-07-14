import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import './App.css';
import CONTRACT_ABI from './contracts/ApeLottery.json';
const CONTRACT_ADDRESS = '0x8A119B09dbECC82490aBd5c6982f8691E3feac5b';

function App() {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showCircle, setShowCircle] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<any | null>(null);
  const [amount, setAmount] = useState<string>('0.00001'); // Default amount
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        console.log('Accounts:', accounts);

        const currentNetworkId = Number(await web3Instance.eth.net.getId());
        console.log('Network ID:', currentNetworkId);
        setNetworkId(currentNetworkId);

        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const contractInstance = new web3Instance.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
          setContract(contractInstance);
        } else {
          console.error('No accounts found. Please ensure MetaMask is connected.');
        }
      } catch (error) {
        console.error('Error initializing web3:', error);
      }
    };

    init();
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isNaN(Number(value)) && Number(value) > 0) {
      setAmount(value);
      setError(null);
    } else {
      setError('Please enter a valid number greater than 0');
    }
  };

  const enterGame = async () => {
    if (contract && account && !error) {
      try {
        setLoading(true);
        setShowCircle(true);
        setGameResult(null);
        setTransactionHash(null);

        const receipt = await contract.methods.enterGame().send({ from: account, value: Web3.utils.toWei(amount, 'ether') });
        console.log('Successfully joined the game');
        setTransactionHash(receipt.transactionHash);
        
        setTimeout(async () => {
          try {
            const lastRandomNumber = BigInt(await contract.methods.lastRandomNumber().call());
            const lastWinningChance = BigInt(await contract.methods.lastWinningChance().call());
            const lastAmount = BigInt(await contract.methods.lastAmount().call());
            const lastGameWon = await contract.methods.lastGameWon().call();

            console.log('lastRandomNumber:', lastRandomNumber);
            console.log('lastWinningChance:', lastWinningChance);
            console.log('lastAmount:', lastAmount);
            console.log('lastGameWon:', lastGameWon);

            setGameResult({
              lastRandomNumber,
              lastWinningChance,
              lastAmount,
              lastGameWon
            });

            console.log('Game results:', gameResult);

            setLoading(false);
            setShowCircle(false);

          } catch (fetchError) {
            console.error('Error fetching game results:', fetchError);
            setLoading(false);
            setShowCircle(false);
          }
        }, 500);

      } catch (sendError) {
        console.error('Error calling enterGame method:', sendError);
        setLoading(false);
        setShowCircle(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-900 text-white text-3xl animate-fadeIn">
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            className="text-purple-500 text-center text-3xl p-2 mb-4"
            placeholder="Enter amount in ETH"
          />
          {error && <p className="text-red-500">{error}</p>}
          {!showCircle && (
            <div className="mb-4 p-4 animate-bounceIn">
              <button
                type="button"
                onClick={enterGame}
                className="flex items-center justify-center bg-gradient-to-r from-indigo-500 via-pink-500 to-blue-500 hover:from-indigo-600 hover:via-pink-600 hover:to-blue-600 focus:outline-none text-white text-3xl uppercase font-bold shadow-md mx-auto p-6 duration-500 animate-pulse"
              >
                Let's Gamble!
              </button>
            </div>
          )}
          {loading && <p className="mt-4 animate-pulse">Lottery Started...</p>}
          {showCircle && <div className="circle mx-auto mt-4 animate-spin"></div>}
          {gameResult && (
            <div className="mt-4 animate-fadeIn p-4 border-2 border-white rounded">
              <p className={gameResult.lastGameWon ? "text-green-500 blink font-bold" : "text-red-500 blink font-bold"}>
                {gameResult.lastGameWon ? "You Won!" : "You Lost!"}
              </p>
              <p>Last Random Number: {gameResult.lastRandomNumber.toString()}</p>
              <p>Last Winning Chance: {gameResult.lastWinningChance.toString()}</p>
              <p>Last Amount: {web3?.utils.fromWei(gameResult.lastAmount.toString(), 'ether')} ETH</p>
              <p>Transaction Hash: <a href={`https://eth-sepolia.blockscout.com/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{transactionHash}</a></p>
            </div>
          )}
        </div>
      </div>
      <footer className="bg-gray-800 text-white py-6 text-center text-3xl animate-fadeIn">
        {account ? (
          <div>
            <p>
              Connected account: <a href={`https://eth-sepolia.blockscout.com/address/${account}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{account}</a>
            </p>
            <p>
              Network: <a href={`https://eth-sepolia.blockscout.com`} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">{networkId}</a>
            </p>
          </div>
        ) : (
          <p>Connect to MetaMask to interact with the contract.</p>
        )}
      </footer>
    </div>
  );
}

export default App;