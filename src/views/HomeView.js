import React,{Component} from 'react'
import CountryRankTable from '../components/CountryRankTable';
import SearchBar from '../components/SearchBar';
import Logo from '../Vista-logo.png'

import { makeData,ENDPOINT } from "../Utils";

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as Actions from '../reducers/actions';


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


const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators(Actions, dispatch)
})

const mapStateToProps = (state) => ({
	state: state
});

class HomeView extends Component{
  constructor(props){
    super(props)
    this.state = {
      value: ""
    }
    this.onUpdate = this.onUpdate.bind(this);
  }

  componentWillMount(){
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

export default connect(
	mapStateToProps,
	mapDispatchToProps
) (HomeView)