export const awaitWrap = (promise) => {
  const [err, data] = []
  return promise.then(res => {
    return [null, res]
  }).catch(err => {
    return [err, null]
  })
}