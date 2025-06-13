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
        <InventoryContext.Provider value={{ inventoryItems, updateInventory, resetInventory, buyItems }}>
            {children}
        </InventoryContext.Provider>
    );
};
