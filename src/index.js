import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import 'jquery';


import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { reducer } from './reducers/reducers'
import { updateDispatcher,
  get_country_list } from './apiController/CountryController'

const store = createStore(reducer)

ReactDOM.render( 
  <Provider store={store}>
      <App />
  </Provider>, document.getElementById('root'));
  registerServiceWorker();



