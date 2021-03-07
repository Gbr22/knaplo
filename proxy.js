
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
var SocksProxyAgent = require('socks-proxy-agent');
 
var agent = new SocksProxyAgent("socks://localhost:9050");
var args = process.argv.slice(2);
let dev = args.includes("--dev");

module.exports = (req,res)=>{
    
    
    let url = req.headers["x-proxy-url"];
    let redirect = req.headers["x-proxy-redirect"];
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
        method:req.method,
        agent:dev ? null : agent,
        redirect:redirect
    }
    if (req.method == "POST"){
        options.body = req.body;
    }
    
    fetch(url,options).then(async r=>{
        let status = r.status;
        if (status >= 300 && status < 400){
            status = 299;
        }
        let h = {};
        [...r.headers.keys()].forEach(key=>{
            if (key == "set-cookie"){
                h["x-proxy-header-"+key] = r.headers.get(key);
            } else {
                h[key] = r.headers.get(key);
            }
        });
        h["x-proxy-status"] = r.status;
        
        res.status(status);
        

        res.set(h);
        r.body.pipe(res);
    }).catch(err=>{
        if(dev){
            console.log(err);
        }
        res.status(500);
        res.send();
    })
    
    
    
}

