import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css'
import { MainManu, MainManuItem } from './components/MaunManu/MainManu';

const menuItems = [
  new MainManuItem('Home', '/'),
  new MainManuItem('Contact', '/contact/'),
  new MainManuItem('Log in', '/user/login/'),
]

ReactDOM.render(
  <React.StrictMode>
    <MainManu items = { menuItems }></MainManu>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
