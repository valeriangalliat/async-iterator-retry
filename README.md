# async-iterator-retry [![npm version](http://img.shields.io/npm/v/async-iterator-retry.svg?style=flat-square)](https://www.npmjs.org/package/async-iterator-retry)

> Retry async iteraotrs.

Overview
--------

Like [promise-retry] but for async iterators, also based on [retry].

[promise-retry]:https://www.npmjs.com/package/promise-retry
[retry]: https://www.npmjs.com/package/retry

Usage
-----

```js
const asyncIteratorRetry = require('async-iterator-retry')

const options = {
  retries: 10, // The maximum amount of times to retry the operation. Default is 10.
  factor: 2, // The exponential factor to use. Default is 2.
  minTimeout: 1000, // The number of milliseconds before starting the first retry. Default is 1000.
  maxTimeout: Infinity, // The maximum number of milliseconds between two retries. Default is Infinity.
  randomize: false // Randomizes the timeouts by multiplying with a factor between 1 to 2. Default is false.
}

const iteratorWithRetry = asyncIteratorRetry(async function * (retry, attempt) {
  if (attempt > 1) {
    console.log(`Retrying, attempt ${attempt}...`)
  }

  const iterator = getSomeIterator()

  try {
    yield * iterator
  } catch (err) {
    if (err.code === 'ETIMEDOUT') {
      yield * retry(err)
    }

    throw err
  }
}, options)

for await const (item of myIteratorWithRetry) {
  console.log(item)
}
```
