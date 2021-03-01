
const { URL } = require('url');

const { http, https } = require('follow-redirects');
// Create an HTTP tunneling proxy

const { spawn } = require("child_process");
let Path = require("path");

let torConfPath = Path.join(__dirname,"torrc");
console.log("tor conf path",torConfPath);
const tor = spawn("tor", ["-f",torConfPath]);

const fetch = require('node-fetch');
const fs = require("fs");
 


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
        headers,
        method:req.method
    }
    if (req.method == "POST"){
        options.body = req.body;
    }
    console.log("start request", url);
    fetch(url,options).then(async r=>{
        console.log(url,r.status);
        res.status(r.status);
        res.set({...r.headers});
        r.body.pipe(res);
    }).catch(err=>{
        console.log(err);
        res.status(500);
        res.send();
    })
    
    
    
}

