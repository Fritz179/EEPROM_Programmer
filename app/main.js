const write = require('./programmer');
const {writePin, exportPin, setDirection} = require('./raspy');


function random(max) {
  return Math.floor(Math.random() * max)
}

async function main() {
  const data = []

  // for (let i = 0; i < 2 ** 8; i++) {
  //   data[random(2**13)] = random(255)
  // }
  for (let i = 0; i < 2 ** 13; i++) {
    data[i] = random(255)
  }

  write(data)
}

main()
