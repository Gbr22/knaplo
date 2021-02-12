
const { URL } = require('url');

const { http, https } = require('follow-redirects');
// Create an HTTP tunneling proxy

const { spawn } = require("child_process");

const tor = spawn("tor", []);
var tr = require('tor-request');

module.exports = (req,res)=>{
    
    
    let url = req.headers["x-proxy-url"];
    let headers = {};
    for (p in req.headers){
        if (p.indexOf("x-proxy-header-") != -1){
            let h = p.replace("x-proxy-header-","")
            if (h == "apikey"){
                h = "apiKey";
            }
            headers[h] = req.headers[p];

        }
    }
    let options = {
        url,
        headers,
        method:req.method
    };
    if (req.method == "POST"){
        options.body = req.body;
    }
    tr.request(options, function (err, torRes, body) {
        if (!err) {

            res.status(torRes.statusCode);
            res.set(torRes.headers);
            res.send(body);
        } else {
            console.log(err);
            res.status(500);
            res.send();
        }
    });
}

