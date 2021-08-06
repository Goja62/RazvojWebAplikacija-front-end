import { faListAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Container } from "react-bootstrap";
import CategoryType from "../../types/categoryType";

interface CategoryPageProporties {
    match: {
        params: {
            cId: number,
        }
    }
}

interface CategoryPageState {
    category?: CategoryType;
} 

export class CategoryPage extends React.Component<CategoryPageProporties> {
    state: CategoryPageState;

    constructor(props: CategoryPageProporties | Readonly<CategoryPageProporties>) {
        super(props);

        this.state = {};
    }

    render() {
        return(
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon = { faListAlt }></FontAwesomeIcon> { this.state.category?.name}
                        </Card.Title>
                        <Card.Text>
                            Podaci o kategoriji
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        )
    }
    
    componentDidMount() {
        this.getCategoryData()
    }

    componentDidUpdate(data: CategoryPageProporties) {
        if (data.match.params.cId === this.props.match.params.cId) {
            return;
        }
        this.getCategoryData()
    }

    getCategoryData() {
        setTimeout(() => {
            const data: CategoryType = {
                name: 'Category' + this.props.match.params.cId,
                categoryId: this.props.match.params.cId,
                items: [],
            }
            this.setState({
                category: data,
            })
        }, 750);
    }

}