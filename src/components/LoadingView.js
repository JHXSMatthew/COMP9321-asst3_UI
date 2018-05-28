import styled from "tachyons-components";
import ReactLoading from 'react-loading';
import React, {Component} from 'react';

//wrapper
export default class LoadingView extends Component{
  constructor(props){
    super(props)
    console.log(props)
  }
  render(){
    const {fetching} = this.props

    return(
      fetching ? 
      <div className="container">
        <div className="row justify-content-md-center"> 
          <ReactLoading type={this.props.type} color={this.props.color} height={667} width={375} />
        </div>
        <div className="row justify-content-md-center">
           <Prop>Loading...</Prop>
        </div>
      </div>
      :this.props.children
    );
  }
}

const Prop = styled('h3')`
f5 f4-ns mb0 blue`;