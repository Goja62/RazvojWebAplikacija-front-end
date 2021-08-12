import { faCartArrowDown, faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Button, Form, Modal, Nav, Table } from "react-bootstrap";
import api, { ApiResponse } from "../../api/api";
import CartType from "../../types/CartType";

interface CartState {
    count: number;
    cart?: CartType;
    visible: boolean;
    message: string;
    cartMenuColor: string
}

export default class Cart extends React.Component {
    state: CartState;

    constructor(props: {} | Readonly<{}>) {
        super(props)

        this.state = {
            count: 0, 
            visible: false,
            message: '',
            cartMenuColor: '#000000',
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

    private setStateMessage(newMessage: string) {
        this.setState(Object.assign(this.state, { message: newMessage }));
    }

    private setStateMenuColor(newMenuColor: string) {
        this.setState(Object.assign(this.state, { cartMenuColor: newMenuColor }));
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

            this.setStateMenuColor('#FF0000')
            setTimeout(() => this.setStateMenuColor('#000000'), 3000)
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


    private sendCartUpdate(data: any) {
        api('/api/user/cart/', 'patch', data)
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
                this.setStateCount(0);
                this.setStateCart(undefined);
                return;
            }

            this.setStateCart(res.data);
            this.setStateCount(res.data.cartArticles.length);
        });
    }


    private updateQuantity(event: React.ChangeEvent<HTMLInputElement>) {
        const articleId = event.target.dataset.articleId;
        const newQuantity = event.target.value;

        this.sendCartUpdate ({
            articleId: Number(articleId),
            quantity: Number(newQuantity),
        });
    }

    private removeFromCart(articleId: number) {
        this.sendCartUpdate({
            articleId: Number(articleId),
            quantity: 0,
        });
    }

    private makeOrder() {
        api('/api/user/cart/makeOrder/', 'post', {})
        .then((res: ApiResponse) => {
            if (res.status === 'error' || res.status === 'login') {
                this.setStateCount(0);
                this.setStateCart(undefined);
                return;
            }

            this.setStateCount(0);
            this.setStateCart(undefined);

            this.setStateMessage('Your order hes been made!')
        })
    }

    private hideCart() {
        this.setStateMessage('')
        this.setStateVisible(false)
    }

    render() {
        const sum = this.calculateSum()
        console.log(this.state.cart?.createdAt)
        return (
            <>
                <Nav.Item>
                    <Nav.Link active = { false } onClick = { () => this.setStateVisible(true) }
                       style = { { color: this.state.cartMenuColor } }>
                        <FontAwesomeIcon icon = { faCartArrowDown }></FontAwesomeIcon>({ this.state.count })
                    </Nav.Link>
                </Nav.Item>

                <Modal size = "lg" centered show = { this.state.visible } onHide = { () => this.hideCart() }>
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
                                               <td className = "text-end">
                                                   <Form.Control type = "number" 
                                                                 step = "1"
                                                                 value =   { item.quantity }
                                                                 data-article-id = { item.article.articleId }
                                                                 onChange = { (e) => this.updateQuantity(e as any) }>
                                                   </Form.Control>
                                                 </td>
                                               <td className = "text-end">{ price } EUR</td>
                                               <td className = "text-end">{ total } </td>
                                               <td>
                                                <FontAwesomeIcon
                                                   icon={ faMinusSquare }
                                                   onClick={ () => this.removeFromCart(item.article.articleId) } />
                                                </td>
                                           </tr>
                                       ) 
                                    }, this) } 
                                </tbody>
                                <tfoot>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>Total: </td>
                                    <td className="text-end"><strong>{ Number(sum).toFixed(2) }</strong> EUR</td>
                                    <td></td>
                                </tfoot>
                            </Table>

                            <Alert variant = "success" className = { this.state.message ? '' : "d-none" }>{ this.state.message }</Alert>
                        
                        </Modal.Body>
                        <Modal.Footer>
                            <Button 
                                variant = "primary"
                                onClick = { () => this.makeOrder() } disabled = { this.state.cart?.cartArticles.length === 0 }>
                                    
                                    Make an order
                            </Button>
                        </Modal.Footer>
                </Modal>
            </>
        )
    }

}