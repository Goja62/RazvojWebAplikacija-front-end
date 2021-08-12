import { faCartArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Modal, Nav, Table } from "react-bootstrap";
import api, { ApiResponse } from "../../api/api";
import CartType from "../../types/CartType";

interface CartState {
    count: number;
    cart?: CartType;
    visible: boolean;
}

export default class Cart extends React.Component {
    state: CartState;

    constructor(props: {} | Readonly<{}>) {
        super(props)

        this.state = {
            count: 0, 
            visible: false,
        };
    }

    componentDidMount() {
        this.updateCart();
        window.addEventListener("cart.update", () => this.updateCart());
    }

    componentWillUnmount() {
        window.removeEventListener("cart.update", () => this.updateCart());
    }

    private setStateCount(newCount: number) {
        this.setState(Object.assign(this.state, { count: newCount }));
    }

    private setStateCart(newCart?: CartType) {
        this.setState(Object.assign(this.state, { cart: newCart }));
    }

    private setStateVisible(newState: boolean) {
        this.setState(Object.assign(this.state, { visible: newState }));
    }

    private updateCart() {
        api('/api/user/cart/', 'get', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
                this.setStateCount(0);
                this.setStateCart(undefined);
                return;
            }

            this.setStateCart(res.data);
            this.setStateCount(res.data.cartArticles.length);
        })
    }

    private calculateSum():number {
        let sum: number = 0;
        
        if (this.state.cart === undefined) {
            return sum;
        } else {
        for (const item of this.state.cart?.cartArticles) {
            sum += item.article.articlePrices[item.article.articlePrices.length - 1].price * item.quantity;
        }
    }
        return sum;

    }

    render() {
        const sum = this.calculateSum()
        console.log(this.state.cart?.createdAt)
        return (
            <>
                <Nav.Item>
                    <Nav.Link active = { false } onClick = { () => this.setStateVisible(true) }>
                        <FontAwesomeIcon icon = { faCartArrowDown }></FontAwesomeIcon>({ this.state.count })
                    </Nav.Link>
                </Nav.Item>

                <Modal size = "lg" centered show = { this.state.visible } onHide = { () => this.setStateVisible(false) }>
                    <Modal.Header closeButton>
                        <Modal.Title>Your shopping cart</Modal.Title>
                    </Modal.Header>
                        <Modal.Body>
                            <Table hover size = "sm"> 
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th>Article</th>
                                        <th className = "text-end">Quantity</th>
                                        <th className = "text-end">Price</th>
                                        <th className = "text-end">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                     { this.state.cart?.cartArticles.map(item => {
                                        const price = Number(item.article.articlePrices[item.article.articlePrices.length-1].price).toFixed(2);
                                        const total = Number(item.article.articlePrices[item.article.articlePrices.length-1].price * item.quantity).toFixed(2);
                                       return (
                                           <tr>
                                               <td>{ item.article.category.name }</td>
                                               <td>{ item.article.name }</td>
                                               <td className = "text-end">{ item.quantity }</td>
                                               <td className = "text-end">{ price } EUR</td>
                                               <td className = "text-end">{ total } </td>
                                           </tr>
                                       ) 
                                    }, this) } 
                                </tbody>
                                <tfoot>
                                    <td>Total: </td>
                                    <td className="text-end">{ Number(sum).toFixed(2) } EUR</td>
                                    <td>...</td>
                                    <td>...</td>
                                    <td>...</td>
                                    <td>...</td>
                                </tfoot>
                            </Table>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant = "primaru">
                                Make an order
                            </Button>
                        </Modal.Footer>
                </Modal>
            </>
        )
    }

}