const libState = require("@adobe/aio-lib-state");
var rp = require("request-promise");

async function main(params) {
  let targetRequest = params.payload;
  let mbox = params.mbox;
  try {
    let parameters = params.execute.mboxes[0].parameters;
  } catch (e) {
    return {
      statusCode: 200,
      body: {
        error: true,
        message: "Execute Object cannot be empty, it should have mboxes and parameters defined"
      },
    };
  }

  if(mbox == 'BIRTHDAY_OFFER'){
      return {
        statusCode: 200,
        body: {
          error: false,
          message: "Birthday Widget Offers"
        },
      };
      
  }else{
    return {
      statusCode: 200,
      body: {
        error: false,
        message: "Birthday Message Offers"
      },
    };
  }

  return {
    statusCode: 200,
    body: {
      error: false,
      payload: offersData,
      logMessage: logMessage,
    },
  };
}
module.exports.main = resolve;
