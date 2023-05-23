import { combineReducers } from 'redux'
import websiteReducer from './websiteReducer'
import pageName from './pageName'

export default combineReducers({
    websiteReducer,
    pageName
})
