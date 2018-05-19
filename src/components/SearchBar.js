import React, {Component} from 'react';

export default class SearchBar extends Component{
  
  render(){
    return (
        <div className='container'>
          <div className='row justify-content-md-center' >
            <div className='col-md-8'>
              <input type='text' className='form-control' placeholder='' />
            </div>
          </div>
          <br/>
          <div className='row justify-content-md-center'>
            <div className='col-md-4'>
              <button class='btn-primary btn-lg btn-block' > Search </button>
            </div>
          </div>
        </div>
    );
  }
}


