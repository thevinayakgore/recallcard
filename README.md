# Recall Card Game

A memory game built with React, TypeScript, Tailwind CSS, and React Icons.

## Features

- 32 cards (4 rows x 8 columns) with 16 unique React icons (each appears twice)
- Flip animation (horizontal 180°) using Tailwind CSS
- Match two cards with the same icon to disable them
- Timer and high score tracking (high score saved in localStorage)
- Celebration animation and message on win
- Start Game, Reset Game, and Play Again controls
- Responsive, modern UI

## How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## How to Play

- Click **Start Game** to begin.
- Click on cards to flip them. Only two cards can be flipped at a time.
- If the two flipped cards match, they stay revealed and are disabled.
- If they do not match, they flip back after a short delay.
- Match all pairs to win! Your time is recorded and compared to your best (high score).
- Use **Reset Game** to restart at any time, or **Play Again** after winning.

## Tech Stack

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Vite](https://vitejs.dev/)

---

Enjoy the game and challenge yourself to beat your best time!
