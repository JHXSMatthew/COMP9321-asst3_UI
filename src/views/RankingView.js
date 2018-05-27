
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
        Header: "Average",
        accessor: 'average'
      },
      {
        Header: "75%",
        accessor: '_75'
      },
      {
        Header: "Medium",
        accessor: 'medium'
      },
      {
        Header: "25%",
        accessor: '_25'
      },
      {
        Header: "Ranking",
        accessor: 'ranking'
      },
      {
        Header: 'Maximum',
        accessor: 'maximum'
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
    return this.props.state && this.props.state.all && !this.props.state.fetching
  }

  parseTable(raw, analysis){
    //todo: add analysis when someone finish the work
    if(!raw || !analysis){
      return []
    }
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
        ranking: 2
      })
      countryNameIdxMap[obj.Name] = {
        Name: obj.Name,
        ranking: 2,
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
          let objToAdd = {
            Name: indicatorName,
            detail: raw_ref[indicatorName],
            average: 1,
            maximum: 1,
            ranking: 1,
            _75: 1,
            _25: 1,
            medium: 1
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
    const {all} = this.props.state
    console.log(all)
    const countryViewTableData = this.parseTable(all,[])
    return (      
      <LoadingView fetching={!this.isReady()} type="spin" color="#0000ff">
        <ReactTable
          data={countryViewTableData}
          columns={columns}
          filterable
          defaultPageSize={10}
          className="-striped -highlight"
          noDataText= "Loading..."
          SubComponent={(row)=>{
            return <ReactTable
              data={row.original.indicators}
              filterable
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

