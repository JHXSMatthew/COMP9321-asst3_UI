import React,{Component} from 'react'
import { Chart } from 'react-google-charts';

import { ENDPOINT } from '../Utils'
import { actionUpdateCountryInfo } from '../reducers/actions';
import LoadingView from '../components/LoadingView'


class CountryView extends Component{
  constructor(props){
    super(props)
    console.log(props)

    this.isReady = this.isReady.bind(this)
  }

  componentDidMount(){
    if(!this.props.state || !this.props.state.currentCountryInfo){
      this.props.getCountryInfo(this.props.countryName)
    }
  }

  isReady(){
    return this.props.state && this.props.state.currentCountryInfo && !this.props.state.fetching
  }

  render(){
    // const data = {
    //   country: "China",
    //   capital: "BeiJing",
    //   agrland: "0.45",
    //   rank_overall: "1",
    //   lat: 39.9385466,
    //   lng: 116.1172765,
    //   eco: {
    //     gni: "171",
    //     gini: "0.5",
    //     rank_gini: "1",
    //     rank_gni: "1",
    //   },
    //   env: {
    //     co2: "32",
    //     ch4: "45",
    //     rank_co2: "1",
    //     rank_ch4: "1"
    //   },
    //   eng: {
    //     renewable: "0.2",
    //     fossie_fuel: "0.3",
    //     rank_renewable: "1",
    //     rank_fossie_fuel: "1"
    //   }
    // }

    const rp = [
      ["gini", 1],
      ["gni", 2],
      ["co2",3],
      ["ch4",4],
      ["Renewable Energy",5],
      ["Fossie Fuel", 3]
    ]
    const {state} = this.props
    const {currentCountryInfo} = state
    var name = 'Default'
    if(currentCountryInfo){
      name = currentCountryInfo.Name
    }
    return (
      <LoadingView fetching={!this.isReady()} type="spin" color="#0000ff">
        <div className="container">
          <div className="card ">
            <div className="card-body">
              <div className="container">
                <div className="row">
                  <div className="col">
                    <CountryInfo countryInfo={currentCountryInfo} />
                  </div>
                  <div className="col">
                    <img src={"https://maps.googleapis.com/maps/api/staticmap?center=" + name + "&zoom=4&size=400x340&key=AIzaSyBfvL8_gNAlyKFQbj7tWfKkOJpZcveBUXk"}/>    
                  </div>
                </div>
              </div>
            </div>
          </div>      
          <div className="row" id="accordion">
            <div className="col">
              <Collapsed 
                uniqueName="countryRankView"
                body = { () => <CountryInfoRankingChart data={rp}/>}
                title = "Country Rankings"
                parent = "#accordion"
              />
              </div>
          </div>
        </div>
      </LoadingView>
    );
  }
}

class CountryInfo extends Component{

  constructor(props){
    super(props)
    this.getLatest = this.getLatest.bind(this)
    this.findYearToDisplay = this.findYearToDisplay.bind(this)
  }

  getLatest(list){
    let year = -1
    let value = 'N/G'
    if(list){
      for(let i = 0 ; i < list.length; i ++){
        if(list[i].year > Number(year) && list[i].value != -1){
          value = list[i].value
          year = Number(list[i].year)
        }
      }
    }
    return {year,value}
  }

  //need one year that has all the data
  findYearToDisplay(list){
    if(!list || list.length == 0){
      return -1
    }
    let first = list[0]
    if(!first || first.length == 0){
      return -1
    }
    let length = first.length
    let year = -1
    let idx = -1
    for(let i = 0 ; i < length ; i ++){
      let hasValue = false
      for(let j = 0 ; j < list.length ; j ++){
        if(list[j] && list[j][i] && list[j][i].value && list[j][i].value != -1){
          hasValue = true
          year = list[j][i].year
        }else{
          hasValue = false
          break
        }
      }
      if(hasValue){
        idx = i
        break;
      }
    }
    return {year,idx}

  }

  render(){
    const {Name, CO2, Agriculture_Percentage, GINI, GNI, Population,Renewable_Percentage,Fossil_Fuel_Percentage, CH4} = this.props.countryInfo;
    // const {gni, gini, rank_gni, rank_gini} = this.props.countryInfo.eco;
    // const {co2, ch4 , rank_co2, rank_ch4} = this.props.countryInfo.env
    // const {renewable, fossie_fuel, rank_renewable, rank_fossie_fuel} = this.props.countryInfo.eng
    const {year, idx} = this.findYearToDisplay([CO2, Agriculture_Percentage, GNI, Population,Renewable_Percentage,Fossil_Fuel_Percentage, CH4])
    console.log('year to display:' + year + ' idx:' + idx)
    return (
       <div>
      {/* //   <div className="card-body"> */}
          <h5 className="card-title">{Name} Information - {year}</h5>
          <CountryInfoAttribute key="1"
          mapping={[
            {key:"Population", value: Population[idx]},
            {key:"Agriculture Land", value: Agriculture_Percentage[idx]},
            {key:"GNI", value: GNI[idx]},
            {key: "GINI", value: this.getLatest(GINI)},
            {key:"Ranking", value: {value:1}} //TODO: need the rank api.
          ]} 
          title="General" />

           <CountryInfoAttribute key="2"
          mapping={[
            {key:"CO2",value: CO2[idx]},
            {key:"CH4", value: CH4[idx]},
          ]} 
          title="Environmental Indicators" />

           <CountryInfoAttribute key="3"
          mapping={[
            {key:"Renewable Energy",value: Renewable_Percentage[idx]},
            {key:"Fossie Fuel", value: Fossil_Fuel_Percentage[idx]},
          ]} 
          title="Enery Indicators" />
      {/* //   </div> */}
       </div>
    );
  }
}

class CountryInfoAttribute extends Component{
  render(){
    const x = []
    //element = {year,value}
    this.props.mapping.forEach(element => {
      x.push( <li key={element.key} data-toggle="tooltip" data-placement="right" title={"In " + element.value.year}>{element.key}: {element.value.value}</li>) //second value for the 'real' value
    });

    return (
      <div>
          <h6 className="card-subtitle mb-2 text-muted">{this.props.title}</h6>
          <ul>
            {x}
          </ul>
      </div>
    );
  }
}

class Collapsed extends Component{

  render(){
    const {uniqueName, body, title, parent} = this.props;
    const heading = uniqueName+"head";
    const collapses = uniqueName+"collapse";

    return (
      <div className="card">
        <div className="card-header" id={heading}>
          <h5 className="mb-0">
            <button className="btn btn-link collapsed" data-toggle="collapse" data-target={"#" + collapses} aria-expanded="false" aria-controls={collapses}>
              {title}
            </button>
          </h5>
        </div>
        <div id={collapses} className="collapse show" aria-labelledby={heading} data-parent={parent}>
          <div className="card-body">
            <div className="row col">
              {body()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}


class CountryInfoRankingChart extends Component{
  render(){
    const {data} = this.props
    return(
        <Chart
          chartType="BarChart"
          data={[["Name","Rank"], ...data]}
          options=
          {
            {
              title: 'Ranking over different aspects',
              chartArea: {width: '50%'},
              colors: ['#b0120a', '#ffab91'],
              hAxis: {
                title: 'Ranking factor (higher the better)',
                minValue: 0
              },
              vAxis: {
                title: 'Indicators'
              }
            }
          }
          graph_id="BarChart"
          width= "100%"
          height="600px"
          legend_toggle
        />
    );
     
  }
}

export default CountryView;

