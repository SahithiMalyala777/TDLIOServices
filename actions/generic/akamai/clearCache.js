const AkamaiFP = require("akamai-fast-purge");


async function resolve(params) {
   /* try {

        const config = {
            clientSecret: "9Oug03X3wKpKCyRYTt8HPBli4g45BTkokwpWPiw0QJM=",
            baseUri: "akab-a245ectgr2axulu5-lslawbrp3pemodtj.luna.akamaiapis.net",
            accessToken: "akab-scojul4lcv7g7nxm-oumq373l4tatb45l",
            clientToken: "akab-fufqyhvvvcsqnv6u-q5dlzcyb7th7te3o",
        };

        const AkamaiAPI = new AkamaiFP(config);

        const results = await AkamaiAPI.invalidateByUrl(['https://aem-pt.tatadigital.com/etc.clientlibs/tcp-pwa/clientlibs/clientlib-base.min.css']);
        return {
            statusCode: 200,
            body: {
                error: false,
                params: params,
                apiResponse: results
            },
        };
    } catch (e) {
        console.log(e);
        return {
            statusCode: 500,
            body: {
                error: true,
                payload: params
            },
        };
    }

*/
}

export const main = resolve;