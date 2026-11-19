import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface GameControlsProps {
  cardCount: number;
  setCardCount: (count: number) => void;
  gameStarted: boolean;
  onStart: () => void;
  onReset: () => void;
}

export function GameControls({
  cardCount,
  setCardCount,
  gameStarted,
  onStart,
  onReset,
}: GameControlsProps) {
  return (
    <main className="w-full space-y-4">
      <RadioGroup
        value={cardCount.toString()}
        onValueChange={(value) => setCardCount(Number(value))}
        className="grid sm:grid-cols-3 gap-2"
        disabled={gameStarted}
      >
        {[
          { value: "12", label: "Easy" },
          { value: "20", label: "Medium" },
          { value: "30", label: "Hard" },
        ].map((option) => (
          <div key={option.value}>
            <RadioGroupItem
              value={option.value}
              id={option.value}
              className="peer sr-only"
            />
            <Label
              htmlFor={option.value}
              className={cn(
                "flex flex-col items-center justify-between text-base md:text-lg rounded-md border-2 border-muted bg-popover p-4 md:p-8 hover:bg-accent hover:text-accent-foreground",
                "peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
                "cursor-pointer transition-all",
                gameStarted ? "opacity-50 cursor-not-allowed" : ""
              )}
            >
              {option.label}
              <span className="text-xl md:text-3xl text-muted-foreground">
                {option.value} cards
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="flex gap-4">
        {!gameStarted ? (
          <Button
            size="lg"
            className="p-4 sm:p-8 text-sm md:text-xl w-full"
            onClick={onStart}
          >
            Start Game
          </Button>
        ) : (
          <Button
            variant="outline"
            size="lg"
            className="p-4 sm:p-8 text-sm md:text-xl w-full"
            onClick={onReset}
          >
            Reset Game
          </Button>
        )}
      </div>
    </main>
  );
}
