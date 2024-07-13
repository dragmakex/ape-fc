import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~~/components/ui/card";
import { useScaffoldReadContract, useScaffoldWriteContract, useScaffoldWatchContractEvent } from "~~/hooks/scaffold-eth";

const ApeFightClub = () => {
  const router = useRouter();
  const { address } = useAccount();
  const [gameState, setGameState] = useState("join");
  const [guess, setGuess] = useState("");
  const [question, setQuestion] = useState("");
  const [blocksPassed, setBlocksPassed] = useState(0);

  // Read contract data
  const { data: entryFee } = useScaffoldReadContract({
    contractName: "ApeFightClub",
    functionName: "entryFee",
  });

  const { data: currentQuestionId } = useScaffoldReadContract({
    contractName: "ApeFightClub",
    functionName: "currentQuestionId",
  });

  const { data: questionPickedBlock } = useScaffoldReadContract({
    contractName: "ApeFightClub",
    functionName: "questionPickedBlock",
  });

  // Write contract functions
  const { writeAsync: joinGame, isLoading: isJoining } = useScaffoldWriteContract({
    contractName: "ApeFightClub",
    functionName: "joinGame",
    value: entryFee,
  });

  const { writeAsync: submitAnswer, isLoading: isSubmitting } = useScaffoldWriteContract({
    contractName: "ApeFightClub",
    functionName: "submitAnswer",
    args: [guess],
  });

  // Event subscriptions
  useScaffoldWatchContractEvent({
    contractName: "ApeFightClub",
    eventName: "QuestionPicked",
    listener: logs => {
      const { questionId, text } = logs[0].args;
      setQuestion(text);
      setGameState("guessing");
    },
  });

  useScaffoldWatchContractEvent({
    contractName: "ApeFightClub",
    eventName: "GameEnded",
    listener: logs => {
      const { winner, winningAmount } = logs[0].args;
      router.push(`/results?winner=${winner}&amount=${winningAmount}`);
    },
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (gameState === "guessing" && questionPickedBlock) {
        setBlocksPassed(prevBlocks => prevBlocks + 1);
      }
    }, 15000); // Assuming 15-second block time

    return () => clearInterval(intervalId);
  }, [gameState, questionPickedBlock]);

  useEffect(() => {
    if (blocksPassed >= 3 && gameState === "guessing") {
      handleSubmitGuess();
    }
  }, [blocksPassed]);

  const handleJoinGame = async () => {
    try {
      await joinGame();
      setGameState("waiting");
    } catch (error) {
      console.error("Error joining game:", error);
    }
  };

  const handleSubmitGuess = async () => {
    if (guess) {
      try {
        await submitAnswer();
        setGameState("waiting_results");
      } catch (error) {
        console.error("Error submitting guess:", error);
      }
    }
  };

  const renderContent = () => {
    switch (gameState) {
      case "join":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Join Ape Fight Club</CardTitle>
              <CardDescription>Pay {entryFee ? parseEther(entryFee.toString()) : "..."} Ape Coins to join the game</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={handleJoinGame} disabled={isJoining}>
                {isJoining ? "Joining..." : "Join Game"}
              </Button>
            </CardFooter>
          </Card>
        );
      case "waiting":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Waiting for Question</CardTitle>
              <CardDescription>The game will start soon...</CardDescription>
            </CardHeader>
          </Card>
        );
      case "guessing":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Make Your Guess</CardTitle>
              <CardDescription>{question}</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="number"
                value={guess}
                onChange={e => setGuess(e.target.value)}
                onPaste={e => e.preventDefault()}
              />
              <p>Blocks passed: {blocksPassed}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmitGuess} disabled={isSubmitting || blocksPassed >= 3}>
                Submit Guess
              </Button>
            </CardFooter>
          </Card>
        );
      case "waiting_results":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Waiting for Results</CardTitle>
              <CardDescription>The winner will be announced soon...</CardDescription>
            </CardHeader>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="p-4 bg-base-100 rounded-xl shadow-xl">{renderContent()}</div>
    </div>
  );
};

export default ApeFightClub;