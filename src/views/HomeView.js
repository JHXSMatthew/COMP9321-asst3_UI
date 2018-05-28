import React,{Component} from 'react'
import CountryRankTable from '../components/CountryRankTable';
import SearchBar from '../components/SearchBar';
import Logo from '../Vista-logo.png'

import { makeData } from "../Utils";


import {Container, 
    Row,
    Col} from 'reactstrap'

const columns = [
  {
    Header: 'Potential Renewable Energy Growth Ranking',
    columns: [
      {
        Header: "Country",
        accessor: "country"
      },
      {
        Header: "Rank",
        accessor: "ranking"
      }
    ]
  }
]

const flag = {
  showPageSizeOptions: false
}

export default class HomeView extends Component{
  constructor(props){
    super(props)
    this.state = {
      value: ""
    }
    this.onUpdate = this.onUpdate.bind(this);
  }

  onUpdate(value){
    this.setState({value})
  }

  render(){
    const data = []
    if(this.props.overallRanking){
      for(let i in this.props.overallRanking){
        data.push({
          country: i,
          ranking: this.props.overallRanking[i]
        })
      }
    }
    return (
      <div className="container">
        <div className="row">
            <div className='col d-flex justify-content-md-center'>
            <img src={Logo} alt='yes?'/>
          </div>
        </div>
        <br/>
        <div className="row" >
          <SearchBar countryList={this.props.countryList} onUpdate={this.onUpdate} onClick={this.props.onSearch}/>
        </div>
        <br/>
        <div className="row">
          <div className="col">
            <CountryRankTable columns={columns} data={data} flag={flag} />
          </div>
        </div>

      </div>
    );
  }
}