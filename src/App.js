import React, { Component } from 'react';
import styled from "tachyons-components";
import ReactLoading from 'react-loading';
import Header from './components/Header';
import HomeView from './views/HomeView';
import CountryView from './views/CountryView';
import RankingView from './views/RankingView';
import CompareView from './views/CompareView'
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
    this.onCurrentCountrySelected = this.onCurrentCountrySelected.bind(this)
    this.fetchCountryList = this.fetchCountryList.bind(this)
    this.fetchIndicatorList = this.fetchIndicatorList.bind(this)
  }

  componentDidMount(){
    console.log("on app mount!")
    console.log(this.props)
    this.fetchCountryList()
  }

  fetchCountryList(){
    const { 
      actionFetchStart,
      actionFetchFail,
      actionUpdateCountryList 
    } = this.props.actions;
    const {countryList} = this.props.state;
    if(!countryList){
      actionFetchStart()
      fetch(ENDPOINT + '/countries').then((response)=>{
        response.json().then((data) => {
          console.log(data)
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
  }

  fetchIndicatorList(){
    const { 
      actionFetchStart,
      actionFetchFail,
      actionUpdateIndicatorList 
    } = this.props.actions;
    const {countryList} = this.props.state;
    if(!countryList){
      actionFetchStart()
      fetch(ENDPOINT + '/indicator').then((response)=>{
        response.json().then((data) => {
          console.log(data)
          actionUpdateIndicatorList(data);
        });
      }).then((err)=>{
        console.log(err)
        actionFetchFail()
      }).catch((err) =>{
        console.log(err)
        actionFetchFail()
      })
    }    
  }

  onCurrentCountrySelected(value){
    const {
      actionFetchStart,actionFetchFail,actionUpdateCountryInfo
    } = this.props.actions
    
    actionFetchStart()
    fetch(ENDPOINT + "/" + value).then((response)=>{
      console.log(response)
      response.json().then((data) => {
        console.log(data)
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
    const {currentCountryInfo} = this.props.state
    return (
      <BrowserRouter> 
      <div >
          <Header />
          <br/>
            <Switch>
              <Route exact path="/country" render = {() => <RankingView state={this.props.state} actions={this.props.actions}/>}/>
              <Route path="/country/:name" render = {(props) => <CountryView state={this.props.state} getCountryInfo={this.onCurrentCountrySelected} countryName={props.match.params.name}/>} />
              <Route exact path="/" render={()=> <HomeView countryList={this.props.state.countryList} onSearch={this.onCurrentCountrySelected}/>}/>
              <Route exact path="/compare" render={()=> <CompareView state={this.props.state} actions={this.props.actions} fetchCountryList={this.fetchCountryList}  fetchIndicatorList={this.fetchIndicatorList}/>}/>
            </Switch>          

      </div>
      </BrowserRouter> 

    );
  }
}

//wrapper
class LoadingView extends Component{
  constructor(props){
    super(props)
    console.log(props)
  }
  render(){
    const {fetching} = this.props

    return(
      fetching ? 
      <div className="container">
        <div className="row justify-content-md-center"> 
          <ReactLoading type={this.props.type} color={this.props.color} height={667} width={375} />
        </div>
        <div className="row justify-content-md-center">
           <Prop>Loading...</Prop>
        </div>
      </div>
      :this.props.children
    );
  }
}

const Prop = styled('h3')`
f5 f4-ns mb0 blue`;

export default connect(
	mapStateToProps,
	mapDispatchToProps
) (App);

