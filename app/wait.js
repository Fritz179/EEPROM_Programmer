module.exports = (micro = 0) => {
  return new Promise(resolve => {
    const start = process.hrtime.bigint()
    const delay = micro * 1000
    while (delay > process.hrtime.bigint() - start) {

    }
  })
}
