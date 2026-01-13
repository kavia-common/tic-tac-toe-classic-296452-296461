import React, { useMemo, useState } from "react";

/**
 * A cell value: "X", "O", or null (empty).
 * Keeping this as plain JS while ensuring core logic is pure and testable.
 */

/**
 * PUBLIC_INTERFACE
 * Determine winner and the winning line for a 3x3 Tic Tac Toe board.
 * @param {(("X"|"O"|null)[])} board - Array of 9 cells.
 * @returns {{ winner: ("X"|"O"|null), line: number[] }} Winner symbol (or null) and the winning cell indices (empty if none).
 */
export function calculateWinner(board) {
  const lines = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    const v = board[a];
    if (v && v === board[b] && v === board[c]) {
      return { winner: v, line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

/**
 * PUBLIC_INTERFACE
 * Check if the game is a draw (board full and no winner).
 * @param {(("X"|"O"|null)[])} board - Array of 9 cells.
 * @returns {boolean} True if draw, else false.
 */
export function isDraw(board) {
  // Board full means no nulls.
  return board.every((c) => c !== null) && calculateWinner(board).winner === null;
}

function Cell({ value, onClick, disabled, isWinning }) {
  return (
    <button
      type="button"
      className={`ttt-cell ${isWinning ? "ttt-cell--winning" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `Cell ${value}` : "Empty cell"}
    >
      <span className={`ttt-mark ${value === "X" ? "ttt-mark--x" : value === "O" ? "ttt-mark--o" : ""}`}>
        {value ?? ""}
      </span>
    </button>
  );
}

export default function App() {
  const [board, setBoard] = useState(() => Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line } = useMemo(() => calculateWinner(board), [board]);
  const draw = useMemo(() => isDraw(board), [board]);

  const gameOver = winner !== null || draw;

  function handleCellClick(index) {
    // Disallow moves if game is over or cell already filled.
    if (gameOver || board[index] !== null) return;

    const nextBoard = board.slice();
    nextBoard[index] = xIsNext ? "X" : "O";
    setBoard(nextBoard);
    setXIsNext((v) => !v);
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  const turnText = xIsNext ? "X's turn" : "O's turn";

  let statusNode = null;
  if (winner) {
    statusNode = (
      <div className="ttt-status ttt-status--win" role="status" aria-live="polite">
        {winner} wins!
      </div>
    );
  } else if (draw) {
    statusNode = (
      <div className="ttt-status ttt-status--draw" role="status" aria-live="polite">
        It's a draw
      </div>
    );
  } else {
    statusNode = (
      <div className="ttt-turn" role="status" aria-live="polite">
        {turnText}
      </div>
    );
  }

  return (
    <div className="ttt-page">
      <main className="ttt-card">
        <header className="ttt-header">
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <p className="ttt-subtitle">Two players, one board — take turns and get 3 in a row.</p>
        </header>

        <section className="ttt-top">{statusNode}</section>

        <section className="ttt-boardWrap" aria-label="Tic Tac Toe board">
          <div className="ttt-board" role="grid" aria-label="3 by 3 grid">
            {board.map((value, idx) => (
              <Cell
                key={idx}
                value={value}
                onClick={() => handleCellClick(idx)}
                disabled={gameOver || value !== null}
                isWinning={line.includes(idx)}
              />
            ))}
          </div>
        </section>

        <footer className="ttt-footer">
          <button type="button" className="ttt-reset" onClick={resetGame}>
            Reset Game
          </button>
          <div className="ttt-hint">
            {winner
              ? "Game over — reset to play again."
              : draw
                ? "No winner this time — reset and try again."
                : "Tip: Winning lines are highlighted when the game ends."}
          </div>
        </footer>
      </main>
    </div>
  );
}
