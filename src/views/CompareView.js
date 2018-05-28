import React,{Component} from 'react'
import { Chart } from 'react-google-charts';
import Select  from 'react-select'
import 'react-select/dist/react-select.css';

import { ENDPOINT } from '../Utils'
import LoadingView from '../components/LoadingView'
import RankingView from './RankingView'
import {Collapsed, LineCharWrapper} from './CountryView'

function contains(a, obj) {
  var i = a.length;
  while (i--) {
     if (a[i] === obj) {
         return true;
     }
  }
  return false;
}

export default class CompareView extends Component{
  constructor(props){
    super(props)
    this.isReady = this.isReady.bind(this)
    this.setCountry = this.setCountry.bind(this)
    this.setIndicator = this.setIndicator.bind(this)
    this.onShow = this.onShow.bind(this)
    this.filterCountries = this.filterCountries.bind(this)
    this.makeGraph = this.makeGraph.bind(this)
    this.indicator_set_to_graph = this.indicator_set_to_graph.bind(this)
  }
//
  componentDidMount(){
    if(!this.props.state || !this.props.state.countryList){
      this.props.fetchCountryList()
    }
    if(!this.props.state || !this.props.state.indicatorList){
      this.props.fetchIndicatorList()
    }
  }

  isReady(){
    return this.props.state && !this.props.state.fetching
  }

  setCountry(value){
    const {actionSetCompareCountry} = this.props.actions
    if(value){
      actionSetCompareCountry(value.split(','))
    }else{
      actionSetCompareCountry([])
    }
  }

  setIndicator(value){
    const {actionSetCompareIndicator} = this.props.actions
    if(value){
      actionSetCompareIndicator(value.split(','))
    }else{
      actionSetCompareIndicator([])
    }
  }

