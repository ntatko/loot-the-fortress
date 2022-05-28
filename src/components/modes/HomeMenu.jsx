import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from '../core/Button'
import Background from '../../assets/castle-background.png'
import Inventory, { BURLAP_SACK, GOLD } from '../common/Inventory'

const HomeMenu = () => {

    const onClick = () => {}
    const [ inventoryItems, setInventoryItems ] = useState(JSON.parse(localStorage.getItem('inventoryItems')) || [{type: BURLAP_SACK, count: 2}, {type: GOLD, count: 0}])

    const updateInventory = (type, change) => {
        const newInventory = [...inventoryItems]
        const index = newInventory.findIndex(item => item.type === type)
        if (index === -1) {
            newInventory.push({ type, count: change })
        } else {
            newInventory[index].count += change
        }
        setInventoryItems(newInventory)
        localStorage.setItem('inventoryItems', JSON.stringify(newInventory))
    }

    window.updateInventory = updateInventory


    return (
        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundImage: `url(${Background})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', overflow: 'scroll' }}>
            <div style={{ fontSize: '5rem', fontFamily: 'Syne Mono', monospace: 'true' }}>Loot the Fortress</div>
            <Link to="/theft">
                <Button onClick={onClick}>
                    Go Looting
                </Button>
            </Link>
            <Link to="/inventory">
                <Button onClick={onClick}>
                    Stock Up
                </Button>
            </Link>
            <Inventory inventoryItems={inventoryItems} />
        </div>
    )

}

export default HomeMenu