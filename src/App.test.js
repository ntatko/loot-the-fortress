import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';
import {
  ACCOMPLICE,
  BURLAP_SACK,
  GOLD,
  IPHONE,
  WALES,
} from './components/common/Inventory';

const saveInventory = (items) =>
  localStorage.setItem('inventoryItems', JSON.stringify(items));

beforeEach(() => {
  localStorage.clear();
  // Otherwise the how-to-play modal covers the menu.
  localStorage.setItem('firstTime', 'false');
  // jsdom keeps the URL between tests, so BrowserRouter would still be on
  // whatever page the last test navigated to.
  window.history.pushState({}, '', '/');
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

describe('the wares panel', () => {
  it('leaves out anything you have none of', () => {
    saveInventory([
      { type: BURLAP_SACK, count: 0 },
      { type: 'leather sack', count: 3 },
      { type: GOLD, count: 12 },
    ]);
    render(<App />);

    expect(screen.queryByText(BURLAP_SACK)).not.toBeInTheDocument();
    expect(screen.getByText('leather sack')).toBeInTheDocument();
    expect(screen.getByText(GOLD)).toBeInTheDocument();
  });

  it('says so when you have nothing at all', () => {
    saveInventory([
      { type: BURLAP_SACK, count: 0 },
      { type: GOLD, count: 0 },
    ]);
    render(<App />);
    expect(screen.getByText('Nothing at all.')).toBeInTheDocument();
  });

  it('shows a trophy as a small icon with no count', () => {
    saveInventory([
      { type: GOLD, count: 12 },
      { type: 'crown', count: 1 },
      { type: IPHONE, count: 1 },
    ]);
    render(<App />);

    // Present as icons...
    expect(screen.getByAltText('crown')).toBeInTheDocument();
    expect(screen.getByAltText(IPHONE)).toBeInTheDocument();
    // ...but without the big count-and-label treatment the supplies get.
    expect(screen.queryByText('crown')).not.toBeInTheDocument();
    expect(screen.queryByText(IPHONE)).not.toBeInTheDocument();
  });

  it('marks up a spare with a multiplier', () => {
    saveInventory([
      { type: GOLD, count: 12 },
      { type: IPHONE, count: 2 },
      { type: WALES, count: 3 },
      { type: 'crown', count: 1 },
    ]);
    render(<App />);

    expect(screen.getByText('x2')).toBeInTheDocument();
    expect(screen.getByText('x3')).toBeInTheDocument();
    // One crown is just a crown.
    expect(screen.queryByText('x1')).not.toBeInTheDocument();
  });
});

describe('looting abroad', () => {
  const stationedSave = () => {
    saveInventory([
      { type: BURLAP_SACK, count: 0 },
      { type: 'backpack', count: 20 },
      { type: GOLD, count: 1000000 },
      { type: 'crown', count: 1 },
      { type: WALES, count: 1 },
      { type: ACCOMPLICE, count: 3200000 },
    ]);
    localStorage.setItem(
      'worldState',
      JSON.stringify({
        unlocked: true,
        sawEnding: false,
        // Ten times the Vatican's 764 people: two taps and it falls.
        countries: {
          vatican: { delegation: 7640, progress: 0, conquered: false, paid: true },
        },
      })
    );
  };

  const worldState = () => JSON.parse(localStorage.getItem('worldState'));

  it('does not advance on its own', () => {
    stationedSave();
    render(<App />);
    expect(worldState().countries.vatican.progress).toBe(0);
  });

  it('advances a delegation on every tap of Loot', () => {
    stationedSave();
    render(<App />);

    fireEvent.click(screen.getByRole('link', { name: 'Go Looting' }));
    fireEvent.click(screen.getByRole('button', { name: 'Loot' }));

    expect(worldState().countries.vatican.progress).toBeCloseTo(0.5, 10);
    expect(worldState().countries.vatican.conquered).toBe(false);
    expect(screen.getByText('Vatican City')).toBeInTheDocument();
  });

  it('settles the country, and pays out, on the tap that finishes it', () => {
    stationedSave();
    render(<App />);

    fireEvent.click(screen.getByRole('link', { name: 'Go Looting' }));
    fireEvent.click(screen.getByRole('button', { name: 'Loot' }));
    fireEvent.click(screen.getByRole('button', { name: 'Loot' }));

    expect(worldState().countries.vatican.conquered).toBe(true);
    expect(screen.getByText(/went Welsh this trip: Vatican City/)).toBeInTheDocument();

    const inventory = JSON.parse(localStorage.getItem('inventoryItems'));
    const countOf = (type) => inventory.find((i) => i.type === type).count;
    // The 7,640 delegates come home with all 764 locals behind them.
    expect(countOf(ACCOMPLICE)).toBe(3200000 + 7640 + 764);
    expect(countOf(GOLD)).toBe(1000000 + 764 * 2500);
  });
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

    // The world stage is its own five step walkthrough.
    const world = sectionFor('Ruling the world');
    expect(world.querySelectorAll('svg[role="img"]')).toHaveLength(5);
    [
      '1. Buy your way in',
      '2. Send a delegation',
      '3. Go back to looting',
      '4. Take the country',
      '5. Rule the world',
    ].forEach((heading) => {
      const step = within(world).getByText(heading).closest('section');
      expect(step.querySelector('svg[role="img"]')).not.toBeNull();
    });
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
