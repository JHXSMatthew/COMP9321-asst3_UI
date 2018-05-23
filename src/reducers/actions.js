
export const TYPE_UPDATE_COUNTRY_LIST = "TYPE_UPDATE_COUNTRY_LIST"

export const actionUpdateCountryList = (data) => {
  return {
    type: TYPE_UPDATE_COUNTRY_LIST,
    data: data
  }
} 

export const TYPE_FETCH_COUNTRY_LIST = "TYPE_FETCH_COUNTRY_LIST"
export const actionFetchCountryList = ()=>{
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