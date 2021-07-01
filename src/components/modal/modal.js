import React,{useState, useEffect} from 'react';
import {Modal, Button, Accordion, Card, Badge, Spinner, Image} from 'react-bootstrap'
import Alert from '../alert-message/alert'
import axios from 'axios'
import {APIKEY} from '../../apiKey'

const Popup = (props) => {

    const [matchSummary, setMatchSummary] = useState('')
    const [playerSummary, setPlayerSummary] = useState('')
    const [errorInLoading, setErrorInLoading] = useState(false)
    const [playerId, setPlayerId] = useState(null)

    useEffect(()=>{
        setErrorInLoading(false)
        if(props.show === true && !matchSummary?.data){
            axios.get(`https://cricapi.com/api/fantasySummary?apikey=${APIKEY}&unique_id=${props.id}`)  //1034809
            .then((response)=>{
                console.log("match summary response from api => ",response.data)
                setMatchSummary(response.data)   
            }).catch((err)=>{console.log(err)
                setErrorInLoading(true)})
        }
    },[props.id])

    useEffect(()=>{
        setErrorInLoading(false)
        if(props.show === true && playerId !== null){
            axios.get(`https://cricapi.com/api/playerStats?apikey=${APIKEY}&pid=${playerId}`)  //1034809
            .then((response)=>{
                console.log("player summary response from api => ",response.data)
                setPlayerSummary(response.data)   
            }).catch((err)=>{console.log(err)
                setErrorInLoading(true)})
        }
    },[playerId])


    const scoreData = (data) =>{
        let result = data.map((item)=>{
            return (
                <>
                <div className="result-wrap">
                    <h6>{item.batsman}</h6>(<span>{item['dismissal-info']}</span>)
                    <div>
                        4s <Badge variant="primary">{item['4s']}</Badge>{' '}
                        6s <Badge variant="secondary">{item['6s']}</Badge>{' '}
                        B <Badge variant="success">{item['B']}</Badge>{' '}
                        R <Badge variant="danger">{item['R']}</Badge>{' '}
                        SR <Badge variant="warning">{item['SR']}</Badge>
                    </div>
                </div>
                </>
            )
        })
        return result
    }

    const bowlingDetails = (data) =>{
        let result = data.map((item)=>{
            return (
                <>
                <div className="result-wrap">
                    <h6>{item.bowler}</h6>
                    <div>
                        W <Badge variant="primary">{item['W']}</Badge>{' '}
                        R <Badge variant="secondary">{item['R']}</Badge>{' '}
                        O <Badge variant="success">{item['O']}</Badge>{' '}
                        M <Badge variant="danger">{item['M']}</Badge>{' '}
                        Econ <Badge variant="warning">{item['Econ']}</Badge>
                    </div>
                </div>
                </>
            )
        })
        return result
    }

    const fieldingDetails = (data) =>{
        let result = data.map((item)=>{
            return (
                <>
                <div className="result-wrap">
                    <h6>{item.name}</h6>
                    <div>
                    Bowled <Badge variant="primary">{item['bowled']}</Badge>{' '}
                    Catch <Badge variant="secondary">{item['catch']}</Badge>{' '}
                    Lbw <Badge variant="success">{item['lbw']}</Badge>{' '}
                    </div>
                </div>
                </>
            )
        })
        return result
    }


    const squadDetails = (data) =>{
        let result = data.map((item)=>{
            return (
                <div>
                    <h6><span id={item.pid} className='card-link player-summary-link' onClick={(e)=>showPlayerDetails(e)}>{item.name}</span></h6>
                </div>
            )
        })
        return result
    }

    const playerBatting = (data) => {
        let result = Object.keys(data).map((key)=>{
            return (
                <>
                    {key} <Badge variant="primary">{data[key] === '' ? 'N/A' : data[key]}</Badge>{' '}
                </>
            )
        })
        return result
    }

    const showPlayerDetails = (e) =>{
        setPlayerId(e.target.id)
    }

    const clearPlayerData = () => {
        setPlayerId(null)
        setPlayerSummary('')
    }

    return (
        <>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {playerId === null ? 'Match Summary' : 'Player summary'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {playerId === null ? (
                // match summary data
                <>
                    {matchSummary === '' && <div className="center-item"><Spinner variant="primary" animation="border"/></div>}
                    {errorInLoading === true && 
                        <Alert variant='danger' message='Something Went Wrong! Try later.' />
                    }
                    {matchSummary?.data && 
                        <>  
                            <section className="match-short-summary">
                                <div><span>Winner</span> : {matchSummary?.data['winner_team'] ? matchSummary?.data['winner_team'] : 'N/A'}</div>
                                <div><span>Man of the match</span> : {matchSummary?.data['man-of-the-match']?.name ? matchSummary?.data['man-of-the-match']?.name : matchSummary?.data['man-of-the-match']}</div>
                                <div><span>Toss won</span> : {matchSummary?.data['toss_winner_team']}</div>
                            </section>
                            <Accordion>
                                <Card>
                                    <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="3">
                                        Squad
                                    </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="3">
                                    <Card.Body>
                                        {matchSummary?.data?.team.length === 0 && <Alert variant="warning" message="no data available" />} 
                                        {matchSummary?.data?.team.length > 0 && matchSummary?.data?.team.map((item,index)=>{
                                            return(
                                                <Accordion defaultActiveKey="team-0">
                                                    <Card.Header>
                                                        <Accordion.Toggle as={Button} variant="link" eventKey={`team-${index}`}>
                                                            {item.name}
                                                        </Accordion.Toggle>
                                                    </Card.Header>
                                                    <Accordion.Collapse eventKey={`team-${index}`}>
                                                        <Card.Body>
                                                            {item.players.length > 0 ? squadDetails(item.players):<Alert variant="warning" message="no data available" />}
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Accordion>
                                            )
                                        })}
                                    </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                        Batting
                                    </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                    <Card.Body>
                                        {matchSummary?.data?.batting.length === 0 && <Alert variant="warning" message="no data available" />} 
                                        {matchSummary?.data?.batting.length > 0 && matchSummary?.data?.batting.map((item,index)=>{
                                            return(
                                                <Accordion defaultActiveKey="bat-0">
                                                    <Card.Header>
                                                        <Accordion.Toggle as={Button} variant="link" eventKey={`bat-${index}`}>
                                                            {item.title}
                                                        </Accordion.Toggle>
                                                    </Card.Header>
                                                    <Accordion.Collapse eventKey={`bat-${index}`}>
                                                        <Card.Body>
                                                            {scoreData(item.scores)}
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Accordion>
                                            )
                                        })}
                                    </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                        Bowling
                                    </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="1">
                                    <Card.Body>
                                        {matchSummary?.data?.bowling.length === 0 && <Alert variant="warning" message="no data available" />}    
                                        {matchSummary?.data?.bowling.length > 0 && matchSummary?.data?.bowling.map((item,index)=>{
                                            return(
                                                <Accordion defaultActiveKey="bowl-0">
                                                    <Card.Header>
                                                        <Accordion.Toggle as={Button} variant="link" eventKey={`bowl-${index}`}>
                                                            {item.title}
                                                        </Accordion.Toggle>
                                                    </Card.Header>
                                                    <Accordion.Collapse eventKey={`bowl-${index}`}>
                                                        <Card.Body>
                                                            {bowlingDetails(item.scores)}
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Accordion>
                                            )
                                        })}
                                    </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                        Fielding
                                    </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="2">
                                    <Card.Body> 
                                        {matchSummary?.data?.fielding.length === 0 && <Alert variant="warning" message="no data available" />}
                                        {matchSummary?.data?.fielding.length > 0 && matchSummary?.data?.fielding.map((item,index)=>{
                                            return(
                                                <Accordion defaultActiveKey="field-0">
                                                    <Card.Header>
                                                        <Accordion.Toggle as={Button} variant="link" eventKey={`field-${index}`}>
                                                            {item.title}
                                                        </Accordion.Toggle>
                                                    </Card.Header>
                                                    <Accordion.Collapse eventKey={`field-${index}`}>
                                                        <Card.Body>
                                                            {item.scores.length === 0 ? <Alert variant="warning" message="no data available" /> : fieldingDetails(item.scores)}
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Accordion>
                                            )
                                        })}
                                    </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </>
                    }
                </>
            ):(
                // player summary data
                <>
                    {playerSummary === '' && <div className="center-item"><Spinner variant="primary" animation="border"/></div>}
                    {playerSummary.hasOwnProperty('error') && 
                        <Alert variant='danger' message='Something Went Wrong! Try later.' />
                    }
                    {playerSummary !== '' && playerSummary.hasOwnProperty('error') === false && (
                        <>
                            <div>
                                {/* <img src='https://www.cricapi.com/playerpic/472977.jpg' /> */}
                                <div className="player-description">
                                    <div className="image-wrap">
                                        <Image src={playerSummary.imageURL} roundedCircle />
                                    </div>
                                    <div className="description-wrap">
                                        <div>
                                            <span className="bold-text">Name: </span> <span>{playerSummary.name}</span>
                                        </div>
                                        <div>
                                            <span className="bold-text">Full Name: </span> <span>{playerSummary.fullName}</span>
                                        </div>
                                        <div>
                                            <span className="bold-text">Country: </span> <span>{playerSummary.country}</span>
                                        </div>
                                        <div>
                                            <span className="bold-text">Batting Style: </span><span>{playerSummary.battingStyle}</span>
                                        </div>
                                        <div>
                                            <span className="bold-text">Bowling Style: </span> <span>{playerSummary.bowlingStyle}</span>
                                        </div>
                                        <div>
                                            <span className="bold-text">Major Teams: </span> <span>{playerSummary.majorTeams}</span>
                                        </div>
                                        <div>
                                            <span className="bold-text">Age: </span> <span>{playerSummary.currentAge}</span>
                                        </div>
                                        <div>
                                            <span className="bold-text">Born: </span> <span>{playerSummary.born}</span>
                                        </div>
                                    </div>
                                </div>

                                <Accordion>
                                    <Card>
                                        <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="5">
                                            Batting
                                        </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey="5">
                                        <Card.Body>
                                            {Object.keys(playerSummary?.data.batting).length === 0 && <Alert variant="warning" message="no data available" />} 
                                            {Object.keys(playerSummary?.data.batting).length > 0 && Object.keys(playerSummary?.data.batting).map((key,index)=>{
                                                return(
                                                    <Accordion defaultActiveKey="player-bat-0">
                                                        <Card.Header>
                                                            <Accordion.Toggle as={Button} variant="link" eventKey={`player-bat-${index}`}>
                                                                {key}
                                                            </Accordion.Toggle>
                                                        </Card.Header>
                                                        <Accordion.Collapse eventKey={`player-bat-${index}`}>
                                                            <Card.Body>
                                                                {Object.keys(playerSummary?.data.batting[key]).length > 0 ? playerBatting(playerSummary?.data.batting[key]):<Alert variant="warning" message="no data available" />}
                                                            </Card.Body>
                                                        </Accordion.Collapse>
                                                    </Accordion>
                                                )
                                            })}
                                        </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                    <Card>
                                        <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="6">
                                            Bowling
                                        </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey="6">
                                        <Card.Body>
                                            {Object.keys(playerSummary?.data.bowling).length === 0 && <Alert variant="warning" message="no data available" />} 
                                            {Object.keys(playerSummary?.data.bowling).length > 0 && Object.keys(playerSummary?.data.bowling).map((key,index)=>{
                                                return(
                                                    <Accordion defaultActiveKey="player-bowl-0">
                                                        <Card.Header>
                                                            <Accordion.Toggle as={Button} variant="link" eventKey={`player-bowl-${index}`}>
                                                                {key}
                                                            </Accordion.Toggle>
                                                        </Card.Header>
                                                        <Accordion.Collapse eventKey={`player-bowl-${index}`}>
                                                            <Card.Body>
                                                                {Object.keys(playerSummary?.data.bowling[key]).length > 0 ? playerBatting(playerSummary?.data.bowling[key]):<Alert variant="warning" message="no data available" />}
                                                            </Card.Body>
                                                        </Accordion.Collapse>
                                                    </Accordion>
                                                )
                                            })}
                                        </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>

                                </Accordion>
                            </div>
                        </>
                    )}
                </>
            )}
            </Modal.Body>
            <Modal.Footer>
                {playerId !== null && <Button onClick={()=>clearPlayerData()}>Back</Button>}
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
            </Modal>
        </>
    )
}
export default Popup