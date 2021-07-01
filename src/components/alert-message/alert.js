import React from 'react';
import {Alert} from 'react-bootstrap'

const AlertMsg = (props) => {
    return (
        <>
            <Alert variant={props.variant}>
                {props.message}
            </Alert>
        </>
    )
}
export default AlertMsg