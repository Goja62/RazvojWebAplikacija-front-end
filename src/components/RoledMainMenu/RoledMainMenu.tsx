import React from "react";
import { MainMenu, MainMenuItem } from '../MainMenu/MainMenu';

interface RoledMainMenuProperties {
    role: 'user' | 'administrator' | 'visitor'
}

export default class RoledMainMenu extends React.Component<RoledMainMenuProperties> {
    render() {
        let items: MainMenuItem[] = [];

        switch (this.props.role) {
            case 'visitor': items = this.getVisitorMenuItems(); break;
            case 'administrator': items = this.getAdministratorMenuItems(); break;
            case 'user': items = this.getUserMenuItems(); break;
        }

        let showCart = false;

        if (this.props.role === 'user') {
            showCart = true;
        }

        return <MainMenu items = { items } showCart = { showCart }></MainMenu>
    }

    getUserMenuItems(): MainMenuItem[] {
        return [
            new MainMenuItem('Home', '/'),
            new MainMenuItem('Contact', '/contact/'),
            new MainMenuItem('User log out', '/user/logout/'),
            new MainMenuItem('My orders', '/user/login/'),
        ];
    }

    getAdministratorMenuItems(): MainMenuItem[] {
        return [
            new MainMenuItem('Admin log out', '/administrator/logout/'),
            new MainMenuItem('Admin dashboard', '/administrator/dashboard/'),
        ];
    }

    getVisitorMenuItems(): MainMenuItem[] {
        return [
            new MainMenuItem("Register", "/user/register/"),
            new MainMenuItem("User log in", "/user/login/"),
            new MainMenuItem("Administrator log in", "/administrator/login/"),
        ];
    }
}