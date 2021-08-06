import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Container } from "react-bootstrap";

export class UserLoginPage extends React.Component {
    render() {
        return(
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                        <FontAwesomeIcon icon = { faSignInAlt }></FontAwesomeIcon> User
                        </Card.Title>
                        <Card.Text>
                            Podaci o useru
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}