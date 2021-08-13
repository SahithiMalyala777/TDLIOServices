const https = require("https");
var CryptoJS = require("crypto-js");
var rp = require("request-promise");
const libState = require("@adobe/aio-lib-state");

module.exports.saveOffer = async function (params) { 
    let offerId = params.offer.offerId;
    let state = await libState.init();
    //let key = await state.put("some_offer", JSON.stringify(offersData), {ttl: -1});
    let offers = [];

    //Retrieve all offer Ids
    let offersData = await state.get(JSON_IDS_KEY);
    if (!offersData || Object.keys(offersData).length == 0) {
      offers = [];
    } else {
      offers = offersData.value;
    }

    //Check if the current offer Id is there in memory
    {
      let offerJSON = await state.get(offerId);
      if (!offerJSON || Object.keys(offerJSON).length == 0) {
        offers.push(offerId);
      }
      await state.put(offerId, params.offer, { ttl: -1 });
    }

    await state.put(JSON_IDS_KEY, offers, { ttl: -1 });

    offersData = await state.get(JSON_IDS_KEY);
    let offerJSON = await state.get(offerId);

    return offerJSON;
};