const https = require("https");
var CryptoJS = require("crypto-js");
var rp = require("request-promise");
const libState = require("@adobe/aio-lib-state");

const JSON_IDS_KEY = "EBO_OFFER_IDS";

async function resolve(params) {
  var logMessage = [];
  let offerId = params.offer.offerId;
  let state = await libState.init();
  let offers = [];
  let recentOffers = [];
  let offerJSON;
  try {
    {
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
      offerJSON = await state.get(offerId);
    }
    let targetResponse;
    {
      for (var i = offers.length - 1; i > 0; i--) {
        if (recentOffers.length == 5) break;
        recentOffers.push(await state.get(offers[i]));
      }
      targetResponse = updateOfferById(recentOffers);
    }
    return {
      statusCode: 200,
      body: {
        error: false,
        payload: offerJSON,
        offers: offers,
        recentOffers: recentOffers,
        targetResponse: targetResponse
      },
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: {
        error: false,
        payload: params,
      },
    };
  }
}

async function updateOfferById(offerContent) {
  try {
    console.log("updateOfferById 1");

    var bodyJson = {
      name: "Birthday Offers from Adobe IO",
      content: offerContent,
    };
    console.log("updateOfferById body Json :" + JSON.stringify(bodyJson));
    var options = {
      method: "PUT",
      url: "https://mc.adobe.io/tatadigital/target/offers/json/455160",
      headers: {
        "Content-Type": "application/vnd.adobe.target.v2+json",
        "X-Api-Key": "fa8aa124c68a470780fa43721d900bd1",
        Authorization:
          "Bearer eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEta2V5LTEuY2VyIn0.eyJpZCI6IjE2MjM3NDc0NzgzMjBfZDYyZWExMmQtN2Q5MS00MDg1LWIwMmEtZGMyM2M5MzkzNTA2X3VlMSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJmYThhYTEyNGM2OGE0NzA3ODBmYTQzNzIxZDkwMGJkMSIsInVzZXJfaWQiOiJBMUE5MTZCNDYwQkRFRkQ2MEE0OTVFRjRAdGVjaGFjY3QuYWRvYmUuY29tIiwiYXMiOiJpbXMtbmExIiwiYWFfaWQiOiJBMUE5MTZCNDYwQkRFRkQ2MEE0OTVFRjRAdGVjaGFjY3QuYWRvYmUuY29tIiwiZmciOiJWUVhaU1FISUhMRzdOWFVDQ01aQkJIUUFCVT09PT09PSIsIm1vaSI6Ijc0M2FlYzJhIiwiZXhwaXJlc19pbiI6Ijg2NDAwMDAwIiwic2NvcGUiOiJvcGVuaWQsQWRvYmVJRCx0YXJnZXRfc2RrLHJlYWRfb3JnYW5pemF0aW9ucyxhZGRpdGlvbmFsX2luZm8ucm9sZXMsYWRkaXRpb25hbF9pbmZvLnByb2plY3RlZFByb2R1Y3RDb250ZXh0IiwiY3JlYXRlZF9hdCI6IjE2MjM3NDc0NzgzMjAifQ.ktaAPRSoXrbhyqicRllpqN0NKhFGh15Fql0W2umWedeoy7PGD2QkFd6EsMfqXUjmgH-qYSeUUA8Hk9qgx1wrQu28kWITXYJ9dTNIH_kQdm0J8o1K2yaBQRs7vfWAphhR0fyOJDTENm58NtKjz-VRJj_Ycb3P8G0gy1I3G5_SmuaX3pzdnTq5iatIE5dvohwX7ABlg_a22QeVtwCWck4PW09_7nHdCVDtlGDDsh3Tm95PFCHNRFeI3bSn9b7Qevn1WgIFgbHB0yRQ68kjki7N8LPugEZIE__t_tzOt9gsB1_fSsnjWo0zWQ6J0o33Uzn0JSGHY4MFPQPP09Bh7ctWWQ",
      },
      body: JSON.stringify(bodyJson),
    };
    console.log("updateOfferById 2");
    let targetResponse = await rp(options);
    console.log("updateOfferById 3");
    console.log("updateOfferById " + targetResponse);
    return targetResponse;
  } catch (e) {
    console.log(e);
  }
}

async function generateBirthdayOffers(recentOffers){

  var jsonStructure = 
    {
      "ctaLabel": "Some Details",
      "catalog_item_id": "stbksfab-0bfd-5c0e-7a7d-7bee045eea71:Starbucks21",
      "offer_type": "Discount",
      "backgroundImageURL": "https://tatadigital-pre-prod-65b.adobecqms.net/content/dam/tcp/brands/starbucks/offers/digital-assets/sb3.jpg",
      "description": "Collect Stars as you go. Visit your nearest Starbucks store, spend min ₹1,200 in a single bill and get 2 Bonus Stars on us. T\u0026C apply",
      "collectedExpiryDate": "2021-06-30 23:59:00",
      "title": "2 Bonus Stars on bill of ₹1,200",
      "ctaType": "Internal",
      "PromotionShareType": "UNLIMITED",
      "brandLogo": "https://tatadigital-pre-prod-65b.adobecqms.net/content/dam/tcp/brands/logos/Tata-Cliq-Logo.png",
      "IsPromotionSharable": true,
      "programID": "stbksfab-0bfd-5c0e-7a7d-7bee045eea71",
      "brandName": "Starbucks",
      "customerActivationRequired": false,
      "offer_expiry_date": "2021-06-30 23:59:00",
      "ctaURL": "https://sit-r2.tatadigital.com/",
      "expiryDate": "2021-06-30T23:59:00Z"
    };

}

module.exports.main = resolve;
