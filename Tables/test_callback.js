const https = require('https');
const httpUrl = require('url');

KEY = "LocalKey/07ebcef3db1962e500f716d70859ab72";


function httpPost(urlPath, postJsonBody, callbackFn) {
    var options, request;
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    options = httpUrl.parse(urlPath);
    options.method = "POST";
    options.rejectUnauthorized = false;
    options.headers = {
      'ZBIO_CLUSTER_KEY': KEY,
      'Content-Type': 'application/json'
    };
      
      const req = https.request(options, (res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);
      var data = "";
        res.on('data', (d) => {
          data += d;
        });
        data = JSON.stringify(data)
        data = data.slice(0,2)
        console.log(data)
        
        res.on('end', () => {
            console.log(data)
        });
      });
      
      req.on('error', (e) => {
        console.error(e);
      });
      req.end();


    // request = https.request(options, function(response) {
    //   var responseChunks;
    //   responseChunks = [];
    //   response.setEncoding('utf8');
    //   response.on('data', function(chunk) {
    //     responseChunks.push(chunk);
    //   });
    //   response.on('end', function() {
    //     var body, e;
    //     console.log(response)
    //     console.log(response.statusCode)
    //     if (response.statusCode === 200) {
    //       body = responseChunks.join('');
    //       try {
    //         body = JSON.parse(body);
    //         console.log("parsebody: ")
    //         console.log(body)
    //       } catch (error) {
    //         e = error
    //         callbackFn("", 'Error parsing JSON!', e);
    //         return;
    //       }
    //       try {
    //         console.log("callback body: ")
    //         console.log(body)
    //         callbackFn(body);
    //       } catch (error) {
    //         e = error;
    //         callbackFn("", 'Some error, try again', e);
    //       }
    //     } else {
    //       return callbackFn("", 'Status:', response.statusCode);
    //     }
    //   });
    // });
    // console.log("JSONBody: ")
    // console.log(postJsonBody)
    // request.write(postJsonBody);
    // request.end();
    // return request.on('error', function(e) {
    //   console.error(e);
    //   callbackFn("", 'error', e);
    // });
  }

function refreshImages() {
    console.log("Refresh Images called");
    return httpPost("https://localhost:60001/api/namespaces", "{}", function(responseJson, message, e) {
        // console.log("output: "+ responseJson);
      if (e != null) {
          console.log(e)
        if ((e.message != null) && (e.message.indexOf("ECONNREFUSED") !== -1 || e.message.indexOf("socket hang up") !== -1 || e.message.indexOf("RoostLocalKey") !== -1)) {
          console.log('errorTextDeleteImages', "Make sure Roost Engine(ZKE) is running.");
        } else {
          console.log('errorTextDeleteImages', "Could not process, try again: " + e.message);
        }
      } else if (message != null) {
        console.log('errorTextDeleteImages', "Could not process: " + message);
      } else if (responseJson != null) {
        if ((responseJson.ResponseCode != null) && responseJson.ResponseCode === 0) {
          console.log(responseJson);
        } else {
          console.log('errorTextDeleteImages', responseJson.ResponseDescription);
        }
      } 
    });
  }

  refreshImages()