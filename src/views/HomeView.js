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
        accessor: "rank"
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
    if(this.props.countryList && this.props.countryList.result){
      this.props.countryList.result.forEach(element => {
        data.push({
          country: element.Country,
          rank: element.id
        })
      });
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
          <SearchBar countryList={this.props.countryList} onUpdate={this.onUpdate}/>
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