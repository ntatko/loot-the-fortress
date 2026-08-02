import { fireEvent, render, screen, within } from '@testing-library/react';
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

  it('leads with the loop diagram', () => {
    localStorage.removeItem('firstTime');
    render(<App />);

    const diagram = screen.getByRole('img', { name: /shop, bag, loot, escape/i });
    ['Shop', 'Bag', 'Loot', 'Escape', 'buy the crown'].forEach((step) => {
      expect(within(diagram).getByText(step)).toBeInTheDocument();
    });
  });

  it('walks through every step of the loop, each with its own graphic', () => {
    localStorage.removeItem('firstTime');
    render(<App />);

    ['1. Shop', '2. Bag', '3. Loot', '4. Escape', '5. Repeat'].forEach((heading) => {
      const section = screen.getByText(heading).closest('section');
      expect(section).not.toBeNull();
      expect(section.querySelector('svg[role="img"]')).not.toBeNull();
    });
  });

  it('illustrates the later stages too, once they unlock', () => {
    localStorage.removeItem('firstTime');
    saveInventory([
      { type: BURLAP_SACK, count: 2 },
      { type: GOLD, count: 500000000 },
      { type: 'crown', count: 1 },
      { type: WALES, count: 1 },
      { type: ACCOMPLICE, count: 3200000 },
    ]);
    render(<App />);

    const sectionFor = (title) => screen.getByText(title).closest('section');
    // One apiece for the accomplice, the iphone and wales.
    expect(sectionFor('Stage two').querySelectorAll('svg[role="img"]')).toHaveLength(3);
    expect(sectionFor('Ruling the world').querySelectorAll('svg[role="img"]')).toHaveLength(1);
  });

  it('scrolls the diagrams along with the text', () => {
    localStorage.removeItem('firstTime');
    const { container } = render(<App />);

    // The overview lives inside the scrolling body, not pinned above it.
    const body = container.querySelector('.modal-content div.text:not(.modal-header)');
    expect(body).not.toBeNull();
    expect(body.querySelector('svg[aria-label^="The loop"]')).not.toBeNull();
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
