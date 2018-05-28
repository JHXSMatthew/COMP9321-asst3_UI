
export const TYPE_UPDATE_COUNTRY_LIST = "TYPE_UPDATE_COUNTRY_LIST"

export const actionUpdateCountryList = (data) => {
  return {
    type: TYPE_UPDATE_COUNTRY_LIST,
    data: data
  }
}

export const TYPE_UPDATE_INDICATOR_LIST = "TYPE_UPDATE_INDICATOR_LIST"
export const actionUpdateIndicatorList = (data) => {
  return {
    type: TYPE_UPDATE_INDICATOR_LIST,
    data: data
  }
} 

export const TYPE_FETCH_COUNTRY_LIST = "TYPE_FETCH_COUNTRY_LIST"
export const actionFetchStart = ()=>{
  return {
    type: TYPE_FETCH_COUNTRY_LIST
  }
}

export const TYPE_FETCH_FAIL = "TYPE_FETCH_FAIL"
export const actionFetchFail = () => {
  return {
    type: TYPE_FETCH_FAIL
  }
}

export const TYPE_UPDATE_COUNTRY_INFO = "TYPE_UPDATE_COUNTRY_INFO"
export const actionUpdateCountryInfo = (data) =>{
  return {
    type :TYPE_UPDATE_COUNTRY_INFO,
    data : data
  }
}

export const TYPE_FETCH_COUNTRY_INFO = "TYPE_FETCH_COUNTRY_INFO"
export const actionFetchCountryInfo = (countryName) =>{
  return {
    type: TYPE_FETCH_COUNTRY_INFO,
    data: countryName
  }
}

export const TYPE_UPDATE_ALL = "TYPE_UPDATE_ALL"
export const actionUpdateAll = (data) =>{
  return {
    type: TYPE_UPDATE_ALL,
    data: data
  }
}

export const TYPE_UPDATE_SUMMARY = "TYPE_UPDATE_SUMMARY"
export const actionUpdateSummary = (data) =>{
  return {
    type: TYPE_UPDATE_SUMMARY,
    data: data
  }
}


export const TYPE_UPDATE_RANKING = "TYPE_UPDATE_RANKING"
export const actionUpdateRanking = (data) =>{
  return {
    type: TYPE_UPDATE_RANKING,
    data: data
  }
}

export const TYPE_UPDATE_OVERALL_RANKING = "TYPE_UPDATE_OVERALL_RANKING"
export const actionUpdateOverAllRanking = (data) =>{
  return {
    type: TYPE_UPDATE_OVERALL_RANKING,
    data: data
  }
}





//for compare view state
export const TYPE_SET_COMPARE_COUNTRY = "TYPE_SET_COMPARE_COUNTRY"
export const actionSetCompareCountry = (list) =>{
  return {
    type: TYPE_SET_COMPARE_COUNTRY,
    data: list
  }
}
export const TYPE_SET_COMPARE_INDICATOR = "TYPE_SET_COMPARE_INDICATOR"
export const actionSetCompareIndicator = (list) =>{
  return {
    type: TYPE_SET_COMPARE_INDICATOR,
    data: list
  }
}

export const TYPE_SET_SHOW_GRAPH = "TYPE_SET_SHOW_GRAPH"
export const actionShowGraph = (yesorno) =>{
  return {
    type: TYPE_SET_SHOW_GRAPH,
    data: yesorno
  }
}


export const TYPE_UPDATE_COUNTRY_STORE = "TYPE_UPDATE_COUNTRY_STORE"
export const actionUpdateCountryStore = (countryInfo) =>{
  return {
    type: TYPE_UPDATE_COUNTRY_STORE,
    data: countryInfo
  }
}