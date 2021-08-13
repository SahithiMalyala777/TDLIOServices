
const libState = require("@adobe/aio-lib-state");
var rp = require("request-promise");


async function resolve(params) {

    try {
        console.log("1");
        var data = {
	"id": {
		"thirdPartyId": "c7c7996b92468c931629c5c700be567c"
	},
	"context": {
		"channel": "web",
		"address": {
			"url": "/vault"
		},
		"screen": {
			"width": 1200,
			"height": 1400
		}
	},
	"execute": {
		"mboxes": [{
			"name": "BirthdayOffers",
			"index": 1,
			"profileParameters": {},
			"parameters": {
				"pageinfo.pagename": "BirthdayOffers"
			}
		}]
	}
}

        var options = {
            method: "POST",
            uri: 'https://tatadigital.tt.omtrdc.net/rest/v1/delivery?client=tatadigital&sessionId=382f7030e650379b9a88099e97b52e0c&version=2.3.2',
            body: data,
            json: true, // Automatically stringifies the body to JSON
        };
        console.log("2");
        let targetResponse = await rp(options);
        console.log("3");
        return {
            statusCode: 200,
            body: { result: targetResponse }
        };
    } catch (e) {
        console.log(e);
        return {
            statusCode: 500,
            body: {
                payload: e,
            }
        }
    }
};

module.exports.main = resolve;