
import React from "react";
import { render } from "react-dom";
import {ENDPOINT} from '../Utils'
import LoadingView from '../components/LoadingView'

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

const columns = [
  {
    Header: "Country Statistics Table",
    columns: [
      {
        Header: "Country Name",
        accessor: "Name"
      },
      {
        Header: "Ranking",
        accessor: "ranking"
      }
    ]
  }
];

const indicatorColumns = [
  {
    Header: "List of Indicator",
    columns: [
      {
        Header: "Indicator Name",
        accessor: "Name"
      },
      {
        Header: "Ranking",
        accessor: 'ranking'
      }
    ]
  }
]

 const yearDataColumn = [
   {
     Header: "Details",
     columns:[
       {
          Header: "Year",
          accessor: "year"
       },
       {
         Header: "data",
         accessor: "value"
       }
     ]
   }
 ]

export default class RankingView extends React.Component {
  constructor() {
    super();
    this.isReady = this.isReady.bind(this)
    this.parseTable = this.parseTable.bind(this)
    this.magic = this.magic.bind(this)
  }

  componentDidMount(){
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

  isReady(){
    return this.props.state && this.props.state.all && this.props.state.ranking && !this.props.state.fetching
  }

  
  //This is for Kai, god...
  magic(raw,analysis){
    if(this.props.state.actualAll){
      raw = this.props.state.ßactualAll
    }
    const toCalc = ['CH4_to_CO2_Ratio', 'CO2_per_KCapita', 'GNI_per_KCapita']
    const giveme2010 = (x)=>{
      let r = 0
      for(let i in x){
        if(x[i].year == 2010){
          r = x[i].value
          break
        }
      }
      return r
    }
    for(let i in toCalc){
      let toSort = []
      for(let j in raw){
        toSort.push({
          value: giveme2010(raw[j][toCalc[i]]),
          country: raw[j].Name
        })
      }
      console.log({beforeSort:toSort})
      toSort.sort((a,b)=>{
        return a.value - b.value
      })
      console.log({afterSort:toSort})
      for(let k in toSort){
        analysis[toSort[k]["country"]][toCalc[i]] = k
      }
    }
    return analysis
  }

  parseTable(raw, analysis, overall){
    //todo: add analysis when someone finish the work
    if(!raw || !analysis || !overall){
      return []
    }
    overall['South Africa'] = 100
    overall['Mexico'] = 85
    overall['Turkey'] = 85
    overall['Argentina'] = 85
    overall['Nigeria'] = 85
    overall['Thailand'] = 85
    overall['Bangladesh'] = 85
    overall['Russian Federation'] = 8

    let rList = []

    for(let i in overall){
      rList[overall[i]] = i
    }
    let acc = 1
    for(let i in rList){
      overall[rList[i]] = acc
      acc ++
    }


    const readAnalysis = this.magic(raw,analysis)

    console.log({a: "raw", v: raw})
    let countryNameIdxMap = {}

    //level one
    //{Name, ranking}
    //level_one should have one-to-one to original raw. Now find
    let level_one = []
    for(let i in raw){
      let obj = raw[i]
      level_one.push({
        Name: obj.Name,
        ranking: overall[obj.Name]
      })
      countryNameIdxMap[obj.Name] = {
        Name: obj.Name,
        ranking: overall[obj.Name],
        raw: obj
      }
    }
    console.log(countryNameIdxMap)
    //level two
    //{indicatorName, ranking, average, 75, 50, 25 }
    for(let i in level_one){
      i = level_one[i]
      const raw_ref = countryNameIdxMap[i.Name].raw
      let level_two = []
      for(let indicatorName in raw_ref ){
        if(Array.isArray(raw_ref[indicatorName])){
          let theRank = 'N/A        '

          let r = readAnalysis[i.Name][indicatorName]
          if(r){
            theRank = r
          }

          let objToAdd = {
            Name: indicatorName,
            detail: raw_ref[indicatorName],
            ranking: theRank,
          }
          level_two.push(objToAdd)
        }
      }
      i["indicators"] = level_two
    }
    console.log({a:'lv1', v:level_one})

    return level_one
  }


  render() {
    // const { data } = this.state;
    const {all, ranking, overallRanking} = this.props.state

    console.log(all)
    const countryViewTableData = this.parseTable(all,ranking,overallRanking)
    let size = 10
    let showElse = true
    if(all && all.length < 10 && all.length){
      size = all.length
      showElse = false
    }
    return (      
      <LoadingView fetching={!this.isReady()} type="spin" color="#0000ff">
        <ReactTable
          data={countryViewTableData}
          columns={columns}
          defaultSorted={[
            {
             id: 'ranking',
             desc: false
            }
          ]}
          filterable
          showPageSizeOptions={showElse}
          showPagination= {showElse}
          pageSize={size}
          className="-striped -highlight"
          noDataText= "Loading..."
          SubComponent={(row)=>{
            return <ReactTable
              data={row.original.indicators}
              filterable
              defaultSorted={[{
                id: 'ranking',
                desc: false
              }]}
              columns={indicatorColumns}
              defaultPageSize={8}
              className="-striped -highlight"
              SubComponent={ (row)=>{
                return (<ReactTable
                  defaultPageSize={8}
                  data={row.original.detail}
                  columns={yearDataColumn}
                />)
              }
              }
            />
          }}
        />
      </LoadingView>
      // <div>
      //   {/* <ReactTable
      //     data={data}
      //     columns={columns}
      //     defaultPageSize={10}
      //     className="-striped -highlight"
      //     SubComponent={row => {
      //       return (
      //         <div style={{ padding: "20px" }}>
      //           <em>
      //             You can put any component you want here, even another React
      //             Table!
      //           </em>
      //           <br />
      //           <br />
      //           <ReactTable
      //             data={data}
      //             columns={columns}
      //             defaultPageSize={3}
      //             showPagination={false}
      //             SubComponent={row => {
      //               return (
      //                 <div style={{ padding: "20px" }}>
      //                   Another Sub Component!
      //                 </div>
      //               );
      //             }}
      //           />
      //         </div>
      //       );
      //     }}
      //   />
      //   <br />
      //   <Tips />
      //   <Logo /> */}
      // </div>
    );
  }
}

