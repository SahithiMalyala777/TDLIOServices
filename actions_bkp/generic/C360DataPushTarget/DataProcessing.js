var CryptoJS = require("crypto-js");
var rp = require("request-promise");

const regex = /"/ig;

async function resolve(params) {

    var data = params.__ow_body;
    var finalJSON = [];
    const lines = data.toString().split('\n');
    var headerLine = lines[0];
    var headers = headerLine.replace(regex, '').split(",");
    var responses = [];
    //console.log("headers: " + headerLine);

    for (let i = 1; i < lines.length; i++) {
        var lineElements = lines[i].replace(regex, '').split(',');
        var userJSON = {};
        for (let j = 1; j < headers.length; j++) {
            userJSON[headers[j]] = lineElements[j];
        }
        //console.log("row " + i + ": " + JSON.stringify(userJSON));
        finalJSON.push(userJSON);
        console.log("CustomerHash: "+lineElements[0]);
        var targetResponse = await postToTarget(lineElements[0], userJSON);
        responses.push(lineElements[0]);
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

async function postToTarget(customerHash, profileData) {
    try {
        var sessionId = CryptoJS.MD5(customerHash);
        console.log("1");
        console.log("Customer hash: "+customerHash);
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
        //console.log("Printing Options");
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

        return {request: options, response: targetResponse};

    } catch (e) {
        console.log(e);
    }
}

module.exports.main = resolve;
