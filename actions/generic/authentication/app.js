
const auth=require("@adobe/jwt-auth");
const _config=require("./configuration.js");
const apiCallFromRequest=require("./requestAPI.js");
const http = require("http");

let options=_config.credentials;
auth(options).then(res => console.log(res));


http.createServer(function(req, res){
        res.writeHead(200, {'Content-Type': 'json'});
        res.write(res);
        res.end();
    
    }).listen(3000);

    console.log("Service running on 3000 port...");

 


