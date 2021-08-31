var CryptoJS = require("crypto-js");
var rp = require("request-promise");

const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1 } = require('uuid');


const regex = /"/ig;

async function resolve(params) {

    console.log('Azure Blob storage v12');

    var fileName = params.fileName;

    // Quick start code goes here
    // Create the BlobServiceClient object which will be used to create a container client
    const blobServiceClient = BlobServiceClient.fromConnectionString("DefaultEndpointsProtocol=https;AccountName=statddevdeciaemlrs01;AccountKey=YglJSjxYI6KirviDU37QoKfLRD2PYi2y9ifRMzlm+V68zfo8a8+BIMew4o2rkzFEiDT7tdsOCsInOunTa/Tzww==;EndpointSuffix=core.windows.net");

    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient("datapowered");
    //console.log(containerClient);

    //console.log('\nListing blobs...');
    let iter = containerClient.listBlobsFlat({ prefix: fileName + "/" });
    //console.log("Retrieving folder contents");
    var responses = [];
    for await (const item of iter) {
        //responses.push(item.name);
        if (item.name.includes('.csv')) {
            responses.push(item.name);
            const blockBlobClient = containerClient.getBlockBlobClient(item.name);
            const downloadBlockBlobResponse = await blockBlobClient.download(0);
            //console.log('\t Retrieving data');
            var data = await streamToString(downloadBlockBlobResponse.readableStreamBody);
            //console.log("data: " + data);

            // var data = params.__ow_body;
            var finalJSON = [];
            const lines = data.toString().split('\n');
            var headerLine = lines[0];
            var headers = headerLine.replace(regex, '').split(",");
            //console.log("headers: " + headerLine);
            var customerHashIndex = 0;

            for (let headerIndex = 0; headerIndex < headers.length; headerIndex++) {
                if (headers[headerIndex] == "customerHash") {
                    customerHashIndex = headerIndex;
                    break;
                }
            }

            console.log("Customer Hash Index: " + customerHashIndex);
            console.log("Lines Length: " + lines.length);

            for (let i = 1; i < lines.length; i++) {
                var lineElements = lines[i].replace(regex, '').split(',');
                var userJSON = {};
                //console.log("row " + i + ": " + JSON.stringify(userJSON));
                console.log("CustomerHash: " + lineElements[customerHashIndex]);
                responses.push(lineElements[customerHashIndex]);
                var index = 0;
                for (let j = 0; j < headers.length; j++) {

                    if (j != customerHashIndex) {
                        userJSON[headers[j]] = lineElements[j];
                        index = index + 1;
                    }
                    if (index >= 40) {
                        var targetResponse = await postToTarget(lineElements[customerHashIndex], userJSON);
                        if (targetResponse.error) {
                            responses.push(targetResponse);
                        }
                        userJSON = {};
                        index = 0;
                    }
                }

            }
        }
    }
    return {
        statusCode: 200,
        body: {
            error: false,
            //payload: data,
            responses: responses
        }
    }

};

// A helper function used to read a Node.js readable stream into a string
async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
            chunks.push(data.toString());
        });
        readableStream.on("end", () => {
            resolve(chunks.join(""));
        });
        readableStream.on("error", reject);
    });
}

async function postToTarget(customerHash, profileData) {
    try {
        var sessionId = CryptoJS.MD5(customerHash);
        console.log("1");
        console.log("Customer hash: " + customerHash);
        var targetRequest = {
            "id": {
                "thirdPartyId": customerHash,
                "tntId": customerHash
            },
            "context": {
                "channel": "web",
                "address": {
                    "url": "/C360CustomerData"
                },
                "screen": {
                    "width": 1200,
                    "height": 1400
                }
            },
            "execute": {
                "mboxes": [{
                    "name": "profileMbox",
                    "index": 0,
                    "profileParameters": profileData,
                    "parameters": {

                    }
                }]
            }
        }
        console.log(JSON.stringify(targetRequest));
        var url = 'https://tatadigital.tt.omtrdc.net/rest/v1/delivery?client=tatadigital&sessionId=' + sessionId + '&version=2.3.2';
        console.log(url);
        console.log("Printing Options");
        var options = {
            method: "POST",
            uri: 'https://tatadigital.tt.omtrdc.net/rest/v1/delivery?client=tatadigital&sessionId=' + sessionId + '&version=2.3.2',
            body: targetRequest,
            json: true, // Automatically stringifies the body to JSON
        };
        //console.log(JSON.stringify(options));
        console.log("2");
        let targetResponse = await rp(options);
        console.log("3");
        console.log(targetResponse);

        return { request: options, response: targetResponse };

    } catch (e) {
        console.log(e);
        return { request: options, error: e };
    }
}

module.exports.main = resolve;
