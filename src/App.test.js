import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { ACCOMPLICE, BURLAP_SACK, GOLD, WALES } from './components/common/Inventory';

const saveInventory = (items) =>
  localStorage.setItem('inventoryItems', JSON.stringify(items));

beforeEach(() => {
  localStorage.clear();
  // Otherwise the how-to-play modal covers the menu.
  localStorage.setItem('firstTime', 'false');
});

test('opens on the fortress menu', () => {
  render(<App />);
  expect(screen.getByText('Loot the Fortress')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Go Looting' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Stock Up' })).toBeInTheDocument();
});

test('starts you off with a burlap sack', () => {
  render(<App />);
  expect(screen.getByText(BURLAP_SACK)).toBeInTheDocument();
});

describe('the how-to-play modal', () => {
  it('greets a brand new player', () => {
    localStorage.removeItem('firstTime');
    render(<App />);
    expect(screen.getByText('How to play')).toBeInTheDocument();
  });

  it('stays shut for a returning player', () => {
    render(<App />); // beforeEach has already marked them as returning
    expect(screen.queryByText('How to play')).not.toBeInTheDocument();
  });

  it('remembers being dismissed', () => {
    localStorage.removeItem('firstTime');
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'I got it' }));

    expect(screen.queryByText('How to play')).not.toBeInTheDocument();
    expect(localStorage.getItem('firstTime')).toBe('false');
  });

  it('can be reopened from the menu', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Instructions' }));
    expect(screen.getByText('How to play')).toBeInTheDocument();
  });
});

test('keeps the world map hidden until Wales is full', () => {
  saveInventory([
    { type: BURLAP_SACK, count: 2 },
    { type: GOLD, count: 999999999 },
    { type: WALES, count: 1 },
    { type: ACCOMPLICE, count: 3199999 },
  ]);
  render(<App />);
  expect(screen.queryByRole('link', { name: 'Rule the World' })).not.toBeInTheDocument();
});

test('unlocks the world map once Wales is full, and remembers it', () => {
  saveInventory([
    { type: BURLAP_SACK, count: 2 },
    { type: GOLD, count: 0 },
    { type: WALES, count: 1 },
    { type: ACCOMPLICE, count: 3200000 },
  ]);
  render(<App />);

  expect(screen.getByRole('link', { name: 'Rule the World' })).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('worldState')).unlocked).toBe(true);
});

test('leaves the world map unlocked while the accomplices are abroad', () => {
  localStorage.setItem(
    'worldState',
    JSON.stringify({ countries: {}, lastTick: Date.now(), unlocked: true, sawEnding: false })
  );
  saveInventory([
    { type: BURLAP_SACK, count: 2 },
    { type: GOLD, count: 0 },
    { type: WALES, count: 1 },
    { type: ACCOMPLICE, count: 0 },
  ]);
  render(<App />);

  expect(screen.getByRole('link', { name: 'Rule the World' })).toBeInTheDocument();
});
