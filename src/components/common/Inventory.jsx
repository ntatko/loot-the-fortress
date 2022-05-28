import React, { useState } from 'react'
import PropTypes from 'prop-types'
import MoneyBag from '../../assets/money-bag.svg'
import Coins from '../../assets/gold_coins.svg'
import Briefcase from '../../assets/briefcase.svg'
import Crown from '../../assets/crown.svg'
import InventoryItem from './InventoryItem'

export const GOLD = 'gold'
export const BURLAP_SACK = 'burlap sack'
export const LEATHER_SACK = 'leather sack'
export const CROWN = 'crown'

const Inventory = (props) => {
    const { inventoryItems } = props

    const getInventoryImage = (item) => {
        switch (item.type) {
            case GOLD:
                return Coins
            case BURLAP_SACK:
                return MoneyBag
            case LEATHER_SACK:
                return Briefcase
            case CROWN:
                return Crown
            default:
                return 'https://i.imgur.com/g9ZQ2nZ.png'
        }
    }

    return (
        <div style={{ padding: '1rem', backgroundColor: '#ffffff3e', borderRadius: '2rem', margin: '2rem' }}>
            <div style={{ fontSize: '3rem', fontFamily: 'Syne Mono', monospace: 'true' }}>Your wares</div>
            {inventoryItems.map(item => <InventoryItem key={item.type} image={getInventoryImage(item)} {...item} />)}
        </div>
    )
}

Inventory.propTypes = {
    inventoryItems: PropTypes.arrayOf({
        name: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
    }).isRequired,
}

export default Inventory