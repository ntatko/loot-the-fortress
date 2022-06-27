import React from "react"
import PropTypes from 'prop-types'

const InventoryItem = (props) => {

    return (
        <div style={{display: 'flex', width: '100%', justifyContent: 'space-evenly', alignItems: 'center', paddingLeft: '1rem', paddingRight: 'rem'}}>
            <img style={{height: '3rem'}} src={props.image} alt={props.type} />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', width: '10rem' }}>
                <div style={{fontSize: '2rem', fontFamily: 'Syne Mono', monospace: 'true'}}>{props.count}</div>
                <div style={{fontSize: '1rem', fontFamily: 'Syne Mono', monospace: 'true'}}>{props.type}</div>
            </div>
        </div>
    )
}

InventoryItem.propTypes = {
    count: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
}


export default InventoryItem