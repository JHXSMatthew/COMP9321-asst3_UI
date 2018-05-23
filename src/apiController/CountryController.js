import {
  actionUpdateCountryList,
  actionFetchCountryList,
  actionFetchFail,
} from '../reducers/actions'


const ENDPOINT = "http://localhost:5000/data"

export const get_country_list = dispatch =>{
  dispatch(actionFetchCountryList())

  fetch(ENDPOINT + '/countries').then((response)=>{
    response.json().then((data) => {
      const action = actionUpdateCountryList(data);
      dispatch(action);
    });
  }).then((err)=>{
    console.log(err)
    dispatch(actionFetchFail())
  }).catch((err) =>{
    console.log(err)
    dispatch(actionFetchFail())
  })
}

export const get_country_info = (dispatcher,countryName) => {
  fetch(ENDPOINT + '/' + countryName).then((response) => {

  }).then((err)=>{
    console.log(err)
  })
} 