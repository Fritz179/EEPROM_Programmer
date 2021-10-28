const write = require('./programmer');
const {writePin, exportPin, setDirection} = require('./raspy');


function random(max) {
  return Math.floor(Math.random() * max)
}

async function main() {
  const data = []

  for (let i = 0; i < 2 ** 8; i++) {
    data[random(2**13)] = random(255)
    // can overwrite prevoius value
  }
  // for (let i = 0; i < 2 ** 13; i++) {
  //   data[i] = random(255)
  // }

  await write(data)
}

main()
