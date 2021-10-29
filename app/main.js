const {basename} = require('path')
const {readFileSync} = require('fs')
const write = require('./programmer');

function random(max) {
  return Math.floor(Math.random() * max)
}

const rewrite = process.argv.includes('-r')
const i = process.argv.indexOf('-i')
const name = process.argv[i + 1]
if (!i || !name) logHelp()

if (process.argv.indexOf('-h') != -1) logHelp()

const arr = readFileSync(name).toString().split(',')

const parse = n => Number.isNaN(parseInt('0x' + n)) ? null : parseInt('0x' + n)
const data =  arr.map(parse)

if (!data) logHelp()


function logHelp() {
  console.log(`Help page for Fritz EEPROM Programmer
    -i <name>     Input file name to write
    -r            Optional, used to force an entire rewrite `);
  process.exit()
}

// Write data
write(data, basename(name), rewrite)
