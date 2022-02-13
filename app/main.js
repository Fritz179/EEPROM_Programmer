const {basename} = require('path')
const {readFileSync} = require('fs')
const write = require('./programmer');

const http = require('http');

if (process.argv.indexOf('-s') != -1) {
  http.createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    res.setHeader('Access-Control-Max-Age', 2592000); // 30 days

    let data = '';
    req.on('data', chunk => data += chunk)
    req.on('end', () => {
      const bytes = JSON.parse(data)

      console.log('Issued writing command\n');
      const errors = write(bytes, 'webservice', true)
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


