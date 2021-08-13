import React from 'react';
import { Container, Card, Row } from 'react-bootstrap';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Redirect } from 'react-router-dom';
import api, { ApiResponse, getIdentity } from '../../api/api';

interface AdministratorDashboardState {
    isAdministratorLoggedIn: boolean;
}

class AdministratorDashboard extends React.Component {
    state: AdministratorDashboardState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            isAdministratorLoggedIn: true,
        };
    }

    componentDidMount() {
       this.getMyData()
    }

    componentDidUpdate() {
        this.getMyData()
    }

    private getMyData() {
        const username = getIdentity('administrator');
        api('api/administrator/' + username, 'get', {}, 'administrator')
        .then((res: ApiResponse) => {
            if (res.status === "error" || res.status === "login") {
                this.setLogginState(false);
                return;
            }
        });
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }

    render() {
        if (this.state.isAdministratorLoggedIn === false) {
            return (
                <Redirect to="/administrator/login" />
            );
        }

        return (
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faHome } /> Administrator dashboard
                        </Card.Title>

                        <Row>
                            ...
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}

export default AdministratorDashboard;