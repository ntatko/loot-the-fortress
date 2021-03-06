import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '../core/Button'
import Background from '../../assets/castle-background.png'
import Inventory, { BURLAP_SACK, CROWN, GOLD } from '../common/Inventory'
import InstructionModal from '../common/InstructionModal'
import StartOverModal from '../common/StartOverModal'
// import { useMatomo } from '@jonkoops/matomo-tracker-react'

const HomeMenu = () => {

    const onClick = () => {}
    const [ inventoryItems, setInventoryItems ] = useState(JSON.parse(localStorage.getItem('inventoryItems')) || [{type: BURLAP_SACK, count: 2}, {type: GOLD, count: 0}])
    const [ firstTime, setFirstTime ] = useState(JSON.parse(localStorage.getItem('firstTime')))
    const [ quitConfirm, setQuitConfirm ] = useState(false)
    // const { trackPageView, trackEvent } = useMatomo()

    useEffect(() => {
        // trackPageView({
        //     documentTitle: 'Home',
        //     href: '/home',
        //     customDimensions: {
        //         id: 1,
        //         value: `${inventoryItems.map(item => item.type + ":" + item.count).join(',')}`
        //     }
        // })

        window._paq.push(['setDocumentTitle', "Home"]);
        window._paq.push(['trackPageView']);
    }, [])

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
        <div style={{ zIndex: -1, position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '100%', backgroundImage: `url(${Background})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', paddingBottom: '2rem'}}>
            <div style={{ fontSize: '4rem', fontFamily: 'Syne Mono', monospace: 'true' }}>Loot the Fortress</div>
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
            <InstructionModal show={firstTime} onClose={() => {
                setFirstTime(false)
                localStorage.setItem('firstTime', JSON.stringify(false))
            }} />
            <Button onClick={() => setFirstTime(true)}>Instructions</Button>
            { inventoryItems.find(item => item.type === CROWN) && inventoryItems.find(item => item.type === CROWN).count > 0 && (
                <Button onClick={() => {
                    // trackEvent({
                    //     category: 'Home',
                    //     action: 'reset-modal'
                    // })
                    window._paq.push(['trackEvent', 'Home', 'reset-modal']);
                    setQuitConfirm(true)
                }}>Start Over</Button>
            )}
            { quitConfirm && (
                <StartOverModal onClose={() => setQuitConfirm(false)} />
            )}
        </div>
    )

}

export default HomeMenu