let api = require("./api.js");

const http = require("http");
const fs = require("fs");

const express = require('express');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cookieParser());


function getLastCommit(){
    function run(command){
        return require('child_process').execSync(command).toString().trim()
    }
    
    return {
        hash:run("git rev-parse HEAD"),
        time:run(`git log -1 --format="%at"`),
    };
}
let lastcommit = getLastCommit();
console.log("Running "+lastcommit.hash);



app.all("/running", (req,res)=>{
    res.send("yes");
});

app.all('/inst_full',async (req, res) => {
    res.sendFile(__dirname+"/institute.json");
});
app.all('/institute',async (req, res) => {
    res.sendFile(__dirname+"/inst_clean.json");
});
app.all("/loginInfo",(req,res)=>{
    if (req.body.password_encrypted){
        req.body.password = api.decrypt(req.body.password_encrypted);
        delete req.body.password_encrypted;
    }
    res.send(req.body);
})

app.all('/**',async (req, res, next) => {
    api.validateUser(req.headers["x-login-info"]).then((result)=>{
        req.login = result;
        let options = {maxAge: 1000*60*60*24*30*365};
        res.cookie("loginInfo",JSON.stringify(result), options);
        next();
    }).catch((err)=>{
        res.statusCode = 500;
        res.statusMessage = err.message;
        res.send(err.message);
    })
});
app.all('/health',async (req, res) => {
    let resp = {
        time:Date.now(),
        timeZoneOffset:(new Date()).getTimezoneOffset()
    };
    res.send(JSON.stringify(resp));
});


/* app.all('/data',async (req, res) => {
    let school = req.cookies["inst"];
    let token = req.cookies["access_token"];

    api.pipeData(school,token,res);
}); */
app.all("/pushHomeworkDone", async(req,res)=>{
    if (req.body.constructor == Array){
        res.send(api.save_HWC_changes(req.login,req.body));
    } else {
        res.statusCode = 400;
        res.send("BAD_DONE_LIST");
        return;
    }
});
app.all('/data',async (req, res) => {
    let school = req.login.inst;
    let token = req.login.access_token;

    api.studentAmi(school, token).then((data)=>{
        res.setHeader("Content-Type","application/json");
        res.send(data);
    }).catch((err)=>{
        res.send(err.message);
    })
    
    /* api.getData(school,token).then((data)=>{
        res.send(data);
    }).catch((err)=>{
        res.status(500);
        res.send("error");
    }) */
});
app.all('/timetable',async (req, res) => {
    let school = req.login.inst;
    let token = req.login.access_token;

    api.timeTable(school, token).then((data)=>{
        res.send(data);
    }).catch((err)=>{
        res.send(err.message);
    })
});
app.all('/homework/:id',async (req, res) => {
    let school = req.login.inst;
    let token = req.login.access_token;

    api.homework(school, token, req.params.id).then((data)=>{
        res.send(data);
    }).catch((err)=>{
        res.send(err.message);
    })
});
app.all('/lastcommit',async (req, res) => {
    res.send(JSON.stringify(lastcommit));
});

if (require.main === module) {
    console.log('called directly');
    app.listen(port);
    console.log("Server started on",port);
} else {
    console.log('required as a module');
}
module.exports = function(p){
    console.log = ()=>{};
    return app.listen(p);
    /* return app; */
}