import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery.js'
import 'popper.js/dist/popper.js'
import 'bootstrap/dist/js/bootstrap.min.js'
import { Container, Card, Row, Col } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { Link, Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import CategoryType from '../../types/CategoryType';

interface HomePageState {
    isUserLoggedIn: boolean;
    categories: CategoryType[];
}

interface ApiCategoryDto {
    categoryId: number;
    name: string;
}

class HomePage extends React.Component {
    state: HomePageState;

    constructor(props: {} | Readonly<{}>) {
        super(props)

        this.state = {
            isUserLoggedIn: true,
            categories: [],
        };
    }

    componentDidMount() {
        this.getCategoties()
    }

    componentDidUpdate() {
        this.getCategoties()
    }



    private getCategoties() {
        api('api/category?filter=parentCategoryId||$isnull ', 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
                this.setLogginState(false);
                return;
            }

            this.putCategoriesInState(res.data);
        });
    }

    private putCategoriesInState(data: ApiCategoryDto[]) {
        const categories: CategoryType[] = data.map(category => {
            return {
                categoryId: category.categoryId,
                name: category.name,
                items: [],
            };
        });

        const newState = Object.assign(this.state, {
            categories: categories,
        })

        this.setState(newState);
    }

    private setLogginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn,
        });

        this.setState(newState);
    }
    
    render() {
        if (this.state.isUserLoggedIn === false) {
            return(
                <Redirect to = "/user/login"></Redirect>
            );
        }
        return (
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon = { faListAlt }></FontAwesomeIcon> Top level categories
                        </Card.Title>
                    </Card.Body> 
                    <Row>
                        { this.state.categories?.map(this.singleCategory) }
                    </Row>
                </Card>
            </Container>
        );
    }

    private singleCategory(category: CategoryType) {
        return (
            <Col lg = "3" md = "4" sm = "6" xs = "12">
                <Card className="mb-3">
                    <Card.Body>
                        <Card.Title as = "p">
                            { category.name }
                        </Card.Title>
                        <Link to = { `/category/${ category.categoryId }`} className =  "btn btn-primary w-100 btn-sm">Open category</Link>
                    </Card.Body>
                </Card>
            </Col>
        );
    }
}

export default HomePage;
