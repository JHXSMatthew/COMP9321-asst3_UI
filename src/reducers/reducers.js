import {
  TYPE_UPDATE_COUNTRY_LIST,
  TYPE_FETCH_COUNTRY_LIST,
  TYPE_FETCH_FAIL,
  TYPE_UPDATE_COUNTRY_INFO,
  TYPE_FETCH_ALL,
  TYPE_UPDATE_ALL,
  actionUpdateCountryList,
  
} from './actions'

const ENDPOINT = "http://localhost:5000/data"

export const reducer = (state=[], action) => {
  switch(action.type){
    case TYPE_UPDATE_COUNTRY_LIST:
      return Object.assign({}, state, {
        countryList: action.data,
        fetching: false
      });
    case TYPE_FETCH_COUNTRY_LIST:
      return Object.assign({}, state, {
        fetching: true
      });
    case TYPE_FETCH_FAIL:
      return Object.assign({}, state, {
        fetching: false
      });
    case TYPE_UPDATE_COUNTRY_INFO:
      return Object.assign({}, state, {
        currentCountryInfo: action.data.result,
        fetching :false
      })
    case TYPE_UPDATE_ALL:
      return Object.assign({}, state,{
        all: action.data.result,
        fetching: false
      })
    default:
      return state;

  } 
}