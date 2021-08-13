const https = require("https");
var CryptoJS = require("crypto-js");
var rp = require("request-promise");
const auth = require("@adobe/jwt-auth");
//const _config=require("../authentication/configuration.js");
const libState = require("@adobe/aio-lib-state");

//console.adobe.io -> Integration -> Details

const _authconfig = {
  credentials: {
    clientId: "fa8aa124c68a470780fa43721d900bd1", //Application ID (Client ID)
    technicalAccountId: "A1A916B460BDEFD60A495EF4@techacct.adobe.com", //Technical account ID
    orgId: "EE3B6AAD5E1ED5570A495FA0@AdobeOrg", // Org ID
    clientSecret: "p8e-pHIptDTdEgaz66BpEoo4F9tgLjlu93FZ", //Client Secret
    metaScopes: "https://ims-na1.adobelogin.com/s/ent_marketing_sdk", // Metascopes
    privateKey: "-----BEGIN PRIVATE KEY-----\n" +
      "MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCRBhFq8pzBJL5ZFgQJavi+4qxX\n" +
      "HP10RnUTRFDE0N/VYsbMvXGnbBhB84JgfkflqYAybnAgvcUsZvazMBc5E6h5dKULuzV/IOoT/7F1\n" +
      "2W/H6f09Z4dAdmKUrJ2ZPgQUHSeGUiGZiCyqLPlo9Dx+E7tYp7/HUtmJaDZm76Po96lC4RdSvx7c\n" +
      "mTH8alpeCLX/LJA5W371eqQ6bbRpNPAYsN8rXRcQdfQNHpDsQz+EJq64v1Dl1UpDueOBBkXANaws\n" +
      "50rchOSn6hqV1gczW99fnKEeRNCfSsDCVGKjTX9w6d5totm+B84OoabhkS8js2NspdPf/prCRipX\n" +
      "epwKhXdDiBSvAgMBAAECggEAfm+M5fHpClbvgRm5oUBa54kV+cjzi9kVnxuTU1RLoW1BpySPHwkV\n" +
      "yQH1LA1Mv4TcmJtCNLleWwzVjnmh9YgW/PTeI/EufcyDZ7Yn0HgmhWOR/mPxPhk4byhjKkQwKB0W\n" +
      "5XtbgdCAKEmXlJJC3yRy1KNDhxLLR4nMzEenXqf1MLFfi/U/kOTvWCHZtzeFABecQtKMyHjJOYRq\n" +
      "CY5zCMbFmDAMzMbKgNoB9ZhxkMHyTE+OH7M5a0xCcFSGqSHb6nsAPYY9HtQgQaGPOp3DzakvTlVn\n" +
      "qqE3DpJ1u0DpLjr4MKUjIUgl0ABmPtUwksgIJf8j8b9arQgQZRSasOyuRwx6UQKBgQDHMys99feT\n" +
      "9t0+vo8E6RcpuUwgDhbMrqzMKKsGjnJjfcsMbWwaP4sbthZSeD+oO2wFoHbTUG9Jq0N7GMEOZBdK\n" +
      "BoyE8DDWmrEHMQHud6s/36MRbZYjNPIc6D7pxxzU/wAXZVRF41ucN+E8kdzg+TwC8xxusDFZ+hLs\n" +
      "ocdK8IvSpwKBgQC6YD66whPWKDTpJnh1aasWIwPjmf30Bbjjoyo2JDPV/H/1XnCj5nVL10FR/qyA\n" +
      "V+xTnxRly/xcHlcLqsg9Sq74V86quYhesvg6ORbRQRBScqa4XH6T+VjhRo2d/MKr8dOenOpAV5Wa\n" +
      "wyghKqVQf4E7M8tcOGv4a2XCdlEmM1mWuQKBgAFSep//qPQHeHJ5K1PaBDhXrYSs80PKiQUV5AS4\n" +
      "H1Q/uoBLnaMS9uZpL/6+I5YHRvFGnmNKrmJry5fekzF4QptQLdCYE4rpHfGxRpUBoFZdMqTj+FIl\n" +
      "gNHmTLyagLt9Mc/18ThBiRMhX9JaGYA4x0gxuueVLc6uFUAS1tLNg/ATAoGAE1XOzDM8OZh8PL/n\n" +
      "+U5YGHjTe3ZLWViKoNsZkvpYgleqsrr0dpx/CLoxJZ+FJ993Pgmf5Ruvd6MSJry1/13THyKE50NO\n" +
      "OXzZsbigfF8CoXsRfsjhvNo+dUiLgptpWstAyBDBYKF1fNPIQwCYm+xObOTnsQ6NbP0/VlhN/OeQ\n" +
      "4MkCgYBUr3rtB1Mb4ORMZeM9M9sWpQPDLQuczKpO05SRpiSDWyV3lPMPcn1iHNULBAVLhxnFA0vF\n" +
      "vqSY2zbQVxsO2XRhz+MNe/ftXRc2x4+4PhGXd7hCEJp+AOKLZlCFIF5M1YET7oOaPcMMYmb+zmmH\n" +
      "cKMp8crUjEyfWjyZtwjbiTAOVg==\n" +
      "-----END PRIVATE KEY-----\n"
  }
};

