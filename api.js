//imports
const _request = require('request-promise-native');

const needle = require("needle");

const fs = require('fs');

//consts
const api_key = "7856d350-1fda-45f5-822d-e1a2f3f1acf0";
const api_base = "https://kretaglobalmobileapi.ekreta.hu"
const client_id = "919e0c1c-76a2-4646-a2fb-7085bbbf3c56";
const api_full = api_base+"/api/v1/";
const userAgent = "Kreta.Ellenorzo/2.9.11.2020033003 (Linux; U; Android 8.0.0)";

const defaultOptions = {
    method: "GET",
    headers: {
        "apiKey":api_key,
        "charset":"utf-8",
        "User-Agent":userAgent
    },
    json:true
}

function req(options){
    let obj = Object.assign({},defaultOptions);
    return _request(Object.assign(obj,options));
}


async function institute(){
    return await (req({
        url:'https://kretaglobalmobileapi2.ekreta.hu/api/v2/Institute',
        json:false
    }));
}


(async () => {
    let inst = await institute();
    fs.writeFileSync("institute.json",inst);
    let arr = JSON.parse(inst);
    inst = undefined;
    let clean = [];
    for (let i=0; i < arr.length; i++){
        let e = arr[i];
        clean.push({
            Name:e.name,
            InstituteCode:e.instituteCode,
            City:e.city,
        });
    }
    fs.writeFileSync("inst_clean.json",JSON.stringify(clean));
})();

function login(school,username,password){
    return new Promise(function(resolve,reject){
        let data = {
            institute_code:school,
            userName:username,
            password:password,
            grant_type:'password',
            client_id:client_id,
        }
        let options = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                "User-Agent":userAgent,
            }
        }
        needle('post',`https://${school}.e-kreta.hu/idp/api/v1/Token`, data, options).then((res)=>{
            resolve(res.body);
        }).catch((err)=>{
            reject(err);
        })
    });
    
}
function refresh(school,token){
    return new Promise(function(resolve,reject){
        req({
            url:`https://${school}.e-kreta.hu/idp/api/v1/Token`,
            headers:{
                "Content-Type":"application/x-www-form-urlencoded"
            },
            json:true,
            body: `refresh_token=${token}&grant_type=refresh_token&client_id=${client_id}`
        }).then((json)=>{
            resolve(json);
        }).catch((err)=>{
            //reject(json);
            
            resolve("error");
        });
    });
}

function pipeData(school,token,p){
    
    req({
        url:`https://${school}.e-kreta.hu/mapi/api/v1/Student?fromDate=null&toDate=null`,
        headers:{
            "Authorization":"Bearer "+token,
        },
        json:false
    }).pipe(p);
    
}
function getData(school,token){
    return new Promise(function(resolve,reject){
        req({
            url:`https://${school}.e-kreta.hu/mapi/api/v1/Student?fromDate=null&toDate=null`,
            headers:{
                "Authorization":"Bearer "+token,
                "User-Agent":userAgent
            },
            json:false
        }).then((json)=>{
            resolve(json);
        }).catch((json)=>{
            reject(json);
            //resolve(json);
        });
    });
    
}
function studentAmi(school,token){
    return new Promise(function(resolve,reject){
        req({
            url:`https://${school}.e-kreta.hu/mapi/api/v1/StudentAmi`,
            headers:{
                "Authorization":"Bearer "+token,
                "User-Agent":userAgent
            },
            json:false
        }).then((json)=>{
            resolve(json);
        }).catch((json)=>{
            reject(json);
            //resolve(json);
        });
    });
}


module.exports = {
    key:api_key,
    base:api_base,
    full:api_full,
    institute,
    login,
    getData,
    pipeData,
    refresh,
    studentAmi
}