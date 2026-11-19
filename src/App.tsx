import { useState, useEffect, useRef, useCallback } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header";
import { GameBoard } from "@/components/GameBoard";
import { GameControls } from "@/components/GameControls";
import { GameStats } from "@/components/GameStats";
import { GameModal } from "@/components/GameModal";
import type { CardType } from "@/lib/game-utils";
import { generateCards } from "@/lib/game-utils";
import { HowToPlay } from "@/components/HowToPlay";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import { GameHistory } from "./components/GameHistory";

interface GameScore {
  id: string;
  time: number;
  date: string;
  cardCount: number;
  isHighScore: boolean;
}

export default function App() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [highScore, setHighScore] = useState<number | null>(null);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [cardCount, setCardCount] = useState(12);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [gameHistory, setGameHistory] = useState<GameScore[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { width, height } = useWindowSize();

  // Load initial data from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("memory-dark") === "true";
    setDarkMode(savedDarkMode);

    const savedHighScore = localStorage.getItem("memory-highscore");
    if (savedHighScore) setHighScore(Number(savedHighScore));

    const savedHistory = localStorage.getItem("memory-game-scores");
    if (savedHistory) setGameHistory(JSON.parse(savedHistory));

    setCards(generateCards(cardCount));
  }, [cardCount]);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem("memory-dark", darkMode.toString());
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (highScore !== null) {
      localStorage.setItem("memory-highscore", highScore.toString());
    }
  }, [highScore]);

  useEffect(() => {
    localStorage.setItem("memory-game-scores", JSON.stringify(gameHistory));
  }, [gameHistory]);

  // Timer management
  useEffect(() => {
    if (isRunning && !gameWon) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, gameWon]);

  // Save score and update history
  const saveScore = useCallback((time: number, cardCount: number) => {
    const newScore: GameScore = {
      id: crypto.randomUUID(),
      time,
      date: new Date().toISOString(),
      cardCount,
      isHighScore: false,
    };

    setGameHistory((prevHistory) => {
      const updatedHistory = [...prevHistory, newScore];
      // Find the fastest time in the updated history
      const fastestTime = Math.min(...updatedHistory.map((s) => s.time));
      // Mark the high score(s)
      return updatedHistory.map((score) => ({
        ...score,
        isHighScore: score.time === fastestTime,
      }));
    });
  }, []);

  // Check for game completion
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.matched)) {
      setGameWon(true);
      setIsRunning(false);
      saveScore(timer, cardCount);

      // Update high score if needed
      if (timer > 0 && (highScore === null || timer < highScore)) {
        setHighScore(timer);
      }
    }
  }, [cards, timer, highScore, saveScore, cardCount]);

  const handleCardClick = useCallback(
    (idx: number) => {
      if (!gameStarted || isChecking) return;
      if (cards[idx].flipped || cards[idx].matched) return;
      if (flippedIndices.length === 2) return;

      const newFlipped = [...flippedIndices, idx];
      setCards((prev) =>
        prev.map((card, i) => (i === idx ? { ...card, flipped: true } : card))
      );
      setFlippedIndices(newFlipped);

      if (newFlipped.length === 2) {
        setIsChecking(true);
        setTimeout(() => {
          const [firstIdx, secondIdx] = newFlipped;
          setCards((prev) =>
            prev.map((card, i) => {
              if (i === firstIdx || i === secondIdx) {
                const matched = prev[firstIdx].icon === prev[secondIdx].icon;
                return { ...card, flipped: matched, matched };
              }
              return card;
            })
          );
          setFlippedIndices([]);
          setIsChecking(false);
        }, 1000);
      }
    },
    [gameStarted, isChecking, cards, flippedIndices]
  );

  const startGame = useCallback(() => {
    setCards(generateCards(cardCount));
    setFlippedIndices([]);
    setTimer(0);
    setGameWon(false);
    setGameStarted(true);
    setIsRunning(true);
  }, [cardCount]);

  const resetGame = useCallback(() => {
    setCards(generateCards(cardCount));
    setFlippedIndices([]);
    setTimer(0);
    setGameWon(false);
    setGameStarted(false);
    setIsRunning(false);
  }, [cardCount]);

  const matches = cards.filter((c) => c.matched).length / 2;
  const totalPairs = cardCount / 2;
  const accuracy = matches > 0 ? Math.round((matches / totalPairs) * 100) : 0;

  return (
    <div className="md:container flex flex-col items-center justify-center md:max-w-6xl m-auto w-full min-h-screen">
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onHowToPlay={() => setShowHowToPlay(true)}
      />

      <main className="flex-1 md:container p-4 flex flex-col items-center gap-5 w-full">
        <GameStats
          timer={timer}
          highScore={highScore}
          matches={matches}
          totalPairs={totalPairs}
          accuracy={accuracy}
        />

        <GameControls
          cardCount={cardCount}
          setCardCount={setCardCount}
          gameStarted={gameStarted}
          onStart={startGame}
          onReset={resetGame}
        />

        <GameBoard
          cards={cards}
          gameStarted={gameStarted}
          onCardClick={handleCardClick}
          cardCount={cardCount}
        />

        <GameHistory history={gameHistory} />
      </main>

      <GameModal
        open={gameWon}
        timer={timer}
        highScore={highScore}
        onPlayAgain={startGame}
        onClose={resetGame}
      />

      <HowToPlay open={showHowToPlay} onClose={() => setShowHowToPlay(false)} />

      {gameWon && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={500}
          recycle={false}
          gravity={0.2}
        />
      )}

      <Toaster position="top-center" />
    </div>
  );
}
