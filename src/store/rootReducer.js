import { combineReducers } from 'redux'

const reducers = {
  // key: someReducer,
}

const appReducer = combineReducers(reducers)

const rootReducer = (state, action) => appReducer(state, action)

export default rootReducer