const JSON_IDS_KEY = "BIRTHDAY_OFFER_IDS";
var logMessage = [];
async function resolve(params) {
  logMessage = [];
  logMessage.push(params);

  var targetOfferId=params.targetOfferId;
  let offerId = params.offer.offerId;
  var processEnv = process.env;
  var namespace = processEnv.__OW_NAMESPACE;
  var auth = processEnv.__OW_API_KEY;

  let state = await libState.init({ ow: { namespace, auth } });
  let offers = [];
  let recentOffers = [];
  let offerJSON;
  try {
    {
      //Retrieve all offer Ids
      let offersData = await state.get(JSON_IDS_KEY);

      logMessage.push("OffersData:" + JSON.stringify(offersData));

      if (!offersData || Object.keys(offersData).length == 0) {
        offers = [];
      } else {
        offers = offersData.value;
      }

      logMessage.push("try 1");
      //Check if the current offer Id is there in memory
      
        logMessage.push(offerId);
        let offerJSON = await state.get(offerId);
        logMessage.push(offerJSON);
        if (!offerJSON || Object.keys(offerJSON).length == 0 || offerJSON == null) {
          logMessage.push("try 1.1");
          offers.push(offerId);
        }
        await state.put(offerId, params.offer, { ttl: -1 });
      
      logMessage.push("try 2");
      logMessage.push(offers);
      logMessage.push("try 2.1");

      await state.put(JSON_IDS_KEY, offers, { ttl: -1 });

      offersData = await state.get(JSON_IDS_KEY);
      logMessage.push(offersData);
      offerJSON = await state.get(offerId);
      logMessage.push("try 3");
      logMessage.push(offers);
    }
    let targetResponse;
    {
      for (var i = offers.length - 1; i >=0; i--) {
        if (recentOffers.length == 5) break;
        recentOffers.push(await state.get(offers[i]));
      }

      logMessage.push("try 4");
      var recentOffersUpdated = await generateBirthdayOffers(recentOffers);

      logMessage.push("try 5");

      targetResponse = updateOfferById(recentOffersUpdated,targetOfferId);
      logMessage.push("try 6");
      var processObj = process.env;
      logMessage.push("try 7");

    }
    return {
      statusCode: 200,
      body: {
        error: false,
        log: logMessage,
        params: params,
        recentOffersUpdated : recentOffersUpdated
      },
    };
  } catch (e) {
    logMessage.push(e);
    return {
      statusCode: 500,
      body: {
        error: true,
        payload: params,
        log: logMessage,
        recentOffersUpdated : recentOffersUpdated
      },
    };
  }
}

async function updateOfferById(offerContent,targetOfferId) {
  try {
    logMessage.push("updateOfferById 1");

    var bodyJson = {
      name: "Birthday Offers from Adobe IO",
      content: offerContent,
    };
    //logMessage.push("updateOfferById body Json :" + JSON.stringify(bodyJson));

    var authOptions = _authconfig.credentials;
    var accesstoken = await auth(authOptions);//.then(res => logMessage.push(res));
    logMessage.push(accesstoken);

    var options = {
      method: "PUT",
      url: "https://mc.adobe.io/tatadigital/target/offers/json/"+targetOfferId,
      headers: {
        "Content-Type": "application/vnd.adobe.target.v2+json",
        "X-Api-Key": "fa8aa124c68a470780fa43721d900bd1",
        Authorization:
          "bearer " + accesstoken.access_token
      },
      body: JSON.stringify(bodyJson),
    };
    logMessage.push("updateOfferById 2");
    let targetResponse = await rp(options);
    logMessage.push("updateOfferById 3");

    logMessage.push("updateOfferById " + targetResponse);
    return targetResponse;
    
  } catch (e) {
    logMessage.push(e);
  }
}

async function generateBirthdayOffers(recentOffers) {

  try {
    var updatedOffersContent = [];
    logMessage.push("recentOffers:" + recentOffers);

    for (var i = 0; i < recentOffers.length; i++) {
      logMessage.push("generateBirthdayOffers : 1");
      var offer = recentOffers[i].value;
      var jsonStructure =
      {
        "ctaLabel": offer.cta ? offer.cta.ctaLabel : "Buy Now",
        "catalog_item_id": offer.offerId,
        "offer_type": offer.offerType,
        "backgroundImageURL": offer.offerImage,
        "description": offer.description,
        "collectedExpiryDate": offer.collectedExpiryDate,
        "title": offer.imageTitle,
        "ctaType": offer.cta ? offer.cta.ctaType : "external",
        "PromotionShareType": "NonSharable",
        "brandLogo": offer.brandLogo,
        "IsPromotionSharable": offer.sharabilityDetails ? offer.sharabilityDetails.isSharable : false,
        "programID": offer.programId,
        "brandName": offer.brandTitle,
        "customerActivationRequired": false,
        "offer_expiry_date": offer.expiryDate,
        "ctaURL": offer.ctaUrl,
        "expiryDate": offer.expiryDate,
        "couponCode" :offer.couponId,
        "couponCodeType":offer.couponType
      }
      updatedOffersContent.push(jsonStructure);
      logMessage.push("generateBirthdayOffers : 2");
    }

    logMessage.push("generateBirthdayOffers : 3");
  } catch (e) {
    logMessage.push(e);
  }

  return updatedOffersContent;

}

module.exports.main = resolve;
