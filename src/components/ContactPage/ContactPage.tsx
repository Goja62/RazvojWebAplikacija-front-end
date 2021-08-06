import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Container } from "react-bootstrap";

export class ContactPage extends React.Component {
    render() {
        return(
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                        <FontAwesomeIcon icon = { faPhone }></FontAwesomeIcon> Contact page
                        </Card.Title>
                        <Card.Text>
                            Podaci o kontaktu
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}