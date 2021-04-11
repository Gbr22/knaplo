
const { URL } = require('url');

const { http, https } = require('follow-redirects');
// Create an HTTP tunneling proxy

const { spawn } = require("child_process");
let Path = require("path");

/* let torConfPath = Path.join(__dirname,"torrc");
console.log("tor conf path",torConfPath);
const tor = spawn("tor", ["-f",torConfPath]); */

const fetch = require('node-fetch');
const fs = require("fs");
var SocksProxyAgent = require('socks-proxy-agent');
 
/* var agent = new SocksProxyAgent("socks://localhost:9050"); */
var args = process.argv.slice(2);
let dev = args.includes("--dev");



let agents = fs.readFileSync("proxylist.csv").toString()
    .split("\n").filter(e=>e).map(e=>e.replace(/\r/g,""))
    .map(e=>e.split(",")).map(e=>{
        let [ip, port, protocol] = e;
        let protocols = {
            "SOCKS4":"socks4"
        };
        let p = protocols[protocol];
        return new SocksProxyAgent(`${p}://${ip}:${port}`)
    });


function wait(ms){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve();
        },ms);
    })
}

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
    
    let promises = [];
    let controllers = [];

    for (let i = 0; i < agents.length; i++) {
        const agent = agents[i];

        const controller = new AbortController();
        const signal = controller.signal;
        controllers.push(controller);

        let options = {
            headers,
            method:req.method,
            agent:agent,
            redirect:redirect,
            signal,
        }
        if (req.method == "POST"){
            options.body = req.body;
        }
        
        let promise = fetch(url,options);
        promises.push(promise);
    }
    
    wait(5000).then(()=>{
        controllers.forEach(e=>{
            e.abort();
        })
        res.status(500);
        res.send();
    })
    Promise.any(promises).then(r=>{
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
        controllers.forEach(e=>{
            e.abort();
        })
    }).catch(err=>{
        res.status(500);
        res.send();
    })
}

