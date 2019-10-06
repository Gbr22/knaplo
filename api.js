//imports
const _request = require('request-promise-native');


//consts
const api_key = "7856d350-1fda-45f5-822d-e1a2f3f1acf0";
const api_base = "https://kretaglobalmobileapi.ekreta.hu"
const client_id = "919e0c1c-76a2-4646-a2fb-7085bbbf3c56";
const api_full = api_base+"/api/v1/";

const defaultOptions = {
    method: "GET",
    headers: {
        "apiKey":api_key,
        "charset":"utf-8"
    },
    json:true
}

function req(options){
    let obj = Object.assign({},defaultOptions);
    return _request(Object.assign(obj,options));
}


async function institute(){
    return await (req({
        url:api_full+"Institute",
        json:false
    }));
}

function login(school,username,password){
    return new Promise(function(resolve,reject){
        req({
            url:`https://${school}.e-kreta.hu/idp/api/v1/Token`,
            headers:{
                "Content-Type":"application/x-www-form-urlencoded"
            },
            json:true,
            body:`institute_code=${school}&userName=${username}&password=${password}&grant_type=password&client_id=${client_id}`
        }).then((json)=>{
            resolve(json);
        }).catch((json)=>{
            //reject(json);
            resolve(json);
        });
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

function getData(school,token){
    return new Promise(function(resolve,reject){
        req({
            url:`https://${school}.e-kreta.hu/mapi/api/v1/Student?fromDate=null&toDate=null`,
            headers:{
                "Authorization":"Bearer "+token,
            },
            json:true
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
    refresh
}