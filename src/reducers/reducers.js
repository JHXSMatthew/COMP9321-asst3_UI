import {
  TYPE_UPDATE_COUNTRY_LIST,
  TYPE_FETCH_COUNTRY_LIST,
  TYPE_FETCH_FAIL,
  TYPE_FETCH_COUNTRY_INFO,
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
    case TYPE_FETCH_COUNTRY_INFO:
      return Object.assign({}, state, {
        currentCountryInfo: action.data
      })
    default:
    return state;

  } 
}