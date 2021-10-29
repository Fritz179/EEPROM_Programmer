const write = require('./programmer');

function random(max) {
  return Math.floor(Math.random() * max)
}

const rewrite = process.argv.includes('-r')
const i = process.argv.indexOf('-n')
const name = i != -1 ? process.argv[i + 1] : 'unnamed'

async function main() {
  const data = []

  for (let i = 0; i < 2 ** 8; i++) {
    data[random(2**13)] = random(255)
  }
  for (let i = 0; i < 15; i++) {
    data[i] = i
  }
  // for (let i = 0; i < 2 ** 13; i++) {
  //   data[i] = random(255)
  // }

  write(data, name, rewrite)
}

main()
