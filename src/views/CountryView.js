import React,{Component} from 'react'
import { Chart } from 'react-google-charts';

import { ENDPOINT } from '../Utils'
import { actionUpdateCountryInfo } from '../reducers/actions';



class CountryView extends Component{
  constructor(props){
    super(props)
  }

  componentWillMount(){
    
    

  }

  render(){
    const data = {
      country: "China",
      capital: "BeiJing",
      agrland: "0.45",
      rank_overall: "1",
      lat: 39.9385466,
      lng: 116.1172765,
      eco: {
        gni: "171",
        gini: "0.5",
        rank_gini: "1",
        rank_gni: "1",
      },
      env: {
        co2: "32",
        ch4: "45",
        rank_co2: "1",
        rank_ch4: "1"
      },
      eng: {
        renewable: "0.2",
        fossie_fuel: "0.3",
        rank_renewable: "1",
        rank_fossie_fuel: "1"
      }
    }

    const rp = [
      ["gini", 1],
      ["gni", 2],
      ["co2",3],
      ["ch4",4],
      ["Renewable Energy",5],
      ["Fossie Fuel", 3]
    ]

    return (
      <div className="container">
        <div className="card ">
          <div className="card-body">
            <div className="container">
              <div className="row">
                <div className="col">
                  <CountryInfo countryInfo={data} />
                </div>
                <div className="col">
                  <img src={"https://maps.googleapis.com/maps/api/staticmap?center=" + data.capital + ","+ data.country + "&zoom=3&size=400x340&key=AIzaSyBfvL8_gNAlyKFQbj7tWfKkOJpZcveBUXk"}/>    
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
    );
  }
}

class CountryInfo extends Component{
  render(){
    const {country, capital, agrland, rank_overall} = this.props.countryInfo;
    const {gni, gini, rank_gni, rank_gini} = this.props.countryInfo.eco;
    const {co2, ch4 , rank_co2, rank_ch4} = this.props.countryInfo.env
    const {renewable, fossie_fuel, rank_renewable, rank_fossie_fuel} = this.props.countryInfo.eng
     
    return (
       <div>
      {/* //   <div className="card-body"> */}
          <h5 className="card-title">{country} Information</h5>
          <CountryInfoAttribute key="1"
          mapping={[
            {key:"capital",value: capital},
            {key:"Agriculture Land", value: agrland},
            {key:"Ranking", value:rank_overall}
          ]} 
          title="General" />

          <CountryInfoAttribute key="2"
          mapping={[
            {key:"CO2",value: co2},
            {key:"CH4", value: ch4},
          ]} 
          title="Environmental Indicators" />

           <CountryInfoAttribute key="3"
          mapping={[
            {key:"Renewable Energy",value: renewable},
            {key:"Fossie Fuel", value: fossie_fuel},
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
    this.props.mapping.forEach(element => {
      x.push( <li key={element.key}>{element.key}: {element.value}</li>)
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

