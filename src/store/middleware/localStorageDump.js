export default store => next => action => {
    const state = store.getState()
    localStorage.setItem('medspoke_state', JSON.stringify(state))
    next(action)
}
