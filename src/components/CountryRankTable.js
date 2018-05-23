import React, {Compoenet} from 'react'

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

export default class CountryRankTable extends React.Component {
  constructor() {
    super();
  }

  render() {
    const { data,columns } = this.props;
    return (
      <div>
        <ReactTable
          data={data}
          columns={columns}
          defaultPageSize={10}
          className="-striped -highlight"
          showPageSizeOptions={false}
          showPagination= {false}
          noDataText= "Loading..."
        />
      </div>
    );
  }
}
