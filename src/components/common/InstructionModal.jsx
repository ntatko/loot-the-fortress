import React from "react"
import PropTypes from 'prop-types'
import Button from "../core/Button"
import { BURLAP_SACK, LEATHER_SACK } from "./Inventory"
import MoneyBag from '../../assets/money-bag.svg'
import Coins from '../../assets/gold_coins.svg'
import Briefcase from '../../assets/briefcase.svg'
import Crown from '../../assets/crown.svg'
import Key from '../../assets/key.svg'

const InstructionModal = (props) => {

    return (
        props.show
            ? (
                <div onClick={() => props.onClose()} style={{ zIndex: 2, position: 'absolute', width: '100%', height: '100%', backgroundColor: '#464646b0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '40rem', height: '30rem', maxWidth: '100%', maxHeight: '100%', backgroundColor: '#ffffff', padding: '2rem', borderRadius: '2rem', overflow: 'scroll', margin: '.5rem' }}>
                        <div style={{ fontSize: '3rem', fontFamily: 'Syne Mono', monospace: 'true' }}>How to play</div>

                        <div style={{ fontSize: '1.2rem', fontFamily: 'Syne Mono', monospace: 'true', overflow: 'scroll' }}>
                            <p>
                                The goal of the game is to collect as much gold as possible.
                                Technically, you win when you have enough gold to buy a <img style={{ height: '1.5rem' }} src={Crown} alt={"stuff"} /> crown.
                            </p>
                            <p>
                                So, how do you make money? You <b>loot the fortress</b> and collect <img style={{ height: '1.5rem' }} src={Coins} alt={"stuff"} /> gold.
                            </p>
                            <p>
                                But there's a catch. Every time you put <img style={{ height: '1.5rem' }} src={Coins} alt={"stuff"} /> gold in your sack, there's a <b>chance that it will break</b>. Each kind of sack has a different chance of breaking.
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <img style={{ height: '2.5rem' }} src={MoneyBag} alt={props.type} />
                                <div style={{ fontSize: '1.5rem', fontFamily: 'Syne Mono', monospace: 'true' }}><b>{BURLAP_SACK}</b></div>
                                <div style={{ fontSize: '1.5rem', fontFamily: 'Syne Mono', monospace: 'true' }}>1 in 5 chance</div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <img style={{ height: '2.5rem' }} src={Briefcase} alt={props.type} />
                                <div style={{ fontSize: '1.5rem', fontFamily: 'Syne Mono', monospace: 'true' }}><b>{LEATHER_SACK}</b></div>
                                <div style={{ fontSize: '1.5rem', fontFamily: 'Syne Mono', monospace: 'true' }}>1 in 16 chance</div>
                            </div>
                            <p>
                                If you break a sack, you lose the gold you put in it.
                                But don't worry! You can always buy a new sack to keep your gold. If you have enough gold, that is.
                            </p>
                            <p>
                                If you're escaping the fortress with <img style={{ height: '1.5rem' }} src={Coins} alt={"stuff"} /> loot, you'll need to find the <img style={{ height: '1.5rem' }} src={Key} alt={props.type} /> <b>key</b>.
                                You'll be presented with a <b>trivia question</b>. If you answer correctly, you keep your <img style={{ height: '1.5rem' }} src={Coins} alt={"stuff"} /> money.
                                If you don't, you'll have to pay a <img style={{ height: '1.5rem' }} src={Coins} alt={"stuff"} /> bribe to get out of the fortress (half your <img style={{ height: '1.5rem' }} src={Coins} alt={"stuff"} /> loot, rounded up).
                            </p>
                            <p>
                                <b>Good luck!</b>
                            </p>
                        </div>

                        <Button onClick={() => props.onClose()}>I got it</Button>
                    </div>
                </div>
            )
            : null)
}

InstructionModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
}

export default InstructionModal