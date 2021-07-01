import React,{useState} from 'react';
import {Navbar, Container, Tabs, Tab} from 'react-bootstrap'
import Matches from '../../components/matches/matches'
const Layout = () => {
    const [key, setKey] = useState('new-match');
    return (
        <div>
            <Navbar bg="dark" variant="dark"  >
                <Container>
                    <Navbar.Brand>Cricket Info</Navbar.Brand>
                </Container>
            </Navbar>
            <Container className="page-wrap">
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="match-switcher"
            >
                <Tab eventKey="new-match" title="New Matches">
                    {key === 'new-match' && <Matches id={key}/>}
                </Tab>
                <Tab eventKey="old-match" title="Old Matches">
                    {key === 'old-match' && <Matches id={key}/>}
                </Tab>
            </Tabs>
            </Container>
        </div>
    )
}
export default Layout