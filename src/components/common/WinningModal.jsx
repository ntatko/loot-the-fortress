import React from 'react'
import Button from '../core/Button'
import PropTypes from 'prop-types'
import { ACCOMPLICE, getInventoryImage, IPHONE, WALES } from './Inventory'

const WinningModal = (props) => {

    if (!props.show) {
        return null
    }

    return (
        <div className="modal-container">
            <div className='modal-content'>
                    <span className='modal-header text'>🎉🎉🎉 You Won... Kind of.</span>
                    <div className='text' style={{ fontSize: '1.2rem' }}>
                        <p>But the fun is just getting started.</p>
                        <p>There are three new inventory items now:</p>

                        <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                            <img style={{ height: '2.5rem' }} src={getInventoryImage(ACCOMPLICE)} alt={ACCOMPLICE} />
                            <div style={{ fontSize: '1.5rem', fontFamily: 'Syne Mono', monospace: 'true' }}><b>{ACCOMPLICE}</b></div>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontFamily: 'Syne Mono', monospace: 'true' }}>A thieving multiplier</div>
                        <p>Every time you loot, your <strong>accomplice</strong> does, too. Your <b>sack</b> can hold all the extra gold, too, without being any more likely to break. Oh, and you can have an unlimited amount of accomplices, working as multipliers for you while you <b>loot</b>.</p>

                        <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                            <img style={{ height: '2.5rem' }} src={getInventoryImage(IPHONE)} alt={IPHONE} />
                            <div style={{ fontSize: '1.5rem', fontFamily: 'Syne Mono', monospace: 'true' }}><b>{IPHONE}</b></div>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontFamily: 'Syne Mono', monospace: 'true' }}>A Googling Device</div>
                        <p>Every time you answer your trivia question wrong, your <strong>iphone</strong> corrects you, because you should have been googling those anyway.</p>

                        <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                            <img style={{ height: '2.5rem' }} src={getInventoryImage(WALES)} alt={WALES} />
                            <div style={{ fontSize: '1.5rem', fontFamily: 'Syne Mono', monospace: 'true' }}><b>{WALES}</b></div>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontFamily: 'Syne Mono', monospace: 'true' }}>Literally, the country of wales</div>
                        <p>Yeah, you can buy <strong>wales</strong>. What other game lets you do that?</p>
                        <br></br>
                        <p>Oh, and the population of Wales is 3.2 million people. Just an interesting hint.</p>
                    </div>

                    <Button onClick={() => {
                        props.onClose()
                    }}>Keep Playing</Button>
            </div>
        </div>
    )
}

WinningModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default WinningModal