const {readPin, writePin, writeBytePin} = require('./raspy');
const wait = require('./wait');
const SECOND = 1000000

function cut(n, to) {
  return Math.floor(n * 10 ** to) / 10 ** to
}

module.exports = async (data) => {
  const len = data.filter(el => typeof el != 'undefined').length

  // Write
  const start = Date.now()
  console.log(`\nWriting start of: ${data.length} bytes\n`);
  await writeData(data)

  // Read
  const readStart = Date.now()
  console.log('Starting Readback\n');
  const errors = await checkData(data)
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

async function writeData(data) {
  let counter = 0

  for (let i = 0; i < data.length; i++) {
    if (typeof data[i] == 'undefined') continue

    counter++
    await writeAt(i, data[i])
  }

  return counter
}

async function checkData(data) {
  let errors = 0

  for (let i = 0; i < data.length; i++) {
    if (typeof data[i] == 'undefined') continue

    const value = await readAt(i)
    if (value != data[i]) {
      errors ++
      const at = i.toString(2).padStart(16, 0)
      console.log(`Got value: ${value} but expected: ${data[i]} at:0b`.padEnd(40, ' ') + at);
    }
  }

  return errors
}

const writePinNum = 2
const readPinNum = 3
const highPinNum = 4
const lowPinNum = 5
const bit0PinNum = 8

async function writeAt(address, value) {
  await writeAddr(address)
  await writeByte(value)

  await writePin(writePinNum, 0)
  await writePin(writePinNum, 1)
}

async function readAt(address) {
  await writeAddr(address)
  await getByte()
  await writePin(readPinNum, 0)
  const ret = await getByte()
  await writePin(readPinNum, 1)
  return ret
}

async function writeAddr(address) {
  await writeByte(address & 255)
  wait(1250)
  await clock(lowPinNum)
  await writeByte((address >> 8) & 255)
  wait(1250)
  await clock(highPinNum)
}

async function clock(pin) {
  await writePin(pin, false)
  wait(200)
  await writePin(pin, true)
  wait(1250)
}

async function writeByte(value) {
  await writeBytePin(value, bit0PinNum)
  // for (let i = 0; i < 8; i++) {
  //   writePin(bit0PinNum + i, value & (1 << i))
  // }
}

async function getByte(value) {
  let ret = 0
  for (let i = 0; i < 8; i++) {
    ret |= await readPin(bit0PinNum + i) << i
  }

  return ret
}
