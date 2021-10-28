const fs = require('fs')
const {join} = require('path')

const PATH = '/sys/class/gpio'
const exported = {}
const directions = {}

const GPIO_to_PIN = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]

function debug(msg) {
  // console.log(msg)
}

function exportPin(pin) {
  if (exported[pin]) return

  debug('exporting pin: ' + pin)
  fs.writeFileSync(PATH + '/export', pin.toString())
  exported[pin] = true

  debug('exported: ' + pin)
}

function unexportAll() {
  debug(exported)

  Object.keys(exported).forEach(pin => {
    fs.writeFileSync(PATH + '/unexport', pin.toString())
    delete exported[pin]
  })

  debug('unexported all')

  fs.readdirSync(PATH).forEach(file => {
    const match = file.match(/gpio([0-9]+)/)
    if (match) {
      console.log(`Unexporting ununexported pin: ${match[1]}`);
      fs.writeFileSync(PATH + '/unexport', match[1])
    }
  })
}

unexportAll()
process.on('exit', unexportAll)

function setDirection(pin, direction) {
  if (directions[pin] == direction) return

  debug(`direction: ${pin} = ${direction}`)
  directions[pin] = direction
  fs.writeFileSync(`${PATH}/gpio${pin}/direction`, direction)
}

function readPin(pin) {
  exportPin(pin)
  setDirection(pin, 'in')

  const value = fs.readFileSync(`${PATH}/gpio${pin}/value`)
  debug(`Read: ${pin} = ${value.toString()[0]}`)

  return value.toString()[0] == '1'
}

function writePin(pin, value) {
  exportPin(pin)
  setDirection(pin, 'out')

  value = value ? '1' : '0'
  debug(`Write: ${pin} = ${value}`)
  fs.writeFileSync(`${PATH}/gpio${pin}/value`, value)
}

async function writeBytePin(value, startPin) {
  const values = []
  for (let i = 0; i < 8; i++) {
    values[i] = value & (1 << i)
  }

  await Promise.all(values.map((val, i) => {
    const pin = startPin + i
    exportPin(pin)
    setDirection(pin, 'out')

    val = val ? '1' : '0'
    debug(`Write: ${pin} = ${val}`)
    return new Promise(resolve => {
      fs.writeFile(`${PATH}/gpio${pin}/value`, val, resolve)
    })
  }))
}

function setDirectionByte() {

}

module.exports = {
  readPin, writePin, exportPin, setDirection, writeBytePin
}
