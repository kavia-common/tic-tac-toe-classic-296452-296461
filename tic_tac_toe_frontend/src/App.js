import React, { useMemo, useState } from "react";

/**
 * Checks the board for a winner.
 * @param {Array<("X"|"O"|null)>} squares
 * @returns {"X"|"O"|null}
 */
function calculateWinner(squares) {
  const lines = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) return v;
  }
  return null;
}

/**
 * Returns true when no cells are empty.
 * @param {Array<("X"|"O"|null)>} squares
 */
function isBoardFull(squares) {
  return squares.every((v) => v !== null);
}

// PUBLIC_INTERFACE
export default function App() {
  /**
   * Board uses 0..8 positions:
   * 0 1 2
   * 3 4 5
   * 6 7 8
   */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = useMemo(
    () => !winner && isBoardFull(squares),
    [winner, squares],
  );
  const isGameOver = Boolean(winner) || isDraw;

  const statusText = useMemo(() => {
    if (winner) return `${winner} wins`;
    if (isDraw) return "Draw";
    return `Turn: ${xIsNext ? "X" : "O"}`;
  }, [winner, isDraw, xIsNext]);

  function handleSquareClick(index) {
    // Prevent overwriting or continuing after game ends.
    if (isGameOver || squares[index]) return;

    const next = squares.slice();
    next[index] = xIsNext ? "X" : "O";
    setSquares(next);
    setXIsNext((v) => !v);
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="page">
      <main className="card" aria-label="Tic Tac Toe game">
        <header className="header">
          <h1 className="title">Tic Tac Toe</h1>

          <div
            className={[
              "statusPill",
              winner ? "statusPill--win" : "",
              isDraw ? "statusPill--draw" : "",
            ].join(" ")}
            role="status"
            aria-live="polite"
          >
            <span className="statusLabel">{statusText}</span>
          </div>
        </header>

        <section className="boardWrap" aria-label="Game board">
          <div className="board" role="grid" aria-label="3 by 3 board">
            {squares.map((value, i) => {
              const isDisabled = Boolean(value) || isGameOver;
              return (
                <button
                  key={i}
                  type="button"
                  className={[
                    "cell",
                    value === "X" ? "cell--x" : "",
                    value === "O" ? "cell--o" : "",
                  ].join(" ")}
                  onClick={() => handleSquareClick(i)}
                  disabled={isDisabled}
                  role="gridcell"
                  aria-label={`Cell ${i + 1}${value ? `: ${value}` : ""}`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </section>

        <footer className="footer">
          <p className="helper">
            X starts. Take turns tapping an empty square.
          </p>

          <div className="actions">
            <button
              type="button"
              className="primaryButton"
              onClick={resetGame}
            >
              Reset game
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
