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
import {ENDPOINT} from './Utils'

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';


import * as Actions from './reducers/actions';

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators(Actions, dispatch)
})

const mapStateToProps = (state) => ({
	state: state
});

class App extends Component {
  constructor(props){
    super(props)
    const { 
      actionFetchCountryList,
      actionFetchFail,
      actionUpdateCountryList 
    } = props.actions;
    actionFetchCountryList()
    fetch(ENDPOINT + '/countries').then((response)=>{
      response.json().then((data) => {
        actionUpdateCountryList(data);
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
      <div >
          <Header />
          <br/>
          {fetching ? <LoadingView type="spin" color="#0000ff"/> :
          <Switch>
            <Route exact path="/country" render = {() => <RankingView />}/>
            <Route path="/country/:name" render = {() => <CountryView />}  />
            <Route exact path="/" render={()=> <HomeView countryList={this.props.state.countryList}/>}/>
          </Switch>
          }

      </div>
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

export default connect(
	mapStateToProps,
	mapDispatchToProps
) (App);

