
const { URL } = require('url');

const { http, https } = require('follow-redirects');
// Create an HTTP tunneling proxy

const { spawn } = require("child_process");
let Path = require("path");

let torConfPath = Path.join(__dirname,"torrc");
console.log("tor conf path",torConfPath);
const tor = spawn("tor", ["-f",torConfPath]);

var tr = require('tor-request');
const fetch = require('node-fetch');

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
    
    if (url.indexOf("idp.e-kreta.hu") != -1){
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
    } else {
        let options = {
            headers,
            method:req.method
        }
        if (req.method == "POST"){
            options.body = req.body;
        }
        fetch(url,options).then(async r=>{
            res.status(r.status);
            res.set({...r.headers});
            res.send(await r.text());
        }).catch(err=>{
            console.log(err);
            res.status(500);
            res.send();
        })
    }
    
    
}

