import { LOAD_STORED_STATE, INIT } from './actionTypes'

export default store => next => action => {
  const { type } = action
  if (type === INIT) {
    console.log('Running INIT middleware')
    try {
      const storedState = JSON.parse(
        localStorage.getItem('medspoke_state')
      )
      if (storedState) {
        store.dispatch({
          type: LOAD_STORED_STATE,
          payload: storedState,
        })
      }
      return
    }
 catch (e) {
      // Unable to load or parse stored state, proceed as usual
    }
  }

  next(action)
}
