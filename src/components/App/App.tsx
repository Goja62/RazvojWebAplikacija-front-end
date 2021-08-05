import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery.js'
import 'popper.js/dist/popper.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import './App.css';
import { Container, Card } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons';

function App() {

  return (
    
    <Container>
      <Card bg = 'secondary' text = 'white'>
      	<Card.Header>
    		<FontAwesomeIcon icon = { faHome }></FontAwesomeIcon> Početna strana
       	</Card.Header> 
        <Card.Body>
          <Card.Text>
            Sadržaj
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default App;
