
import InstItem from './types';

type RequestResult = {
    success:boolean,
    data:any,
    message:string
}

function showError(message: string){
    alert(message);
    // TODO: Implement error widget
}

function makeRequest(mode: string,url: string, data = {}): Promise<RequestResult>{
    let base = "//localhost:83/api/";
    return new Promise(function(promiseResolve,reject){
        function resolve(obj: RequestResult){

            if (!obj.success){
                showError(obj.message)
            }

            promiseResolve(obj);
        }


        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                
                try {
                    resolve({success:true,data:JSON.parse(xhttp.responseText),message:"Sikeres"});
                } catch(err){
                    resolve({success:false, message: "Érvénytelen JSON, "+xhttp.responseText, data:null});
                }
                
                
            } else if (this.readyState == 4) {
                resolve({success:false, message: xhttp.responseText || `Hiba ${this.status}`, data:null});
            }
        };
        let params = "";

        for (let [key,elem] of Object.entries(data)){
            if (params == ""){
                params+="?";
            } else {
                params+="&";
            }
            if (elem == null || elem == undefined){
                elem = "";
            }
            params+=`${key}=${elem}`;
        }

        xhttp.open(mode, base+url+params, true);
        xhttp.send();

    });
}


function get(url: string): Promise<RequestResult>{
    return makeRequest("GET",url);
}
function post(url: string, data: Object): Promise<RequestResult>{
    return makeRequest("POST",url,data);
}
function login(form: LoginCreds): Promise<any>{
    return new Promise(function(resolve,reject){
        post("login",form).then((result)=>{
            console.log(result);
        })
    })

}


function getInst(callback: Function = ()=>{}): InstItem[]{
    let items:InstItem[] = [];

    get("institute").then(function(result){
        if (result.success){
            result.data = result.data.map((e: any)=>({
                code:e.InstituteCode,
                name:e.Name,
                city:e.City
            }));
            items.push(...result.data);
            callback(result.data);
            console.log(result.data);
        }
    });
    

    return items;
}
type User = {
    username: string,
    passwordEnc: string,
    inst: string,
    accessToken: string,
    refreshToken: string
}
type LoginCreds = {
    inst: string,
    username: string,
    password: string
}

export {
    login,
    getInst
};

