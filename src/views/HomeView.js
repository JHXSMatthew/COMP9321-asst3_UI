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

export class HomeView extends Component{

  render(){
    return (
      <div className="container">
        <div className="row">
            <div className='col d-flex justify-content-md-center'>
            <img src={Logo} alt='yes?'/>
          </div>
        </div>
        <br/>
        <div className="row" >
          <SearchBar />
        </div>
        <br/>
        <div className="row">
          <div className="col">
            <CountryRankTable columns={columns} data={makeData()} flag={flag} />
          </div>
        </div>

      </div>
    );
  }
}