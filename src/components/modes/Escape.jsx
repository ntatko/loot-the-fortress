import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getTriviaQuestion } from '../../assets/fortressTrivia'
import TriviaAnswerButton from '../core/TriviaAnswerButton'
import Key from '../../assets/key.svg'
import Gold from '../../assets/gold_coins.svg'
import Button from '../core/Button'
import Background from '../../assets/escape-background.png'
import { BURLAP_SACK, GOLD } from '../common/Inventory'

const Escape = () => {
    const location = useLocation()
    const [question, setQuestion] = useState(getTriviaQuestion())
    const [correctCount, setCorrectCount] = useState(0)
    const [incorrectCount, setIncorrectCount] = useState(0)
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

    const renderQuestion = () => {
        return (
            <div>
                <div style={{ fontSize: '2rem', fontFamily: 'Syne Mono', monospace: 'true' }}>{question.question}</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <TriviaAnswerButton onClick={() => {
                        setCorrectCount(correctCount + 1)
                        setQuestion(getTriviaQuestion())
                    }}>
                        <div style={{ display: 'flex' }}>
                                <img src={Key} alt={"Key"} style={{ height: '1.5rem', padding: '0.25rem'}} />
                            <div>{question.correct}</div>
                        </div>
                    </TriviaAnswerButton>
                    {question.incorrect.map(answer => (
                        <TriviaAnswerButton onClick={() => {
                            setIncorrectCount(incorrectCount + 1)
                            setQuestion(getTriviaQuestion())
                        }}>
                            <div style={{ display: 'flex' }}>
                                <img src={Key} alt={"Key"} style={{ height: '1.5rem', padding: '0.25rem'}} />
                                <div>{answer}</div>
                            </div>
                        </TriviaAnswerButton>
                    ))}
                </div>
            </div>
        )
    }


    return (
        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '100%', backgroundImage: `url(${Background})`, overflow: 'scroll', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
            <div style={{ padding: '1rem', backgroundColor: '#ffffff7e', borderRadius: '2rem', width: '35rem', maxWidth: '100%', maxHeight: '100%', overflow: 'scroll' }}>
                <div style={{ fontSize: '3rem', fontFamily: 'Syne Mono', monospace: 'true' }}>Escape with <img style={{ height: '2.25rem' }} src={Gold} alt={"stuff"} /> {location.state?.amount || 0}</div>

                {renderQuestion()}
            </div>

            {correctCount >= 1 && <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#333333a3', zIndex: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                <div style={{ padding: '2rem', backgroundColor: '#ffffff', borderRadius: '2rem'}}>
                    <div style={{ fontSize: '2rem', fontFamily: 'Syne Mono', monospace: 'true' }}>You escaped!</div>
                    <div style={{ fontSize: '1.5rem', fontFamily: 'Syne Mono', monospace: 'true' }}>Put your <img src={Gold} style={{height: '1.5rem'}} />{location.state?.amount || 0} in the bank.</div>
                    <Link to="/">
                        <Button onClick={() => {
                            updateInventory(GOLD, location.state?.amount || 0)
                        }}>
                            Go Home
                        </Button>
                    </Link>
                </div>
            </div>}

            {incorrectCount >= 1 && <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#333333a3', zIndex: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                <div style={{ padding: '2rem', backgroundColor: '#ffffff', borderRadius: '2rem', width: '30rem', maxWidth: '100%'}}>
                    <div style={{ fontSize: '2rem', fontFamily: 'Syne Mono', monospace: 'true' }}>Uh oh!</div>
                    <div style={{ fontSize: '1.5rem', fontFamily: 'Syne Mono', monospace: 'true' }}>You got caught. Better cough up <img src={Gold} style={{height: '1.5rem'}} /> your new "associate's" cut (<img src={Gold} style={{height: '1.5rem'}} /> {location.state?.amount ? Math.floor(location.state?.amount/2) : 0}).</div>
                    <Link to="/">
                        <Button onClick={() => {
                            updateInventory(GOLD, Math.floor(location.state?.amount/2) || 0)
                        }}>
                            Pay them off
                        </Button>
                    </Link>
                </div>
            </div>}
        </div>
    )

}

export default Escape