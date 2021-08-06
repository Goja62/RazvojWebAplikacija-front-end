import React from "react";
import { Container, Nav } from "react-bootstrap";

export class MainManuItem {
	text: string = '';
	link: string = '#';

	constructor(text: string, link: string) {
		this.text = text;
		this.link = link;
	}
}

interface MainManuProporties {
	items: MainManuItem[];
}

interface mainManuState {
	items: MainManuItem[];
}

export class MainManu extends React.Component<MainManuProporties> {
	state: mainManuState
	constructor(props: MainManuProporties | Readonly<MainManuProporties>) {
		super(props);

		this.state = {
			items: props.items
		}

		setInterval(() => {
			const novaLista = [ ...this.state.items]
			novaLista.push(new MainManuItem('Naslov', '/link'))
			this.setItems(novaLista)
		}, 2000)
	}

	setItems(items: MainManuItem[]) {
		this.setState({
			items: items,
		})
	}

	render() {
		return(
			<Container>
				<Nav variant = "tabs">
					{ this.state.items.map(this.makeNavLink) }
				</Nav>
			</Container>
		);
	}

	private makeNavLink(item: MainManuItem) {
		return(
			<Nav.Link href = { item.link }>{ item.text }</Nav.Link>
		);
	}
}