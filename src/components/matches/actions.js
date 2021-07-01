import axios from 'axios'
import {APIKEY} from '../../apiKey'

export const getMatches = (param, actionType) =>{
    return dispatch => {
        axios.get(`https://cricapi.com/api/${param}?apikey=${APIKEY}`)
        .then((response)=>{
            console.log("matches list from api => ",response.data)
            dispatch({
                type:actionType,
                data:response.data
            })
        }).catch((err)=>console.log(err))
    }
}
