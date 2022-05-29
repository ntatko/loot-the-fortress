import React from "react"
import PropTypes from 'prop-types'
import Button from "../core/Button"

const LoserModal = (props) => {

    return (
        props.show
            ? (
                <div onClick={() => props.onClose()} style={{ zIndex: 2, position: 'absolute', width: '100%', height: '100%', backgroundColor: '#464646b0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '40rem', height: '30rem', backgroundColor: '#ffffff', padding: '2rem', borderRadius: '2rem', overflow: 'scroll' }}>
                        <div style={{ fontSize: '3rem', fontFamily: 'Syne Mono', monospace: 'true' }}>You Lost</div>

                        <div style={{ fontSize: '1.2rem', fontFamily: 'Syne Mono', monospace: 'true' }}>
                            <p>
                                Thieving isn't for everyone. Better luck next time!
                            </p>
                        </div>

                        <Button onClick={() => {
                            localStorage.setItem('inventoryItems', null)
                            window.history.back()
                            props.onClose()
                        }}>Start Over</Button>
                    </div>
                </div>
            )
            : null)
}

LoserModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default LoserModal