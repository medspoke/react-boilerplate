export default store => next => action => {
  console.log('action created: ', action)
  // console.log('next: ', next)
  // console.log('store: ', store)

  next(action)
}
