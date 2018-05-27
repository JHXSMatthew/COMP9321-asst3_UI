
import React from "react";
import { render } from "react-dom";
import {ENDPOINT} from '../Utils'

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

const columns = [
  {
    Header: "Name",
    columns: [
      {
        Header: "First Name",
        accessor: "firstName"
      },
      {
        Header: "Last Name",
        id: "lastName",
        accessor: d => d.lastName
      }
    ]
  },
  {
    Header: "Info",
    columns: [
      {
        Header: "Age",
        accessor: "age"
      },
      {
        Header: "Status",
        accessor: "status"
      }
    ]
  },
  {
    Header: "Stats",
    columns: [
      {
        Header: "Visits",
        accessor: "visits"
      }
    ]
  }
];

export default class RankingView extends React.Component {
  constructor() {
    super();
    this.state = {
      data: null
    }
  }

  componentDidMount(){
    if(!this.state.data){
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

  render() {
    // const { data } = this.state;

    return (
      <div>
        {/* <ReactTable
          data={data}
          columns={columns}
          defaultPageSize={10}
          className="-striped -highlight"
          SubComponent={row => {
            return (
              <div style={{ padding: "20px" }}>
                <em>
                  You can put any component you want here, even another React
                  Table!
                </em>
                <br />
                <br />
                <ReactTable
                  data={data}
                  columns={columns}
                  defaultPageSize={3}
                  showPagination={false}
                  SubComponent={row => {
                    return (
                      <div style={{ padding: "20px" }}>
                        Another Sub Component!
                      </div>
                    );
                  }}
                />
              </div>
            );
          }}
        />
        <br />
        <Tips />
        <Logo /> */}
      </div>
    );
  }
}

