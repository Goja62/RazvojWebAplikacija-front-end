import React from "react";
import { Nav } from "react-bootstrap";
import { HashRouter, Link } from "react-router-dom";
import Cart from "../Cart/Cart";

export class MainMenuItem {
	text: string = '';
	link: string = '#';

	constructor(text: string, link: string) {
		this.text = text;
		this.link = link;
	}
}

interface MainManuProporties {
	items: MainMenuItem[];
	showCart?: boolean;
}

interface mainManuState {
	items: MainMenuItem[];
}

export class MainMenu extends React.Component<MainManuProporties> {
	state: mainManuState
	constructor(props: MainManuProporties | Readonly<MainManuProporties>) {
		super(props);

		this.state = {
			items: props.items,
		}
	}

	setItems(items: MainMenuItem[]) {
		this.setState({
			items: items,
		})
	}

	render() {
		return(
			<Nav variant = "tabs">
				<HashRouter>
					{ this.state.items.map(this.makeNavLink) }
					{ this.props.showCart ? <Cart></Cart> : '' }
				</HashRouter>
			</Nav>
		);
	}

	private makeNavLink(item: MainMenuItem) {
		return(
			<Link to = { item.link } className = 'nav-link'>{ item.text }</Link>
		);
	}
}