import React from 'react'
import PropTypes from 'prop-types'
import MoneyBag from '../../assets/money-bag.svg'
import Coins from '../../assets/gold_coins.svg'
import Briefcase from '../../assets/briefcase.svg'
import Crown from '../../assets/crown.svg'
import InventoryItem from './InventoryItem'
import iphone from '../../assets/iphone.svg'
import backpack from '../../assets/backpack.svg'
import wales from '../../assets/wales.svg'

export const GOLD = 'gold'
export const BURLAP_SACK = 'burlap sack'
export const LEATHER_SACK = 'leather sack'
export const CROWN = 'crown'
export const IPHONE = 'iphone'
export const BACKPACK = 'backpack'
export const WALES = 'wales'

export const getInventoryImage = (item) => {
    switch (item) {
        case GOLD:
            return Coins
        case BURLAP_SACK:
            return MoneyBag
        case LEATHER_SACK:
            return Briefcase
        case CROWN:
            return Crown
        case IPHONE:
            return iphone
        case BACKPACK:
            return backpack
        case WALES:
            return wales
        default:
            return 'https://i.imgur.com/g9ZQ2nZ.png'
    }
}

const Inventory = (props) => {
    const { inventoryItems } = props

    return (
        <div style={{ padding: '1rem', backgroundColor: '#ffffff3e', borderRadius: '2rem', margin: '2rem' }}>
            <div style={{ fontSize: '3rem', fontFamily: 'Syne Mono', monospace: 'true' }}>Your wares</div>
            {inventoryItems.map(item => <InventoryItem key={item.type} image={getInventoryImage(item.type)} {...item} />)}
        </div>
    )
}

Inventory.propTypes = {
    inventoryItems: PropTypes.arrayOf({
        type: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
    }).isRequired,
}

export default Inventory