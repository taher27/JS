var URL = 'https://localhost:60001';
var KEY = "LocalKey/07ebcef3db1962e500f716d70859ab72";



function startDocker() {}
function stopDocker() {}
function restartDocker() {}
function deleteDocker() {}

function listDockerImages() {
  var out = "";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState === 4) {  
          if (this.status === 200) {
              data = JSON.parse(this.responseText);

              <div class="imageDetails" id="container">
                <div class="imgDetails" id="dockerDetails">
                    <div class="containerIcon">
                        <i class="fa fa-cube" aria-hidden="true" style="color: green; font-size: 30px;"></i>
                    </div>
                    <div class="containerDetails">
                        <p>imageName <span>html_image:v1</span></p>
                        <p>RUNNING <span>PORT: 8080</span></p>
                    </div>
                </div>
                <div class="dockerFunctions" id="">
                    <button> <i class="fa fa-terminal icons" aria-hidden="true"></i> </button>
                    <button> <i class="fa fa-play-circle-o icons" aria-hidden="true"></i> </button>
                    <button> <i class="fa fa-stop-circle-o icons" aria-hidden="true"></i> </button>
                    <button> <i class="fa fa-repeat icons" aria-hidden="true"></i> </button>
                    <button> <i class="fa fa-trash icons" aria-hidden="true"></i> </button>
                </div>
            </div>
              console.log(data)
          } else {
             
          }
      }
    };
       
      xmlhttp.open('POST', `https://localhost:60001/api/listContainer`, true);
      xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xmlhttp.setRequestHeader('ZBIO_CLUSTER_KEY', KEY);
      xmlhttp.send();
}

listDockerImages();


// var httpPost = function(urlPath, postJsonBody, callbackFn) {
//     var options, request, self;
//     process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
//     options = url.parse(urlPath);
//     options.method = "POST";
//     options.rejectUnauthorized = false;
//     options.headers = {
//       'ZBIO_CLUSTER_KEY': this.restAPIKey,
//       'Content-Type': 'application/json'
//     };
//     self = this;
//     request = https.request(options, function(response) {
//       var responseChunks;
//       responseChunks = [];
//       response.setEncoding('utf8');
//       response.on('data', function(chunk) {
//         responseChunks.push(chunk);
//       });
//       response.on('end', function() {
//         var body, e;
//         if (response.statusCode === 200) {
//           body = responseChunks.join('');
//           try {
//             body = JSON.parse(body);
//           } catch (error) {
//             e = error
//             callbackFn("", 'Error parsing JSON!', e);
//             return;
//           }
//           try {
//             callbackFn(body);
//           } catch (error) {
//             e = error;
//             callbackFn("", 'Some error, try again', e);
//           }
//         } else {
//           return callbackFn("", 'Status:', response.statusCode);
//         }
//       });
//     });
//     request.write(postJsonBody);
//     request.end();
//     return request.on('error', function(e) {
//       console.error(e);
//       callbackFn("", 'error', e);
//     });
//   }
