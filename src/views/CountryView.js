import React,{Component} from 'react'
import { Chart } from 'react-google-charts';

import { ENDPOINT ,safeGet } from '../Utils'
import { actionUpdateCountryInfo } from '../reducers/actions';
import LoadingView from '../components/LoadingView'



class CountryView extends Component{
  constructor(props){
    super(props)
    console.log(props)

    this.isReady = this.isReady.bind(this)
    this.indicator_set_to_graph = this.indicator_set_to_graph.bind(this)
  }

  componentDidMount(){
    if(!this.props.state || !this.props.state.currentCountryInfo){
      this.props.getCountryInfo(this.props.countryName)
    }
  }

  isReady(){
    return this.props.state && this.props.state.currentCountryInfo && !this.props.state.fetching && this.props.state.indicatorList
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
    const foo = 
      ['X',"first",'second']
    
    const bar = [
      [0,1,2],
      [2,3,4]
    ]
    const {state} = this.props
    const {currentCountryInfo, indicatorList} = state
    var name = 'Default'
    var graphArray = []

    //get graph and indicator
    
    let average = {}


    let indicatorObj = {}
    if(indicatorList){
      for(let i in indicatorList){
        indicatorObj[indicatorList[i].Name] = indicatorList[i]
      }
    }
    
    if(currentCountryInfo){
      name = currentCountryInfo.Name
      //to graph
      for(let p in currentCountryInfo){
        let obj = currentCountryInfo[p]
        if(Array.isArray(obj)){
          if(obj.length>0)
          {
            let graphObj = this.indicator_set_to_graph([p],[obj], "year",safeGet(indicatorObj[p], "Unit"), p)
            graphObj.graph = 
            <div>
               {graphObj.graph} 
               <details>
                  <summary>What does this mean?</summary>
                  <p>
                    {safeGet(indicatorObj[p], "Details")}
                  </p>
                </details>
            </div>
            graphArray.push(graphObj)
          }
        }
      }
    }

    graphArray = graphArray.map((e)=> {
      return <Collapsed key={e.id} uniqueName={e.id} body={() => e.graph} title = {e.title} parent = "#accordion" active={false} />
    })
    console.log({t:"state info", v: this.props, x: currentCountryInfo})


    return (
      <LoadingView fetching={!this.isReady()} type="spin" color="#0000ff">
        <div className="container">
          <div className="card ">
            <div className="card-body">
              <div className="container">
                <div className="row">
                  <div className="col">
                    <CountryInfo countryInfo={currentCountryInfo} indicatorList={indicatorList} />
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
                active = {true}
              />
              {graphArray}
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
    let idx = 0
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
    const {state} = this.props

    let indicatorList = {}
    if(this.props.indicatorList){
      indicatorList = this.props.indicatorList
      let indicatorObj = {}
      for(let i in indicatorList){
        indicatorObj[indicatorList[i].Name] = indicatorList[i]
      }
      indicatorList = indicatorObj
    }
    
    console.log({indi: indicatorList})

    const {year, idx} = this.findYearToDisplay([CO2, Agriculture_Percentage, GNI, Population,Renewable_Percentage,Fossil_Fuel_Percentage, CH4])
    console.log('year to display:' + year + ' idx:' + idx)
    return (
       <div>
      {/* //   <div className="card-body"> */}
          <h5 className="card-title">{Name} Information - {year}</h5>
          <CountryInfoAttribute key="1"
          mapping={[
            {key:"Population", value: Population[idx], unit: safeGet(indicatorList["Population"], "Unit"), detail: safeGet(indicatorList["Population"], "Details")},
            {key:"Agriculture Land", value: Agriculture_Percentage[idx],  unit: safeGet(indicatorList["Agriculture_Percentage"], "Unit"), detail: safeGet(indicatorList["Agriculture_Percentage"], "Details")},
            {key:"GNI", value: GNI[idx],  unit: safeGet(indicatorList["GNI"], "Unit"), detail: safeGet(indicatorList["GNI"], "Details")},
            {key: "GINI", value: this.getLatest(GINI),  unit: safeGet(indicatorList["GINI"], "Unit"), detail: safeGet(indicatorList["GINI"], "Details")},
            {key:"Ranking", value: {value:1}, notFormat: true} //TODO: need the rank api.
          ]} 
          title="General" 
          />

           <CountryInfoAttribute key="2"
          mapping={[
            {key:"CO2",value: CO2[idx], unit: safeGet(indicatorList["CO2"], "Unit"), detail: safeGet(indicatorList["CO2"], "Details")},
            {key:"CH4", value: CH4[idx], unit: safeGet(indicatorList["CH4"], "Unit"), detail: safeGet(indicatorList["CH4"], "Details")},
          ]} 
          title="Environmental Indicators" />

           <CountryInfoAttribute key="3"
          mapping={[
            {key:"Renewable Energy Consumption",value: Renewable_Percentage[idx], unit: safeGet(indicatorList["Renewable_Percentage"], "Unit"), detail: safeGet(indicatorList["Renewable_Percentage"], "Details")},
            {key:"Fossil Fuel Energy Consumption", value: Fossil_Fuel_Percentage[idx], unit: safeGet(indicatorList["Fossil_Fuel_Percentage"], "Unit"), detail: safeGet(indicatorList["Fossil_Fuel_Percentage"], "Details")},
          ]} 
          title="Enery Indicators" />
      {/* //   </div> */}
       </div>
    );
  }///
}

class CountryInfoAttribute extends Component{
  render(){
    const getFormat = (z)=>{
      try{
        return z.toFixed(2)
      }catch(c){
        return 'N/A'
      }
    }
    const x = []
    //element = {year,value}
    console.log({kkk:this.props.mapping})
    this.props.mapping.forEach(element => {              
      x.push( <li key={element.key}>
        <span data-toggle="tooltip" data-placement="right" title={element.detail}>
          {element.key}: <span style={{fontWeight: 900}}>{!element.notFormat? getFormat((element.value.value)):element.value.value}</span> <span style={{opacity: 0.5}}>{element.unit} </span>
        </span>
       
      </li>) //second value for the 'real' value
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

export class Collapsed extends Component{

  constructor(props){
    super(props)
    this.state={
      active: false
    }
  }

  componentDidMount(){
    this.setState({
      active: this.props.active
    })
  }


  render(){
    const {uniqueName, body, title, parent} = this.props;
    const heading = uniqueName+"head";
    const collapses = uniqueName+"collapse";

    return (
      <div className="card">
        <div className="card-header" id={heading}>
          <h5 className="mb-0">
            <button className="btn btn-link collapsed" onClick={()=>{this.setState({active: !this.state.active})}}>
              {title}
            </button>
          </h5>
        </div>
        <div id={collapses} className={"collapse " + (this.state.active?"show":"")} aria-labelledby={heading} data-parent={parent}>
          <div className="card-body">
            <div>
              {this.state.active?body():<div>loading</div>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}


export class LineCharWrapper extends Component{


  render(){
    const {schema, data, title, y_title, x_title} = this.props
    console.log(this.props)
    return(
        <Chart
          chartType="LineChart"
          data={[schema, ...data]}
          options=
          {
            {
              title: title,
              colors: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'],
              hAxis: {
                title: x_title
              },
              vAxis: {
                title: y_title
              }
            }
          }
          graph_id={title}
          width= "100%"
          height="600px"
          legend_toggle
        />
    );
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

