import {
  TYPE_UPDATE_COUNTRY_LIST,
  TYPE_UPDATE_INDICATOR_LIST,
  TYPE_FETCH_COUNTRY_LIST,
  TYPE_FETCH_FAIL,
  TYPE_UPDATE_COUNTRY_INFO,
  TYPE_FETCH_ALL,
  TYPE_UPDATE_ALL,
  TYPE_SET_COMPARE_COUNTRY,
  TYPE_SET_COMPARE_INDICATOR,
  TYPE_UPDATE_COUNTRY_STORE,
  TYPE_SET_SHOW_GRAPH,
  TYPE_UPDATE_SUMMARY,
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
    case TYPE_UPDATE_INDICATOR_LIST:
      return Object.assign({}, state, {
        indicatorList: action.data.result,
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
    case TYPE_SET_COMPARE_COUNTRY:
      return Object.assign({}, state, {
        compareCountry: action.data
      })
    case TYPE_SET_COMPARE_INDICATOR:
      return Object.assign({}, state,{
        compareIndicator: action.data
      })
    case TYPE_UPDATE_COUNTRY_STORE:
      return Object.assign({}, state,{
        [action.data.Name]: action.data
      })
    case TYPE_SET_SHOW_GRAPH:
      return Object.assign({},state,{
        show: action.data
      })
    case TYPE_UPDATE_SUMMARY:
      return Object.assign({}, state, {
        summaryList: action.data
      })
    default:
      return state;

  } 
}