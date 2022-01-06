import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Provider } from 'react-redux';
import './index.css'
import {TransactionProvider} from './context/TransactionContext'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from './App';
import store from './app/store'
ReactDOM.render(
  <TransactionProvider>
    <ToastContainer position="top-center" />
    <React.StrictMode>
      <Router>
        <Provider store= {store}>
          <App />
        </Provider>
      </Router>
    </React.StrictMode>
  </TransactionProvider>,
    document.getElementById('root')
  );