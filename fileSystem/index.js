const fs = require('fs')

const path = './file.json'

try {
  if (fs.existsSync(path)) {
    //file exists
    var fileContent = fs.readFileSync(path, 'utf8')
    data = JSON.parse(fileContent)
    console.log('file data: ', data)
  }
  else {
      fileStructure = {
        "yaml" : [{
          "source": null,
          "yaml": "",
          "namespace": 0,
          "status": ""
        }],
        "image" : [{
          "source": null,
          "dockerImages": "",
          "status": ""
        }]
      }
    
      input = JSON.stringify(fileStructure)
    fs.writeFileSync(path, input, (err) => {
        if(err) {
            console.log(err)
        }
    })
    console.log('new file created with data.')
  }
} catch(err) {
  console.error(err)
}

function updateRoostConfig(projectPath, responseObj) {
    try {
        if (fs.existsSync(path)) {
            //file exists
            var fileContent = fs.readFileSync(path, 'utf8')
            data = JSON.parse(fileContent)
            console.log('file data: ', data)
            yaml = data.yamlConfig
            image = data.imageConfig
            obj = {}

            yaml.forEach(item => {
                if(item === "") {
                // if responseObj yaml exist update status
                yaml.status = responseObj.status
                }
                else {
                    obj = {
                        "source": responseObj.source,
                        "yaml": responseObj.yaml,
                        "namespace": responseObj.namespace,
                        "status": responseObj.status
                    }
                    yaml.push(obj)
                }
            });

            image.forEach(item => {
                if(item === "") {
                // if responseObj image exist update status
                image.status = responseObj.status
                }
                else {
                    obj = {
                        "source": responseObj.source,
                        "dockerImages": responseObj.imageName,
                        "status": responseObj.status
                    }
                    image.push(obj)
                }
            });

            input = JSON.stringify(obj)
            fs.writeFileSync(path, input, (err) => {
                if(err) {
                    console.log("err: ",err)
                }
            })
        }
        else {
            fileStructure = {
              "yamlConfig" : [{
                "source": null,
                "yaml": "",
                "namespace": "",
                "status": ""
              }],
              "imageConfig" : [{
                "source": null,
                "dockerImages": "",
                "status": ""
              }]
            }
          
            input = JSON.stringify(fileStructure)
            fs.writeFileSync(path, input, (err) => {
                if(err) {
                    console.log(err)
                }
            })
          console.log('new file created with data.')
        }
    } catch(err) {
        console.error(err)
    }  
}