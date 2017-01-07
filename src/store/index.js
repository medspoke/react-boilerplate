import { createStore, applyMiddleware, compose } from 'redux'
import reduxThunk from 'redux-thunk'
// import localStorageLoad from 'middleware/localStorageLoad'
// import localStorageDump from 'middleware/localStorageDump'
// import responseHelper from 'middleware/responseHelper'
// import cleanseStore from 'middleware/cleanseStore'
// import * as axiosConfig from './middleware/axiosConfig'
import rootReducer from './rootReducer'

const store = createStore(rootReducer, compose(
  // applyMiddleware(localStorageLoad, cleanseStore, reduxThunk, responseHelper, localStorageDump)
  applyMiddleware(reduxThunk)
))

// axiosConfig.interceptRequests()
// axiosConfig.interceptResponses(store)

export default store
