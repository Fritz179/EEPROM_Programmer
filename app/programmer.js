const {readPin, writePin} = require('./raspy');
const wait = require('./wait');
const SECOND = 1000000

function cut(n, to) {
  return Math.floor(n * 10 ** to) / 10 ** to
}

module.exports = data => {
  const len = data.length

  // Write
  const start = Date.now()
  console.log(`\nWriting start of: ${data.length} bytes\n`);
  writeData(data)

  // Read
  const readStart = Date.now()
  console.log('Starting Readback\n');
  const errors = checkData(data)
  const end = Date.now()

  if (!errors) {
    console.log('Data written succesfully!\n');
  } else {
    console.log(`Error rate: ${cut(errors / len * 100, 1)}%`);
  }

  const writeTime = cut((readStart - start) / 1000, 3)
  const readTime = cut((end - readStart) / 1000, 3)
  const totalTime = cut((end - start) / 1000, 3)
  const writePercent = cut(writeTime / totalTime * 100, 0)
  const writeSpeed = cut(len / writeTime, 0)
  const readSpeed = cut(len / readTime, 0)

  console.log(`Job done in ${totalTime} seconds, ${writePercent}% at writing`);
  console.log(`Write speed = ${writeSpeed} bytes/s`);
  console.log(`Read speed = ${readSpeed} bytes/s`);
}

function writeData(data) {
  data.forEach((num, i) => {
    writeAt(i, num)
  })
}

function checkData(data) {
  let errors = 0
  data.forEach((num, i) => {
    const value = readAt(i)
    if (value != num) {
      errors ++
      const at = i.toString(2).padStart(16, 0)
      console.log(`Got value: ${value} but expected: ${num} at:0b`.padEnd(40, ' ') + at);
    }
  })

  return errors
}

const writePinNum = 2
const readPinNum = 3
const highPinNum = 4
const lowPinNum = 5
const bit0PinNum = 8

function writeAt(address, value) {
  writeAddr(address)
  writeByte(value)

  writePin(writePinNum, 0)
  writePin(writePinNum, 1)
}

function readAt(address) {
  writeAddr(address)
  getByte()
  writePin(readPinNum, 0)
  const ret = getByte()
  writePin(readPinNum, 1)
  return ret
}

function writeAddr(address) {
  writeByte(address & 255)
  wait(1250)
  clock(lowPinNum)
  writeByte((address >> 8) & 255)
  wait(1250)
  clock(highPinNum)
}

function clock(pin) {
  writePin(pin, false)
  wait(200)
  writePin(pin, true)
  wait(1250)
}

function writeByte(value) {
  for (let i = 0; i < 8; i++) {
    writePin(bit0PinNum + i, value & (1 << i))
  }
}

function getByte(value) {
  let ret = 0
  for (let i = 0; i < 8; i++) {
    ret |= readPin(bit0PinNum + i) << i
  }

  return ret
}
