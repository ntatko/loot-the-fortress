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
  progressPerTap,
  WALES_POPULATION,
} from '../assets/countries';
import { ACCOMPLICE, GOLD, WALES } from '../components/common/Inventory';
import { useInventory } from './useInventory';

const STORAGE_KEY = 'worldState';

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
 * One round of looting. Every delegation stationed abroad loots its country by
 * the same tap that fills your sack back at the fortress, settling any country
 * whose looting finishes. Pure, so it is trivially testable.
 *
 * Exported for the tests.
 */
export const advance = (state) => {
    const countries = {};
    const rewards = { [GOLD]: 0, [ACCOMPLICE]: 0 };
    const fallen = [];
    let changed = false;

    Object.entries(state.countries).forEach(([id, entry]) => {
        const country = getCountry(id);
        if (!country || entry.conquered || entry.delegation <= 0) {
            countries[id] = entry;
            return;
        }

        changed = true;
        const progress = entry.progress + progressPerTap(country, entry.delegation);

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

    return { next: { ...state, countries }, rewards, fallen, changed };
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

    /**
     * Called once per tap of Loot in the fortress. Everyone stationed abroad
     * loots alongside you. Returns any countries that fell on this tap so the
     * fortress can say so.
     */
    const lootAbroad = () => {
        const { next, rewards, fallen, changed } = advance(worldRef.current);
        if (!changed) {
            return [];
        }
        commit(next);
        applyRef.current(rewards);
        if (fallen.length > 0) {
            setLastConquest({ countries: fallen, at: Date.now() });
        }
        return fallen;
    };

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
    const activeDelegations = COUNTRIES.filter((country) => {
        const entry = world.countries[country.id];
        return entry && entry.delegation > 0 && !entry.conquered;
    }).map((country) => ({ country, entry: world.countries[country.id] }));

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
                lootAbroad,
                activeDelegations,
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
