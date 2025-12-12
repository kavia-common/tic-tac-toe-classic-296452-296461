import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe title and Reset button', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Reset Game/i })).toBeInTheDocument();
});
