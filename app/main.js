const {basename} = require('path')
const {readFileSync} = require('fs')
const write = require('./programmer');

const http = require('http');

if (process.argv.indexOf('-s') != -1) {

  let occupied = false
  http.createServer(function (req, res) {
    if (occupied) {
      res.statusCode = 200
      res.end('Success!');
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    res.setHeader('Access-Control-Max-Age', 2592000); // 30 days

    let data = '';
    req.on('data', chunk => data += chunk)
    req.on('end', () => {

      let bytes

      try {
        bytes = JSON.parse(data)
      } catch (error) {
        res.statusCode = 400
        console.log('Invalid data: ' + data);
        res.end('Error: Invalid data: ' + data);
        return
      }

      console.log('Issued writing command\n');
      occupied = true
      const errors = write(bytes, 'webservice', true)
      occupied = false
      console.log('\nWaiting for new commands');

      if (errors) {
        res.statusCode = 500
        res.end('Error: Writing error');
      } else {
        res.statusCode = 200
        res.end('Success!');
      }
    })
  }).listen(17980);
  console.log('Listening on port 17980');
} else {
  const rewrite = process.argv.includes('-r')
  const i = process.argv.indexOf('-i')
  const name = process.argv[i + 1]
  if (i == -1 || !name) logHelp()

  if (process.argv.indexOf('-h') != -1) logHelp()

  const arr = readFileSync(name).toString().split(',')

  const parse = n => Number.isNaN(parseInt('0x' + n)) ? null : parseInt('0x' + n)
  const data =  arr.map(parse)

  if (!data) logHelp()


  function logHelp() {
    console.log(`Help page for Fritz EEPROM Programmer
      -s            Listen on port 17980 for data

      -i <name>     Input file name to write
      -r            Optional, used to force an entire rewrite

      -h            Display this help page`);
    process.exit()
  }

  // Write data
  write(data, basename(name), rewrite)
}


