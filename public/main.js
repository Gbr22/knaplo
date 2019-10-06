const ProgressRing = Vue.component('progress-ring', {
    props: {
      radius: Number,
      progress: Number,
      stroke: Number,
      strokeColor:String
    },
    data() {
      const normalizedRadius = this.radius - this.stroke * 2;
      const circumference = normalizedRadius * 2 * Math.PI;
      
      return {
        normalizedRadius,
        circumference
      };
    },
    computed: {
      strokeDashoffset() {
        return this.circumference - this.progress / 100 * this.circumference;
      }
    },
    template: `
      <svg
        :height="radius * 2"
        :width="radius * 2"
       >
         <circle
            
            :stroke-dasharray="circumference + ' ' + circumference"
            :style="{ strokeDashoffset: strokeDashoffset }"
            :stroke-width="stroke"
            :stroke="strokeColor"
            fill="transparent"
            :r="normalizedRadius"
            :cx="radius"
            :cy="radius"
        />
      </svg>
    `
  });

function req(url){
    return new Promise(function(resolve,reject){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                
                resolve(xhttp.responseText);
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    })
}

//let api_base = "http://localhost:3001/"
let api_base = window.location.protocol+"//"+window.location.host;
let api_full = api_base+"/api/";

async function institute(){
    return await req(api_full+"institute");
}

let institutions = [];
(async ()=>{
    institutions = JSON.parse(await institute());
})()



let data = {
    fullname:'',
    loginerror:{
        error:false,
        message:""
    },
    logged_in:false,
    inst_search:'',
    selected_inst:'',
    average:0,
    subjects:[
        {
            name:"Történelem",
            average:5,
            grades: [
                {
                    grade:5
                }
            ]
        },
        {
            name:"Nyelvtan",
            average:3.5,
            grades: [
                {
                    grade:3
                },
                {
                    grade:4
                }
            ]
        }
    ]
}
async function getData(){
    let d = JSON.parse(await req(api_full+"data"));
    data.fullname = d.Name;

    let subjects = [];
    let sum = 0;
    for (let e of d.SubjectAverages){
        subjects.push({
            name:e.Subject,
            average:e.Value,
            grades:[]
        })
        sum += Math.round(e.Value);
    }
    data.subjects = subjects;
    data.average = sum/subjects.length;

    console.log(d);
}

(async ()=>{
    if (cookies.get("access_token")){
        getData();
        data.logged_in = true;
    }
})();



if (cookies.get("loginerror")){
    data.loginerror = {
        error:true,
        message:cookies.get("loginerror")
    }
}


function searchSchool(search){
    let found = [];
    for (let i=0; i < institutions.length; i++){
        if (found.length >= 5){
            break;
        }

        if (institutions[i].Name.toLowerCase().indexOf(search.toLowerCase()) != -1){
            found.push(institutions[i]);
        }
    }
    return found;
}
var app = new Vue({
    el: '#app',
    components: {
        'progress-ring': ProgressRing
    },
    data: data,
    methods: {
        searchSchool,
        format(num){
            return Math.round(num*100)/100;
        },
        avg_percent(){
            return this.average / 5 * 100;
        },
        name_abbriv(){
            return this.fullname.split(" ").map( (e)=>e[0] ).join("");
            
        },
        rank(){
            let ranks = [
                {
                    min: 4.5,
                    name: "Platinum",
                    color: "#00cc66"
                },
                {
                    min:4,
                    name: "Gold",
                    color: "#ccff33"
                },
                {
                    min:3,
                    name: "Silver",
                    color: "#e6e600"
                },
                {
                    min:2,
                    name: "Bronze",
                    color: "#ff9900"
                },
                {
                    min:1,
                    name:"Stone",
                    color: "#cc3300"
                }
            ];
            let currentRank = {min:0,name:"Error", color: "#000000"};
            for (let i=0; i < ranks.length; i++){
                if (ranks[i].min > currentRank.min && this.average >= ranks[i].min){
                    currentRank = ranks[i];
                }
            }
            return Object.assign({},currentRank);

        }
    }
})
