import { Card } from "./Card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GameBoardProps {
  cards: {
    id: number;
    flipped: boolean;
    matched: boolean;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  gameStarted: boolean;
  onCardClick: (idx: number) => void;
  cardCount: number;
}

export function GameBoard({ cards, gameStarted, onCardClick, cardCount }: GameBoardProps) {
  const getGridCols = () => {
    if (cardCount <= 12) return "grid-cols-3 sm:grid-cols-4";
    if (cardCount <= 20) return "grid-cols-4 sm:grid-cols-5";
    return "grid-cols-5 sm:grid-cols-6";
  };

  return (
    <main className="relative flex items-center m-auto rounded-md overflow-hidden w-full">
      {/* Game board with cards */}
      <div className={cn(
        "grid gap-3 sm:gap-4 relative w-full",
        getGridCols(),
        !gameStarted && "opacity-80" // Dim the board when not started
      )}>
        {cards.slice(0, cardCount).map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Card
              flipped={card.flipped}
              matched={card.matched}
              icon={card.icon}
              onClick={() => gameStarted && onCardClick(idx)} // Only allow clicks when game started
              disabled={!gameStarted} // Pass disabled state to Card
            />
          </motion.div>
        ))}
      </div>

      {/* Overlay when game not started */}
      {!gameStarted && (
        <div className="absolute inset-0 top-0 left-0 bg-background/60 backdrop-blur-2xl p-6 rounded-lg overflow-hidden border shadow-lg pointer-events-auto text-center flex items-center justify-center w-full h-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl md:text-7xl font-bold">Memory Card Game</h3>
            <p className="text-sm md:text-lg my-5">
              Select difficulty and click Start Game to begin
            </p>
          </motion.div>
        </div>
      )}
    </main>
  );
}