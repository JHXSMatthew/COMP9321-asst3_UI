import React, { Component } from 'react';
import Header from './components/Header';
import HomeView from './views/HomeView';
import CountryView from './views/CountryView';
import RankingView from './views/RankingView';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'


class App extends Component {
  render() {
    return (
      <div >
          <Header />
          <br/>
          <Switch>
            <Route exact path="/country" render = {() => <RankingView />}/>
            <Route path="/country/:name" render = {() => <CountryView />}  />
            <Route path="/" render={()=> <HomeView/>}/>

          </Switch>

      </div>
    );
  }
}

export default App;
