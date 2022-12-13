const fs = require('fs')
const { SocketAddress } = require('net')
const { setPriority } = require('os')

const {readPin, writePin} = require('./raspy')
const wait = require('./wait')
const PATH = __dirname + '/cache/'

// function cut(n, to) {
//   return Math.floor(n * 10 ** to) / 10 ** to
// }

// module.exports = (data, name, rewrite) => {
//   const path = PATH + name + '.hex'
//   const exists = !rewrite && fs.existsSync(path)
//   const parse = l => l.split(',').map(n => n ? parseInt('0x' + n) : null)
//   const oldData = exists ? parse(fs.readFileSync(path).toString()) : []

//   if (exists) console.log(`\nUsing old EEPROM ${name}, use -r to rewrite all!`)


//   const len = data.filter(el => el != null).length

//   // Write
//   const start = Date.now()
//   console.log(`\nWriting start of: ${len} bytes`)
//   const wlen = writeData(data, oldData)
//   if (wlen != len) console.log(`Written only ${wlen} bytes instead of ${len}\n`)

//   // Read
//   const readStart = Date.now()
//   console.log('Starting Readback\n')
//   const errors = checkData(data)
//   const end = Date.now()

//   if (!errors) {
//     console.log('Data written succesfully!\n')
//   } else {
//     console.log(`Error rate: ${cut(errors / len * 100, 1)}%`)
//   }

//   const writeTime = cut((readStart - start) / 1000, 3)
//   const readTime = cut((end - readStart) / 1000, 3)
//   const totalTime = cut((end - start) / 1000, 3)
//   const writePercent = cut(writeTime / totalTime * 100, 0)
//   const writeSpeed = cut(wlen / writeTime, 0)
//   const readSpeed = cut(len / readTime, 0)

//   console.log(`Job done in ${totalTime} seconds, ${writePercent}% at writing`)
//   console.log(`Write speed = ${writeSpeed} bytes/s`)
//   console.log(`Read speed = ${readSpeed} bytes/s`)

//   data.length = 2 ** 13
//   const save = data.map(n => n != null ? n.toString(16) : '').join(',')
//   fs.writeFileSync(path, save)

//   return errors
// }

// function writeData(data, oldData) {
//   let wlen = 0

//   data.forEach((num, i) => {
//     if (num != null && num != oldData[i]) {
//       writeAt(i, num)
//       wlen++
//     } else {
//     }
//   })

//   return wlen
// }

// function checkData(data) {
//   let errors = 0
//   data.forEach((num, i) => {
//     if (num != null) {
//       const value = readAt(i)
//       if (value != num) {
//         errors ++
//         const at = i.toString(2).padStart(16, 0)
//         console.log(`Got value: ${value} but expected: ${num} at:0b`.padEnd(40, ' ') + at)
//       }
//     }
//   })

//   return errors
// }

// const pinCP = 2
// const pinCP_0 = 3
// const pinCP_1 = 4
// const pinCP_2 = 5

// const pinBus = [8, 9, 10, 11, 12, 13, 14, 15]

// const clockRegisters = 0
// const clockRAM_L = 2
// const clockRAM_H = 3
// const clockMAR_L = 4
// const clockMAR_H = 5
// const clockEEPROM_W = 6
// const clockEEPROM_R = 7

// const writeMode = 0b11100001
// const readRAM_L = 0b10111111
// const readRAM_H = 0b01111111


// function writeAt(address, value) {
//   setOutputMode(writeMode)
//   writeAddr(address)
//   writeByte(value)

//   clockPin(clockEEPROM_W)
// }

// function readAt(address) {
//   writeAddr(address)
//   getByte()

//   clockPin(clockEEPROM_R, true)
//   const ret = getByte()
//   writePin(pinCP, 1)

//   return ret
// }

// function setOutputMode(mode) {
//   writeByte(mode)
//   clockPin(clockRegisters)
// }

// function clockPin(clock, keep) {
//   writePin(pinCP_0, clock & 1 ? 1 : 0)
//   writePin(pinCP_1, clock & 2 ? 1 : 0)
//   writePin(pinCP_2, clock & 4 ? 1 : 0)
//   wait(1250)
//   writePin(pinCP, 0)
//   wait(1250)
//   if (keep) return
//   writePin(pinCP, 1)
//   wait(1250)
// }

// function writeAddr(address) {
//   writeByte(address & 255)
//   wait(1250)
//   clockPin(clockMAR_L)
//   writeByte((address >> 8) & 255)
//   wait(1250)
//   clockPin(clockMAR_H)
// }

