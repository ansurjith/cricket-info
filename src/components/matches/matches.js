import React,{useState, useEffect, useRef} from 'react';
import {Spinner, Card} from 'react-bootstrap'
import { connect } from 'react-redux'
import * as actions from './actions'
import Modal from '../modal/modal'

const Matches = (props) => {
    
    const [spinner, setSpinner] = useState(true)
    const [matchDetailsPopup, setMatchDetailsPopup] = useState(false)

    let tempId = useRef(null)

    useEffect(()=>{
        if((props.id === 'new-match' && props.newMatches.length === 0) ||  (props.id === 'old-match' && props.oldMatches.length === 0)){
            setSpinner(true)
        }else{
            setSpinner(false)
        }
    },[props.newMatches, props.oldMatches])

    useEffect(()=>{
        props.id === 'new-match' ? props.getMatches('matches', 'NEWMATCHES') : props.getMatches('cricket', 'OLDMATCHES')
    },[props.id])

    const toDate = (data) =>{
        let d = new Date(data)
        let result = `${d.toLocaleString('default',{month:'short'})} ${d.getDate()}, ${d.getYear() + 1900}`
        return result
    }

    const handlePopup = (status, e) => {
        if(status === true){
            setMatchDetailsPopup(true)
            tempId.current = e.target.id
        }else{
            setMatchDetailsPopup(false)
            tempId.current = null
        }
    }

    return (
        <>
            {spinner === true && <div className="center-item"><Spinner variant="primary" animation="border"/></div>}
            <main className="main-content">  
            {props.id === 'new-match' && spinner === false && props.newMatches.hasOwnProperty('error') ==false && props.newMatches.matches.map((item)=>{
                
                return (
                    <Card style={{ width: '18rem' }} className="match-info">
                        <Card.Body > 
                            <Card.Title>{item['team-1']} vs {item['team-2']}</Card.Title>
                                <>
                                    <Card.Subtitle className="mb-2 text-muted">{toDate(item.date)}</Card.Subtitle>
                                    <div className="card-text">
                                        <div className="match-status">
                                            <span>Match Status:</span><span>{item.matchStarted === true ? "Started" : "Finished"}</span>
                                        </div>
                                        <div>
                                            Toss won: {item?.toss_winner_team ? item?.toss_winner_team : "N/A"}
                                        </div>
                                    </div>
                                    <Card.Link id={item.unique_id} onClick={(e)=>handlePopup(true,e)}>Details</Card.Link>
                                </>
                        </Card.Body>
                    </Card>
                ) 
            })}

            {props.id === 'old-match' && spinner === false && props.oldMatches.hasOwnProperty('error') ==false && props.oldMatches.data.map((item)=>{
                return (
                    <Card style={{ width: '18rem' }} className="match-info">
                        <Card.Body> 
                            <Card.Title id={item.unique_id}>{item.title}</Card.Title>
                            {/* <Card.Link id={item.unique_id} onClick={(e)=>handlePopup(true,e)}>Details</Card.Link> */}
                        </Card.Body>
                    </Card>
                ) 
            })}
            {matchDetailsPopup === true && 
            <Modal
                show={matchDetailsPopup}
                id={tempId.current}
                onHide={() => setMatchDetailsPopup(false)}
            />}
            
        </main>
        </>
    )
}

const mapStateToProps = (state) =>{
    return {
      newMatches:state.matches.newMatches,
      oldMatches:state.matches.oldMatches
    }
  }

export default connect(mapStateToProps, actions)(Matches);