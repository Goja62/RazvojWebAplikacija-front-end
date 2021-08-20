import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import api, { ApiResponse } from "../../api/api";
import { ArticleType } from "../../types/ArticleType";

interface AddToCartInputProperties {
    article: ArticleType,
}

interface AddToCartInputState {
    quantity: number
}

export default class AddToCartInput extends React.Component<AddToCartInputProperties> {
    state: AddToCartInputState;

    constructor(props: AddToCartInputProperties | Readonly<AddToCartInputProperties>) {
        super(props) 

        this.state = {
            quantity: 1,
        }
    }

    private quantityChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            quantity: Number(event.target.value),
        });
    }

    private AddToCart() {
        const data = {
            articleId: this.props.article.articleId,
            quantity: this.state.quantity,
        }

        api('/api/user/cart/addToCart/', 'post', data) 
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
                return;
            }
            window.dispatchEvent(new CustomEvent("cart.update"));
        });
    }

    render() {
        return (
            <Form.Group className="mb-3">
                <Row>
                    <Col xs = "7">
                        <Form.Control 
                            type = "number" 
                            min = "1" 
                            step = "1" 
                            value = { this.state.quantity } 
                            onChange = { (e) => this.quantityChanged(e as any) }>
                        </Form.Control>
                    </Col>
                    <Col xs = "5">
                        <Button 
                            variant = "secondary" 
                            className = "w-100" 
                            onClick = { () => this.AddToCart()}> Buy
                        </Button>                                    
                    </Col>
                </Row>
            </Form.Group>
        );
    }
}