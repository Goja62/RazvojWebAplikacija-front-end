import React from "react";
import { Redirect } from "react-router-dom";
import { removeTokenData } from "../../api/api";

interface AdministratorLogoutPageState {
    done: boolean;
}

export default class AdministratorLogoutPage extends React.Component {
    state: AdministratorLogoutPageState;

    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {
            done: false,
        }
    }

    finised() {
        this.setState({
            done: true,
        });
    }

    render() {
        if (this.state.done) {
            return <Redirect to = "/administrator/login/"></Redirect>
        }

        return (
            <p>Loggin out...</p>
        )
    }

    componentDidMount() {
        this.doLogout()
    }

    componentDidUpdate() {
        this.doLogout()
    }

    doLogout() {
        removeTokenData('administrator')
        this.finised();
    }
}