  onShow(){
    const {compareCountry, compareIndicator} = this.props.state
    if(!compareCountry || !compareIndicator){
      alert('Please select country and indicators to compare!')
      return;
    }
    if(compareCountry.length < 2){
      alert('Please select at least two countries')
      return;
    }
    const {actionShowGraph} = this.props.actions
    actionShowGraph(true)

    //I am lazy
    if(!this.props.state || !this.props.state.all){
      const {actionUpdateAll,actionFetchStart,actionFetchFail} = this.props.actions
      actionFetchStart()
      fetch(ENDPOINT + "/all" ).then((response)=>{
        console.log(response)
        response.json().then((data) => {
          console.log(data)
          actionUpdateAll(data);
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




  indicator_set_to_graph(nameList,dataList, x_title="time", y_title="value", title="Collection"){
    const _default = (err="no data") => <div> {err} </div>
    // console.log({i:"namelist", v:nameList})
    // console.log({i:"dataList", v:dataList})

    if(!nameList || !nameList.length || !dataList || !dataList.length || dataList.length!= nameList.length){
      return _default()
    }
    
    let schema = ["X"]
    let data = []
    //compute schema
    for(let i = 0 ; i < nameList.length; i ++){
      schema.push(nameList[i])
    }
    let curr = []
    let year = 0
    let innerSize = dataList[0].length
   
    //compute all other data, will use previous one if no data avaliable for the year
    for(let i= 0 ; i < innerSize ; i ++){
      curr = []
      year = 0
      for(let j = 0 ; j < dataList.length; j ++){
        let year_value = dataList[j][i]
        if(!year_value){
          console.log('data err' + nameList[i])
          console.log(dataList)
          curr.push(0)
        }else if(year_value.value == -1){
          curr.push(0)
          year = String(year_value.year)
        }else{
          curr.push(year_value.value)
          year = String(year_value.year)
        }
      }
      curr.unshift(year)
      data.push(curr)
    }
    // console.log(schema)
    // console.log(data)
    //if only one data in the name list, then
    if(title == "Collection" && nameList.length == 1){
      title = nameList[0]
    }

    //hotfix the first one is fking -1, you are trolling me
    let first = data[0]
    for(let i = 1 ; i < first.length ; i ++){
      if(first[i] === 0){
        //there you go 
        //find first non-0
        for(let j = 1 ; j < data.length; j++){
          if(data[j][i]){
            data[0][i] = data[j][i]
            break;
          }
        }
      }
    }

    //then fix all the shit data
    first = data[0]
    for(let i = 0 ; i < first.length ; i ++){
      for(let j = 1 ; j < data.length ; j ++){
        if(!data[j][i]){
          data[j][i] = data[j-1][i]
        }
      }
    }
    
    data = data.reverse()
    let id = title
    title = title + " Trend from " + data[0][0]  + " to " + data[data.length - 1][0];
    return {
      id: id,
      title: title ,
      graph:<LineCharWrapper title={title} x_title={x_title} y_title={y_title} schema={schema} data={data}/>
    }
  }


  filterCountries(all){
    let out=[]
    for(let i in all){
      if(contains(this.props.state.compareCountry,all[i].Name)){
        out.push(all[i])
      }
    }
    return out
  }
  makeGraph(){
    const countries = this.filterCountries(this.props.state.all)
    const name = countries.map(x=>x.Name)
    console.log({a:countries,v:name})
    const indicatorList = this.props.state.compareIndicator
    let graphArray = []

    for(let i in indicatorList){
      let indicatorData = []
      for(let j in countries){
        indicatorData.push(countries[j][indicatorList[i]])
      }
      graphArray.push(this.indicator_set_to_graph(name,indicatorData, "year", "value", indicatorList[i]))
    }
    return graphArray.map((e)=> {
      return <Collapsed key={e.id} uniqueName={e.id} body={() => e.graph} title = {e.title} parent = "#accordion" active={true} />
    })
  }

  render(){
    const {state} = this.props
    const {compareCountry, countryList, indicatorList, all} = state
    const {show} = state

    
    return(
      <LoadingView fetching={!this.isReady()} type="spin" color="#0000ff">
        <div className="container">
          {!show ? <div className='card-body'>
            <br/>
            <CountrySelector setCountry={this.setCountry} country={countryList} />
            <br/>
            <IndicatorSelector setIndicator={this.setIndicator} indicator={indicatorList}/>
            <br />
            <div className="row justify-content-md-center">
              <div className='col-2'>
                <button className="btn-block btn-primary btn-large" onClick={this.onShow}> Compare</button>
              </div>
            </div>
            <bt />
           </div>
           :
           <div className='card-body'>
              <RankingView state={{
                all: this.filterCountries(all)
              }}/>
              {this.makeGraph()}
           </div>
           }
        </div>
      </LoadingView>
    )
  }
}

class CountrySelector extends Component{
  constructor(prop){
    super(prop)
    this.state = {
      disabled: false,
      value: '',
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.getCountryOptions = this.getCountryOptions.bind(this);
  }

  handleSelectChange(value) {
    if(value){
      if(value.split(',').length > 4){
        alert('You may only choose 4 countries for now.')
        return;
      }
    }
    this.setState({value});
    this.props.setCountry(value);
  }

  getCountryOptions(){
    const {country} = this.props
    if(!country){
      return []
    }
    const result = country.result   
    
    return result.map((x)=> {
      return {
        label: x.Country,
        value: x.Country
      }
    })
  }

  render(){
    return <Select multi simpleValue value={this.state.value} placeholder="Select Country" options={this.getCountryOptions()} onChange={this.handleSelectChange} />
  }
}

class IndicatorSelector extends Component{
  constructor(prop){
    super(prop)
    this.state = {
      disabled: false,
      value: '',
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.getIndicatorOptions = this.getIndicatorOptions.bind(this);
  }

  handleSelectChange(value) {
    if(value){
      if(value.split(',').length > 4){
        alert('You may only choose 4 indicators for now.')
        return;
      }
    }
    this.setState({value});
    this.props.setIndicator(value);
  }

  getIndicatorOptions(){
    const {indicator} = this.props
    if(!indicator){
      return []
    }
    const result = indicator   
    
    return result.map((x)=> {
      return {
        label: x,
        value: x
      }
    })
  }

  render(){
    return <Select multi simpleValue value={this.state.value} placeholder="Select Indicator" options={this.getIndicatorOptions()} onChange={this.handleSelectChange} />
  }
}
