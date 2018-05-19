import React, { Component } from 'react';
import Header from './components/Header';
import { HomeView } from './views/HomeView';


class App extends Component {
  render() {
    return (
      <div >
          <Header />
          <br/>
          <HomeView />

      </div>
    );
  }
}

export default App;
