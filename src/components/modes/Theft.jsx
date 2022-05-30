import React, { useEffect, useState } from 'react'
import Button from '../core/Button'
import GoldCoins from '../../assets/gold_coins.svg'
import Background from '../../assets/fortress-inside.png'
import Briefcase from '../../assets/briefcase.svg'
import MoneyBag from '../../assets/money-bag.svg'
import { Link } from 'react-router-dom'
import Inventory, { BURLAP_SACK, GOLD, LEATHER_SACK } from '../common/Inventory'
import LoserModal from '../common/LoserModal'

const Theft = () => {

    const [ goldCount, setGoldCount ] = useState(0)
    const [ bagType, setBagType ] = useState(BURLAP_SACK)
    const [ history, setHistory ] = useState([])
    const [ highScore, setHighScore ] = useState(JSON.parse(localStorage.getItem('highScore')) || {[BURLAP_SACK]: 0, [LEATHER_SACK]: 0})

    const [ inventoryItems, setInventoryItems ] = useState(JSON.parse(localStorage.getItem('inventoryItems')) || [{type: BURLAP_SACK, count: 2}, {type: GOLD, count: 0}])

    const hasBags = inventoryItems.some(e => (e.type === BURLAP_SACK || e.type === LEATHER_SACK) && e.count > 0)

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

    window.resetInventory = () => {
        setInventoryItems([{type: BURLAP_SACK, count: 2}, {type: GOLD, count: 0}])
        localStorage.setItem('inventoryItems', JSON.stringify([{type: BURLAP_SACK, count: 2}, {type: GOLD, count: 0}]))
    }
    const getPercentage = () => {
        if (goldCount === 0) {
            return 0
        }
        switch (bagType) {
            case 'burlap sack':
                return 0.2
            case 'leather sack':
                return 0.0625
            default:
                return 0.5
        }
    }

    useEffect(() => {
        if (inventoryItems.find(e => e.type === bagType).count === 0) {
            if (inventoryItems.find(e => e.type === BURLAP_SACK)?.count > 0) {
                setBagType(BURLAP_SACK)
            } else if (inventoryItems.find(e => e.type === LEATHER_SACK)?.count > 0) {
                setBagType(LEATHER_SACK)
            }
        }
    }, [])
    
    const handleAddClick = () => {
        if (Math.random() > getPercentage()) {
            navigator.vibrate(50)
            setHistory([...history, {message: 'success', count: goldCount + 1, bagType: bagType, action: 'add'}])
            setGoldCount(goldCount + 1)
        } else {
            navigator.vibrate([150, 30, 150])
            setHistory([...history, {message: 'failure', count: 1, bagType: bagType, action: 'bag burst!'}])
            setGoldCount(1)
            updateInventory(bagType, -1)

            if (inventoryItems.find(e => e.type === bagType).count === 0) {
                if (inventoryItems.find(e => e.type === BURLAP_SACK)?.count > 0) {
                    setBagType(BURLAP_SACK)
                } else if (inventoryItems.find(e => e.type === LEATHER_SACK)?.count > 0) {
                    setBagType(LEATHER_SACK)
                }
            }
        }
    }

    const handleStopClick = () => {
        setHistory([...history, {message: 'saved', count: goldCount, bagType: bagType, action: 'stop'}])

        if (highScore[bagType] < goldCount) {
            localStorage.setItem('highScore', JSON.stringify({...highScore, [bagType]: goldCount}))
            setHighScore({...highScore, [bagType]: goldCount})
        }
    }

    return (
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', backgroundImage: `url(${Background})`, position: 'absolute', height: '100%' , backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', overflow: 'scroll'}}>
            <Inventory inventoryItems={inventoryItems} />
            <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-around', flexDirection: 'column', alignItems: 'center', backgroundColor: '#ffffff3e', borderRadius: '2rem' }}>
                <div style={{ fontSize: '3rem', fontFamily: 'Syne Mono', monospace: 'true' }}>This haul</div>
                <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: '10rem' }}>
                    <img style={{ height: '3rem' }} src={GoldCoins} alt="Gold Coins" />
                    <div style={{ fontSize: '3rem', fontFamily: 'Syne Mono', monospace: 'true' }}>{goldCount}</div>
                </div>
                <div style={{display: 'flex'}}>
                    <Button disabled={!hasBags} onClick={handleAddClick}>
                        Loot
                    </Button>
                    <Link to={goldCount === 0 ? "/" : "/escape"} state={{amount: goldCount}}>
                        <Button onClick={handleStopClick}>
                            Escape
                        </Button>
                    </Link>
                </div>
                <p style={{ fontSize: '1rem', fontFamily: 'Syne Mono', monospace: 'true' }}>{`Best haul: ${highScore[bagType]}`}</p>
                <div style={{ display: 'flex' }}>
                    <BagSelector bagType={BURLAP_SACK} setBagType={() => setBagType(BURLAP_SACK)} count={inventoryItems.find(e => e.type === BURLAP_SACK)?.count || 0} isSelected={bagType === BURLAP_SACK} disabled={goldCount != 0} />
                    <BagSelector bagType={LEATHER_SACK} setBagType={() => setBagType(LEATHER_SACK)} count={inventoryItems.find(e => e.type === LEATHER_SACK)?.count || 0} isSelected={bagType === LEATHER_SACK} disabled={goldCount != 0} />
                </div>
            </div>
            {localStorage.getItem('isDeveloper') === 'true' && (
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '30%', height: '30%', display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(100, 100, 100, 0.5)', padding: 5, border: '3px solid black', overflow: 'scroll', minHeight: 300, minWidth: 300, maxWidth: '100%', maxHeight: '100%' }}>
                    {history.map((item) => (<div style={{ fontSize: '0.7rem', fontFamily: 'Syne Mono', monospace: 'true' }}>{`${item.message} - ${item.count} - ${item.bagType} - ${item.action}`}</div>))}
                </div>
            )}
            <LoserModal show={!hasBags && inventoryItems.find(e => e.type === GOLD).count + goldCount < 3} />
        </div>
    )
}

export default Theft

const BagSelector = ({ bagType, setBagType, count, isSelected, disabled }) => {

    const getInventoryImage = () => {
        switch (bagType) {
            case GOLD:
                return GoldCoins
            case BURLAP_SACK:
                return MoneyBag
            case LEATHER_SACK:
                return Briefcase
            default:
                return 'https://i.imgur.com/g9ZQ2nZ.png'
        }
    }

    const handleClick = () => {
        if (count > 0 && !isSelected && !disabled) {
            setBagType()
        }
    }

    return (
        <div onClick={handleClick} style={{ transition: 'all .2s', borderRadius: '1rem', width: '4rem', height: '4rem', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', opacity: count > 0 ? 1 : 0.5, border: isSelected ? '3px black solid' : 'none', margin: isSelected ? -3 : 0 }}>
            <img style={{ height: '3rem' }} src={getInventoryImage()} alt="Burlap Sack" />
        </div>
    )
}