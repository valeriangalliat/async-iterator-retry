const retry = require('retry')

module.exports = async function * asyncIteratorRetry (f, options) {
  const operation = retry.operation(options)
  let deferResolve

  async function * retryFunc (err) {
    const promise = new Promise(resolve => {
      deferResolve = resolve
    })

    if (operation.retry(err)) {
      const iterator = await promise
      yield * iterator
    } else {
      throw err
    }
  }

  const promise = new Promise(resolve => {
    deferResolve = resolve
  })

  operation.attempt(number => {
    const iterator = f(retryFunc, number)
    deferResolve(iterator)
  })

  const iterator = await promise
  yield * iterator
}
