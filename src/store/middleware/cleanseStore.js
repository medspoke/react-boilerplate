import { TOKEN_EXPIRED, CLEANSE_STATE } from './actionTypes'

export default store => next => action => {
  const { type } = action
  if (type === TOKEN_EXPIRED) {
    console.info('^v^v^v^v Cleansing State ^v^v^v^v')
    try {
      const storedState = JSON.parse(
        localStorage.getItem('medspoke_state')
      )
      if (storedState) {
        store.dispatch({
          type: CLEANSE_STATE,
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
