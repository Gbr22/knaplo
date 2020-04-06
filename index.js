let api = require("./api.js");

const http = require("http");
const fs = require("fs");

const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3001;

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

app.use(cookieParser());




app.all('/login',async (req, res) => {
     
    let needs = {
        inst:"Intézményt",
        username:"Felhasználónevet",
        password:"Jelszót"
    };

    function loginError(message){
        console.log(message);

        res.statusCode = "500";
        res.send(message);

    }


    for (let p in needs){
        if (req.query.username){
            req.query.username = req.query.username.toString().replace(/\+/g," ").trim()
        }
        

        if (req.query[p] == undefined
          || req.query[p] == ""
          || req.query[p] == null){

            loginError("Nem adott meg "+needs[p]);
            return;
        }
    }
    

    api.login(req.query.inst,req.query.username,req.query.password)
    .catch((error)=>{
        loginError(error);
    })
    .then( (result) => {
        console.log(result);
        if (result.error){
            console.log(result.error);
            loginError(result.error.error_description);
            return;
        } else {
            let options = {maxAge: 1000*60*60*24*30*365};
            let info = {
                "access_token":result.access_token,
                "refresh_token":result.refresh_token,
                "inst":req.query.inst,
                "password_encrypted":api.encrypt(req.query.password),
                "username":req.query.username
            }
            res.cookie("loginInfo",JSON.stringify(info), options);
            
            res.send(info);

        }
    })
});

app.all('/inst_full',async (req, res) => {
    res.sendFile(__dirname+"/institute.json");
});
app.all('/institute',async (req, res) => {
    res.sendFile(__dirname+"/inst_clean.json");
});
app.all('/**',async (req, res, next) => {
    api.validateUser(req.cookies["loginInfo"]).then((result)=>{
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
app.all('/data',async (req, res) => {
    let school = req.login.inst;
    let token = req.login.access_token;

    api.studentAmi(school, token).then((data)=>{
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

app.listen(port);

console.log("Server started");