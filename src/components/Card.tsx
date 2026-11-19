import { Card as ShadCard } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Add disabled prop to the interface
interface CardProps {
  flipped: boolean;
  matched: boolean;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
}

export function Card({
  flipped,
  matched,
  icon: Icon,
  onClick,
  disabled = false,
}: CardProps) {
  // Gradient colors for card backs
  const cardBackGradients = [
    "bg-gradient-to-br from-purple-500 to-pink-500",
    "bg-gradient-to-br from-blue-500 to-cyan-500",
    "bg-gradient-to-br from-green-500 to-emerald-500",
    "bg-gradient-to-br from-yellow-500 to-amber-500",
    "bg-gradient-to-br from-red-500 to-orange-500",
  ];

  // Select a random gradient for each card (consistent per render)
  const gradientClass =
    cardBackGradients[Math.floor(Math.random() * cardBackGradients.length)];

  return (
    <ShadCard
      className={cn(
        "relative h-20 sm:h-24 md:h-28 lg:h-32 shadow-none border-0",
        "transition-all duration-200 hover:shadow-lg",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        disabled && "hover:scale-100" // Disable hover effect when disabled
      )}
      onClick={disabled ? undefined : onClick} // Only allow clicks when not disabled
    >
      <div className="absolute inset-0">
        {/* Card Back (Question Mark) */}
        {!flipped && !matched ? (
          <motion.div
            className={cn(
              "absolute inset-0 flex items-center justify-center rounded-lg",
              gradientClass,
              "text-white shadow-inner"
            )}
            initial={{ rotateY: 0, opacity: 1 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.span
              className="text-3xl font-bold drop-shadow-md"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              ?
            </motion.span>
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />
          </motion.div>
        ) : (
          /* Card Front (Icon) */
          <motion.div
            className={cn(
              "absolute inset-0 flex items-center justify-center border rounded-lg",
              matched
                ? "bg-muted text-green-500"
                : "bg-gradient-to-br from-background to-muted",
              "border border-muted-foreground/20"
            )}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 15,
                delay: 0.15, // Slight delay after flip
              }}
            >
              <Icon className="h-10 w-10 sm:h-12 sm:w-12" />
            </motion.div>
          </motion.div>
        )}
      </div>
    </ShadCard>
  );
}