// function writeByte(value) {
//   for (let i = 0; i < 8; i++) {
//     writePin(pinBus[0] + i, value & (1 << i))
//   }
// }

// function getByte(value) {
//   let ret = 0
//   for (let i = 0; i < 8; i++) {
//     ret |= readPin(pinBus[0] + i) << i
//   }

//   return ret
// }

// setInterval(() => {
//   setOutputMode(writeMode)
// }, 200)

// const fast = 100000
// const fast = 1000000

// // Setup MAR and Data
// writeByte(0b11100101)
// wait(fast)
// console.log(getByte());
// wait(100000)
// console.log('Test: ' + 0b11100101 + ' = ', getByte());
// writePin(pinCP_0, 0)
// writePin(pinCP_1, 0)
// writePin(pinCP_2, 0)
// wait(fast)
// writePin(pinCP, 0)
// wait(fast)
// writePin(pinCP, 1)
// wait(fast)
// writeAddr(0b1010101010101010)
// wait(fast)
// writeByte(0b11001100)
// wait(slow)
// console.log('MAR & DATA WIRTTEN', 0b11001100);

// // Write clock pulse
// writePin(pinCP_0, 0)
// writePin(pinCP_1, 1)
// writePin(pinCP_2, 1)
// wait(fast)
// writePin(pinCP, 0)
// wait(slow)
// writePin(pinCP, 1)
// wait(fast)

// console.log('EEPROM WRITTEN');

// // Output byte
// writeByte(0b10111111)
// wait(fast)
// writePin(pinCP_0, 1)
// writePin(pinCP_1, 1)
// writePin(pinCP_2, 1)
// wait(fast)
// writePin(pinCP, 0)
// wait(fast)
// writePin(pinCP, 1)
// wait(fast)

// console.log('EEPROM OUTPUTTING');

// // read byte
// let ret = getByte()
// console.log('ret1: ', ret);
// wait(slow)

// ret = getByte()
// console.log('ret2: ', ret);

// setOutputMode(writeMode)


const pinCP = 2
const pinCP_0 = 3
const pinCP_1 = 4
const pinCP_2 = 5

const pinBus = 8

const clockController = 0
const clockRAM_L = 2
const clockRAM_H = 3
const clockMAR_L = 4
const clockMAR_H = 5
const clockEEPROM_W = 6
const clockEEPROM_R = 7

const writeMode = 0b11100001
const readMode =  0b10100111

function writeByte(value) {
  for (let i = 0; i < 8; i++) {
    writePin(pinBus + i, value & (1 << i) ? 1 : 0)
  }
}

function readByte() {
  let ret = 0
  for (let i = 0; i < 8; i++) {
    ret |= readPin(pinBus + i) << i
  }

  return ret
}

// clock a pin
function clockPin(pin) {
  writePin(pin, 0)
  wait(10000)
  writePin(pin, 1)
  wait(10000)
}

// set the 3 pin for output controller
function setOutptut(mask) {
  writePin(pinCP_0, mask & 1 ? 1 : 0)
  writePin(pinCP_1, mask & 2 ? 1 : 0)
  writePin(pinCP_2, mask & 4 ? 1 : 0)
  wait(10000)
}

// clock the output controller
function clockOutput(mask) {
  setOutptut(mask)
  clockPin(pinCP)
}

function setMode(mode) {
  writeByte(mode)
  wait(10000)
  clockOutput(clockController)
}

function setAddres(address) {
  writeByte(address & 255)
  wait(1250)
  clockOutput(clockMAR_L)
  writeByte((address >> 8) & 255)
  wait(1250)
  clockOutput(clockMAR_H)
}

const slow = 1000000

const data = 16
const address = 0
const write = false

// Set address
setMode(writeMode)
setAddres(address)


// write the data
console.log(`Writing: `, data);

// write to the register to the ram
writeByte(data)
wait(1250)
clockOutput(clockRAM_L)

// write the EEPROM
wait(slow)
if (write) {
  setOutptut(clockEEPROM_W)
  writePin(pinCP, 0)
  wait(1000)
  writePin(pinCP, 1)
  wait(slow)
}

// set read mode
console.log('Rading started');
setMode(readMode)
setOutptut(clockEEPROM_R)
writePin(pinCP, 0)
wait(slow)
const read = readByte()
console.log(`Read back: `, read);
wait(slow)
writePin(pinCP, 1)



setMode(writeMode)