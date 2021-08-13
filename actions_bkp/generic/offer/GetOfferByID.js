
const libState = require("@adobe/aio-lib-state");
var rp = require("request-promise");
async function getOfferById(params) {

    try {
        console.log("1");

        var options = {
            'method': 'GET',
            'url': 'https://mc.adobe.io/tatadigital/target/offers/json/455160',
            'headers': {
                'X-Api-Key': 'fa8aa124c68a470780fa43721d900bd1',
                'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEta2V5LTEuY2VyIn0.eyJpZCI6IjE2MjM3NDc0NzgzMjBfZDYyZWExMmQtN2Q5MS00MDg1LWIwMmEtZGMyM2M5MzkzNTA2X3VlMSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJjbGllbnRfaWQiOiJmYThhYTEyNGM2OGE0NzA3ODBmYTQzNzIxZDkwMGJkMSIsInVzZXJfaWQiOiJBMUE5MTZCNDYwQkRFRkQ2MEE0OTVFRjRAdGVjaGFjY3QuYWRvYmUuY29tIiwiYXMiOiJpbXMtbmExIiwiYWFfaWQiOiJBMUE5MTZCNDYwQkRFRkQ2MEE0OTVFRjRAdGVjaGFjY3QuYWRvYmUuY29tIiwiZmciOiJWUVhaU1FISUhMRzdOWFVDQ01aQkJIUUFCVT09PT09PSIsIm1vaSI6Ijc0M2FlYzJhIiwiZXhwaXJlc19pbiI6Ijg2NDAwMDAwIiwic2NvcGUiOiJvcGVuaWQsQWRvYmVJRCx0YXJnZXRfc2RrLHJlYWRfb3JnYW5pemF0aW9ucyxhZGRpdGlvbmFsX2luZm8ucm9sZXMsYWRkaXRpb25hbF9pbmZvLnByb2plY3RlZFByb2R1Y3RDb250ZXh0IiwiY3JlYXRlZF9hdCI6IjE2MjM3NDc0NzgzMjAifQ.ktaAPRSoXrbhyqicRllpqN0NKhFGh15Fql0W2umWedeoy7PGD2QkFd6EsMfqXUjmgH-qYSeUUA8Hk9qgx1wrQu28kWITXYJ9dTNIH_kQdm0J8o1K2yaBQRs7vfWAphhR0fyOJDTENm58NtKjz-VRJj_Ycb3P8G0gy1I3G5_SmuaX3pzdnTq5iatIE5dvohwX7ABlg_a22QeVtwCWck4PW09_7nHdCVDtlGDDsh3Tm95PFCHNRFeI3bSn9b7Qevn1WgIFgbHB0yRQ68kjki7N8LPugEZIE__t_tzOt9gsB1_fSsnjWo0zWQ6J0o33Uzn0JSGHY4MFPQPP09Bh7ctWWQ'
            }
        };
        console.log("2");
        let targetResponse = await rp(options);
        console.log("3");
        return {
            statusCode: 200,
            body: {
                error: false,
                payload: targetResponse
            }
        };
    } catch (e) {
        console.log(e);
        return {
            statusCode: 500,
            body: {
                error: true,
                payload: e
            }
        };
    }
};

module.exports.main = getOfferById;