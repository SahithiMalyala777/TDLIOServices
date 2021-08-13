const request = require('request');

    request('http://qas2.bigbasket.com/crmapi/v5.0.0/get-member-orders/',{json:true},(err, res, body)=>{
        if(err){
            return console.log(err);
        }

            return console.log(body);
    });

