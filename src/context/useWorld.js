import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  COUNTRIES,
  conquestReward,
  delegationPrice,
  getCountry,
  lootRate,
  WALES_POPULATION,
} from '../assets/countries';
import { ACCOMPLICE, GOLD, WALES } from '../components/common/Inventory';
import { useInventory } from './useInventory';

const STORAGE_KEY = 'worldState';

// Delegations keep looting while you're away, but only up to half a day of it.
const MAX_CATCHUP_SECONDS = 12 * 60 * 60;

const WorldContext = createContext();

export const useWorld = () => {
    const context = useContext(WorldContext);
    if (!context) {
        throw new Error('useWorld must be used within a WorldProvider');
    }
    return context;
};

/** You need Wales, and enough accomplices to fill it, before the world opens up. */
export const canRuleTheWorld = (inventoryItems) => {
    const countOf = (type) =>
        inventoryItems.find((item) => item.type === type)?.count ?? 0;
    return countOf(WALES) > 0 && countOf(ACCOMPLICE) >= WALES_POPULATION;
};

const emptyState = () => ({
    countries: {},
    lastTick: Date.now(),
    unlocked: false,
    sawEnding: false,
});

const loadState = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!saved || typeof saved !== 'object') {
            return emptyState();
        }
        return {
            countries: saved.countries || {},
            lastTick: saved.lastTick || Date.now(),
            unlocked: !!saved.unlocked,
            sawEnding: !!saved.sawEnding,
        };
    } catch {
        return emptyState();
    }
};

export const emptyDelegation = {
    delegation: 0,
    progress: 0,
    conquered: false,
    paid: false,
};

const entryFor = (state, id) => state.countries[id] || emptyDelegation;

/**
 * Move every stationed delegation forward by the wall-clock time since the last
 * tick, settling any country whose looting finished. Pure, so it can be run
 * once a second or once after a twelve hour nap with the same result.
 */
const advance = (state, now) => {
    const seconds = Math.min(
        Math.max((now - state.lastTick) / 1000, 0),
        MAX_CATCHUP_SECONDS
    );
    const countries = {};
    const rewards = { [GOLD]: 0, [ACCOMPLICE]: 0 };
    const fallen = [];
    let changed = false;

    Object.entries(state.countries).forEach(([id, entry]) => {
        const country = getCountry(id);
        if (!country || entry.conquered || entry.delegation <= 0 || seconds <= 0) {
            countries[id] = entry;
            return;
        }

        changed = true;
        const progress = entry.progress + lootRate(country, entry.delegation) * seconds;

        if (progress >= 1) {
            countries[id] = { ...entry, delegation: 0, progress: 1, conquered: true };
            // The delegation comes home, and brings the whole country with it.
            rewards[ACCOMPLICE] += entry.delegation + country.population;
            rewards[GOLD] += conquestReward(country);
            fallen.push(country);
        } else {
            countries[id] = { ...entry, progress };
        }
    });

    return {
        next: { ...state, countries, lastTick: now },
        rewards,
        fallen,
        changed,
    };
};

export const WorldProvider = ({ children }) => {
    const { inventoryItems, applyInventoryChanges } = useInventory();
    const [world, setWorld] = useState(loadState);
    const [lastConquest, setLastConquest] = useState(null);
    const [justUnlocked, setJustUnlocked] = useState(false);

    const worldRef = useRef(world);
    const applyRef = useRef(applyInventoryChanges);
    const inventoryRef = useRef(inventoryItems);

    useEffect(() => {
        applyRef.current = applyInventoryChanges;
        inventoryRef.current = inventoryItems;
    });

    const commit = useCallback((next) => {
        worldRef.current = next;
        setWorld(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }, []);

    // While nothing is stationed abroad there is nothing to advance, so the tick
    // deliberately leaves lastTick alone; every deployment resets it instead.
    useEffect(() => {
        const tick = () => {
            const { next, rewards, fallen, changed } = advance(worldRef.current, Date.now());
            if (!changed) {
                return;
            }
            commit(next);
            applyRef.current(rewards);
            if (fallen.length > 0) {
                setLastConquest({ countries: fallen, at: Date.now() });
            }
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [commit]);

    // Latch the unlock: once the world is open it stays open, even while most of
    // your accomplices are abroad and your home count has dropped.
    useEffect(() => {
        if (!world.unlocked && canRuleTheWorld(inventoryItems)) {
            commit({ ...worldRef.current, unlocked: true });
            setJustUnlocked(true);
        }
    }, [inventoryItems, world.unlocked, commit]);

    const deployDelegation = (id, size) => {
        const country = getCountry(id);
        const current = worldRef.current;
        const entry = entryFor(current, id);
        const delegates = Math.floor(size);

        if (!country || entry.conquered || delegates <= 0) {
            return false;
        }

        const countOf = (type) =>
            inventoryRef.current.find((item) => item.type === type)?.count ?? 0;
        const price = entry.paid ? 0 : delegationPrice(country);

        if (countOf(ACCOMPLICE) < delegates || countOf(GOLD) < price) {
            return false;
        }

        commit({
            ...current,
            lastTick: Date.now(),
            countries: {
                ...current.countries,
                [id]: {
                    ...entry,
                    delegation: entry.delegation + delegates,
                    paid: true,
                },
            },
        });
        applyRef.current({ [ACCOMPLICE]: -delegates, [GOLD]: -price });
        return true;
    };

    const recallDelegation = (id) => {
        const current = worldRef.current;
        const entry = current.countries[id];
        if (!entry || entry.delegation <= 0) {
            return;
        }

        commit({
            ...current,
            lastTick: Date.now(),
            countries: {
                ...current.countries,
                // Progress stays put. The looting just stops while they're home.
                [id]: { ...entry, delegation: 0 },
            },
        });
        applyRef.current({ [ACCOMPLICE]: entry.delegation });
    };

    const acknowledgeEnding = () => commit({ ...worldRef.current, sawEnding: true });
    const acknowledgeUnlock = () => setJustUnlocked(false);
    const resetWorld = () => commit(emptyState());

    const conqueredCountries = COUNTRIES.filter(
        (country) => world.countries[country.id]?.conquered
    );
    const welshPopulation = conqueredCountries.reduce(
        (sum, country) => sum + country.population,
        WALES_POPULATION
    );
    const deployedAccomplices = Object.values(world.countries).reduce(
        (sum, entry) => sum + entry.delegation,
        0
    );

    return (
        <WorldContext.Provider
            value={{
                countries: world.countries,
                delegationFor: (id) => entryFor(world, id),
                unlocked: world.unlocked,
                justUnlocked,
                acknowledgeUnlock,
                deployDelegation,
                recallDelegation,
                resetWorld,
                lastConquest,
                conqueredCount: conqueredCountries.length,
                welshPopulation,
                deployedAccomplices,
                isWorldWelsh: conqueredCountries.length === COUNTRIES.length,
                sawEnding: world.sawEnding,
                acknowledgeEnding,
            }}
        >
            {children}
        </WorldContext.Provider>
    );
};
