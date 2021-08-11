import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import HomePage from './components/App/HomePage';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css'
import { MainManu, MainManuItem } from './components/MainManu/MainManu';
import { ContactPage } from './components/ContactPage/ContactPage';
import { UserLoginPage } from './components/UserLoginPage/UserLoginPage';
import { HashRouter, Route } from 'react-router-dom';
import Switch from 'react-bootstrap/esm/Switch';
import { CategoryPage } from './components/CategoryPage/CategoryPage';
import { UserRegistrationPage } from './components/UserRegistrationPage/UserRegistrationPage';

const menuItems = [
  new MainManuItem('Home', '/'),
  new MainManuItem('Contact', '/contact/'),
  new MainManuItem('Log in', '/user/login/'),
  new MainManuItem('Register new user', '/user/register/'),
]

ReactDOM.render(
  <React.StrictMode>
    <MainManu items = { menuItems }></MainManu>
    <HashRouter>
      <Switch>
        <Route exact path = "/" component = { HomePage }></Route>
        <Route path = "/contact" component = { ContactPage }></Route>
        <Route path = "/user/login" component = { UserLoginPage }></Route>
        <Route path = "/user/register" component = { UserRegistrationPage }></Route>
        <Route path = "/category/:cId" component = { CategoryPage }></Route>
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
