import React from "react";
import { Redirect } from "react-router-dom";
import { removeTokenData } from "../../api/api";

interface UserLogoutPageState {
    done: boolean;
}

export default class UserLogoutPage extends React.Component {
    state: UserLogoutPageState;

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
            return <Redirect to = "/user/login/"></Redirect>
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
        removeTokenData('user')
        this.finised();
    }
}