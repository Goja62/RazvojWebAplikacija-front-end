import React from 'react';
import { Container, Card } from 'react-bootstrap';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, Redirect } from 'react-router-dom';
import api, { ApiResponse, getIdentity } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

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
            <RoledMainMenu role = 'administrator'></RoledMainMenu>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={ faHome } /> Administrator dashboard
                        </Card.Title>

                        <ul>
                            <li><Link to = "/administrator/dashboard/category/">Categories</Link></li>
                            <li><Link to = "/administrator/dashboard/article/">Articles</Link></li>
                            <li><Link to = "/administrator/dashboard/order/">Orders</Link></li>
                        </ul>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}

export default AdministratorDashboard;