const https = require('https')

const data = JSON.stringify({
//   todo: 'Buy the milk'
})

const options = {
  hostname: 'localhost',
  port: 60001,
  path: '/api/namespaces',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const req = https.request(options, (res) => {
    let data = "";
    console.log(`statusCode: ${res.statusCode}`)
    console.log(`Header: ${JSON.stringify(res.headers)}`)
    res.on("data", chunk => {
        data += chunk;
    });
    res.on("end", () => {
        pods = JSON.parse(data);
        // console.log(pods)
    });
//   res.on('data', (d) => {
//     process.stdout.write(d)
//     console.log(JSON.parse(d))
//   })
})

req.on('error', (error) => {
  console.error(error)
})

req.write(data)
req.end()