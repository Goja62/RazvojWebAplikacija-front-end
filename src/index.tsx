import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import HomePage from './components/HomePage/HomePage';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css'
import { ContactPage } from './components/ContactPage/ContactPage';
import { UserLoginPage } from './components/UserLoginPage/UserLoginPage';
import { HashRouter, Route } from 'react-router-dom';
import Switch from 'react-bootstrap/esm/Switch';
import { CategoryPage } from './components/CategoryPage/CategoryPage';
import { UserRegistrationPage } from './components/UserRegistrationPage/UserRegistrationPage';
import OrdersPage from './components/OrdersPage/OrdersPage';
import { AdministratorLoginPage } from './components/AdministratorLoginPage/AdministratorLoginPage';
import AdministratorDashboard from './components/AdministratorDashboard/AdministratorDashboard';
import AdministratorDashboardCategory from './components/AdministratorDashboardCategory/AdministratorDashboardCategory';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Switch>
        <Route exact path = "/" component = { HomePage }></Route>
        <Route path = "/contact" component = { ContactPage }></Route>
        <Route path = "/user/login" component = { UserLoginPage }></Route>
        <Route path = "/user/register" component = { UserRegistrationPage }></Route>
        <Route path = "/category/:cId" component = { CategoryPage }></Route>
        <Route path = "/user/order" component = { OrdersPage }></Route>
        <Route path = "/administrator/login" component = { AdministratorLoginPage }></Route>
        <Route exact path = "/administrator/dashboard" component = { AdministratorDashboard }></Route>
        <Route path = "/administrator/dashboard/category/" component = { AdministratorDashboardCategory }></Route>
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
