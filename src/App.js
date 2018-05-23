import React, { Component } from 'react';
import styled from "tachyons-components";
import ReactLoading from 'react-loading';
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
import { BrowserRouter } from 'react-router-dom'

import { ENDPOINT } from './Utils'

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';





class App extends Component {
  constructor(props){
    super(props)
    this.onCurrentCountrySelected = this.onCurrentCountrySelected.bind(this)
  }

  componentWillMount(){
    
  }

  onCurrentCountrySelected(){
    const {
      actionFetchStart,actionFetchFail,actionUpdateCountryInfo
    } = this.props.actions

    actionFetchStart()
      fetch(ENDPOINT + "/" + "Australia").then((response)=>{
        response.json().then((data) => {
          actionUpdateCountryInfo(data);
        });
      }).then((err)=>{
        console.log(err)
        actionFetchFail()
      }).catch((err) =>{
        console.log(err)
        actionFetchFail()
      })
  }

  render() {
    const {fetching} = this.props.state
    return (
      <BrowserRouter> 
      <div >
          <Header />
          <br/>
          {fetching ? <LoadingView type="spin" color="#0000ff"/> :
          <Switch>
            <Route exact path="/country" render = {() => <RankingView />}/>
            <Route path="/country/:name" render = {() => <CountryView currentCountry={this.props.state.currentCountry} actions={this.props.actions}/>}  />
            <Route exact path="/" render={()=> <HomeView countryList={this.props.state.countryList} onSearch={this.onCurrentCountrySelected}/>}/>
          </Switch>
          }

      </div>
      </BrowserRouter> 

    );
  }
}

const LoadingView = ({ type, color }) => (
  <div className="container">
    <div className="row justify-content-md-center"> 
      <ReactLoading type={type} color={color} height={667} width={375} />
    </div>
    <div className="row justify-content-md-center">
       <Prop>Loading...</Prop>
    </div>
  </div>
);
const Prop = styled('h3')`
f5 f4-ns mb0 blue`;

export default App;

