const initialState = {
    newMatches:[],
    oldMatches:[]
}

const reducer = (state = initialState, action) =>{
    if('NEWMATCHES' === action.type ){
        return {
            ...state,
            newMatches:action.data
        }
    }else if('OLDMATCHES' === action.type){
       return{
           ...state,
           oldMatches:action.data
       }
    }
    return state
}

export default reducer