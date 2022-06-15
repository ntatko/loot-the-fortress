import React, {useState, useEffect} from "react"
import ShopBackground from '../../assets/shop-inside.png'
import Inventory, { ACCOMPLICE, BACKPACK, BURLAP_SACK, CROWN, getInventoryImage, GOLD, IPHONE, LEATHER_SACK, WALES } from "../common/Inventory"
import Coins from '../../assets/gold_coins.svg'
import Button from "../core/Button"
import { Link } from "react-router-dom"
import WinningModal from "../common/WinningModal"
// import { useMatomo } from '@jonkoops/matomo-tracker-react'

const costs = {
    [BURLAP_SACK]: 3,
    [LEATHER_SACK]: 8,
    [CROWN]: 100,
    [BACKPACK]: 30,
    [ACCOMPLICE]: 1000,
    [IPHONE]: 3000,
    [WALES]: 1000000
}

const Shop = () => {

    const [ inventoryItems, setInventoryItems ] = useState(JSON.parse(localStorage.getItem('inventoryItems')) || [{type: BURLAP_SACK, count: 2}, {type: GOLD, count: 0}])
    const [ showWinningModal, setShowWinningModal ] = useState(false)
    // const { trackPageView, trackEvent } = useMatomo()
    const currentGold = inventoryItems.find(item => item.type === GOLD).count

    useEffect(() => {
        // trackPageView({
        //     documentTitle: 'Shop',
        //     href: '/shop',
        //     customDimensions: {
        //         id: 1,
        //         value: `${inventoryItems.map(item => item.type + ":" + item.count).join(',')}`
        //     }
        // })
    }, [])

    const updateInventory = (type, change, cost) => {
        const newInventory = [...inventoryItems]
        const index = newInventory.findIndex(item => item.type === type)

        if (index === -1) {
            newInventory.push({ type, count: change })
        } else {
            newInventory[index].count += change
        }
        const goldIndex = newInventory.findIndex(item => item.type === GOLD)
        newInventory[goldIndex].count -= cost

        setInventoryItems(newInventory)
        localStorage.setItem('inventoryItems', JSON.stringify(newInventory))
    }

    const buyItem = (type) => {
        // trackEvent({
        //     category: 'Shop',
        //     action: 'purchase-event',
        //     name: type
        // })
        window._paq.push(['trackEvent', 'Shop', 'purchase', type])
        try {
            navigator.vibrate(100)
        } catch {}
        updateInventory(type, 1, costs[type])
    }

    const hasWon = inventoryItems.find(item => item.type === CROWN)?.count > 0 ?? false

    return (
        <>
            <WinningModal show={showWinningModal} onClose={() => setShowWinningModal(false)} />
            <div style={{ display: 'flex', position: 'absolute', justifyContent: 'center', minHeight: '100%', width: '100%', backgroundImage: `url(${ShopBackground})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', flexWrap: 'wrap', overflow: 'scroll' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Link style={{ padding: '3rem' }} to="/">
                        <Button onClick={() => {}}>
                            Back to the Fortress
                        </Button>
                    </Link>
                    <Inventory inventoryItems={inventoryItems} />
                </div>
                <div style={{ overflow: 'scroll', width: '25rem' }}>
                    <ShopInventoryItem currentGold={currentGold} onClick={() => {
                        buyItem(CROWN)
                        setShowWinningModal(true)
                    }} type={CROWN} />
                    <ShopInventoryItem currentGold={currentGold} onClick={() => buyItem(BURLAP_SACK)} type={BURLAP_SACK} />
                    <ShopInventoryItem currentGold={currentGold} onClick={() => buyItem(LEATHER_SACK)} type={LEATHER_SACK} />
                    <ShopInventoryItem currentGold={currentGold} onClick={() => buyItem(BACKPACK)} type={BACKPACK} />
                    {hasWon && <>
                        <ShopInventoryItem currentGold={currentGold} onClick={() => buyItem(ACCOMPLICE)} type={ACCOMPLICE} />
                        <ShopInventoryItem currentGold={currentGold} onClick={() => buyItem(IPHONE)} type={IPHONE} />
                        <ShopInventoryItem currentGold={currentGold} onClick={() => buyItem(WALES)} type={WALES} />
                    </>}
                </div>
            </div>
        </>
    )

}

export default Shop




const ShopInventoryItem = (props) => {

    return (
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff3e', borderRadius: '2rem', margin: '2rem', padding: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <img style={{ height: '3.5rem' }} src={getInventoryImage(props.type)} alt={props.type} />
                <div style={{ fontSize: '2.5rem', fontFamily: 'Syne Mono', monospace: 'true' }}>{props.type}</div>
            </div>
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-evenly', alignItems: 'center', paddingLeft: '1rem', paddingRight: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: '4rem' }}>
                    <img style={{ height: '1.5rem' }} src={Coins} alt={props.type} />
                    <div style={{ fontSize: '2.5rem', fontFamily: 'Syne Mono', monospace: 'true' }}>{costs[props.type]}</div>
                </div>
                <Button disabled={props.currentGold < costs[props.type]} onClick={props.onClick}>Buy</Button>
            </div>
        </div>
    )
}