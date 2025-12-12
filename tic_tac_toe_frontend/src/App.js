import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * Compute the winner of a Tic Tac Toe board.
 * @param {Array<string|null>} squares - a 9-length array of 'X' | 'O' | null
 * @returns {{winner: ('X'|'O'|null), line: number[]|null}} winner and winning line if any
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diags
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

// PUBLIC_INTERFACE
function App() {
  /** Main Tic Tac Toe application – shows board, turn indicator, result, and reset button. */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [theme] = useState('light'); // fixed to light per requirement

  useEffect(() => {
    // Apply theme attribute to the root for CSS variables to work
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const isBoardFull = useMemo(() => squares.every((s) => s !== null), [squares]);
  const isDraw = !winner && isBoardFull;
  const currentPlayer = xIsNext ? 'X' : 'O';
  const gameOver = Boolean(winner) || isDraw;

  const handleClick = (index) => {
    if (squares[index] || gameOver) return; // prevent overriding or playing after end
    const next = squares.slice();
    next[index] = currentPlayer;
    setSquares(next);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    /** Reset the game to its initial state. */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="App" data-theme={theme}>
      <header className="app-header-surface">
        <div className="app-container">
          <h1 className="title">Tic Tac Toe</h1>
          <p className="subtitle">Two-player classic on a single page</p>

          <div className="status-area" role="status" aria-live="polite">
            {!gameOver ? (
              <span className="status-pill">
                Turn: <strong className={xIsNext ? 'mark-x' : 'mark-o'}>{currentPlayer}</strong>
              </span>
            ) : winner ? (
              <span className="status-pill status-win">
                Winner: <strong className={winner === 'X' ? 'mark-x' : 'mark-o'}>{winner}</strong>
              </span>
            ) : (
              <span className="status-pill status-draw">It&apos;s a draw!</span>
            )}
          </div>

          <div className="board" role="grid" aria-label="Tic Tac Toe board">
            {squares.map((value, idx) => {
              const isWinning = line?.includes(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  className={`square ${isWinning ? 'square-win' : ''}`}
                  role="gridcell"
                  aria-label={`Square ${idx + 1}${value ? `, ${value}` : ', empty'}`}
                  onClick={() => handleClick(idx)}
                  disabled={Boolean(value) || gameOver}
                >
                  <span className={`mark ${value === 'X' ? 'mark-x' : value === 'O' ? 'mark-o' : ''}`}>
                    {value}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="controls">
            <button
              type="button"
              className="btn btn-reset"
              onClick={resetGame}
              aria-label="Reset game"
            >
              Reset Game
            </button>
          </div>

          <footer className="note">
            No backend required. Runs entirely in your browser.
          </footer>
        </div>
      </header>
    </div>
  );
}

export default App;
