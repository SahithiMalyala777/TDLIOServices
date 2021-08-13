var rp = require("request-promise");
var logMessage = [];
async function resolve(params) {
    logMessage = [];
    try {
        var options = {
            'method': 'GET',
            'url': 'https://dapi.tatadigital.com/api/v1/billpay/dwh/homepage',
            'headers': {
                'client_id': 'TCP-WEB-APP',
                'Authorization': 'Bearer ff510b86-7812-4624-8542-165341faf20d'
            }
        };
        let respnse = await rp(options);
        respnse = JSON.parse(respnse);
        delete respnse.status;
        logMessage.push(respnse);

        let targetResponse = postToTarget('088b4d9b642d5fc39b33a60a79ce08be', respnse);



        return {
            statusCode: 200,
            body: {
                error: false,
                params: params,
                res: respnse,
                log: logMessage,
                targetRes: targetResponse
            }
        };

    }
    catch (e) {
        console.log(e);
        return {
            statusCode: 500,
            body: {
                error: true,
                params: params,
                resErr: e
            }
        };
    }
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
                    "url": "/billpaymentsData"
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

        return { request: options, response: targetResponse };

    } catch (e) {
        console.log(e);
    }
}


module.exports.main = resolve;