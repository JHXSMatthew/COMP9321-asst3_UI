
export const TYPE_UPDATE_COUNTRY_LIST = "TYPE_UPDATE_COUNTRY_LIST"

export const actionUpdateCountryList = (data) => {
  return {
    type: TYPE_UPDATE_COUNTRY_LIST,
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