import React, { createContext, useContext, useState } from 'react';
import { BURLAP_SACK, GOLD } from '../components/common/Inventory';

const InventoryContext = createContext();

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return context;
};

export const InventoryProvider = ({ children }) => {
    const [inventoryItems, setInventoryItems] = useState(
        JSON.parse(localStorage.getItem('inventoryItems')) || [
            { type: BURLAP_SACK, count: 2 },
            { type: GOLD, count: 0 }
        ]
    );

    const updateInventory = (type, change) => {
        const newInventory = [...inventoryItems];
        const index = newInventory.findIndex(item => item.type === type);
        if (index === -1) {
            newInventory.push({ type, count: change });
        } else {
            newInventory[index].count += change;
        }
        setInventoryItems(newInventory);
        localStorage.setItem('inventoryItems', JSON.stringify(newInventory));
    };

    /**
     * Apply several changes at once, e.g. { accomplice: -500, gold: -1000 }.
     * Unlike updateInventory this reads from the latest state rather than the
     * render it was created in, so the world tick can settle a handful of
     * conquests in a single pass without clobbering itself.
     */
    const applyInventoryChanges = (changes) => {
        setInventoryItems((current) => {
            const newInventory = current.map((item) => ({ ...item }));
            Object.entries(changes).forEach(([type, change]) => {
                if (!change) {
                    return;
                }
                const index = newInventory.findIndex(item => item.type === type);
                if (index === -1) {
                    newInventory.push({ type, count: change });
                } else {
                    newInventory[index].count += change;
                }
            });
            localStorage.setItem('inventoryItems', JSON.stringify(newInventory));
            return newInventory;
        });
    };

    const buyItems = (type, change, cost) => {
      const newInventory = [...inventoryItems];
      const index = newInventory.findIndex((item) => item.type === type);
  
      if (index === -1) {
        newInventory.push({ type, count: change });
      } else {
        newInventory[index].count += change;
      }
      const goldIndex = newInventory.findIndex((item) => item.type === GOLD);
      newInventory[goldIndex].count -= cost;
  
      setInventoryItems(newInventory);
      localStorage.setItem("inventoryItems", JSON.stringify(newInventory));
    };

    const resetInventory = () => {
        setInventoryItems([{ type: BURLAP_SACK, count: 2 }, { type: GOLD, count: 0 }]);
        localStorage.setItem('inventoryItems', JSON.stringify([{ type: BURLAP_SACK, count: 2 }, { type: GOLD, count: 0 }]));
    };

    return (
        <InventoryContext.Provider value={{ inventoryItems, updateInventory, applyInventoryChanges, resetInventory, buyItems }}>
            {children}
        </InventoryContext.Provider>
    );
};
