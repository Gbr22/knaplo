<template>
    <div id="halfyr">
        <h1>
            <span class="left">
                <h2>Félév</h2>
                <p>{{ getAvgHalfyrF("HalfYear") }}</p>
            </span>
            <span class="right">
                <h2>Év vége</h2>
                <p>{{ getAvgHalfyrF("EndYear") }}</p>
            </span>
        </h1>
        <ul class="list">
            <li v-for="(subject) in subjects" class="lItem halfyr_item" :key="subject.name">
                <HalfYrGrade class="left" :obj="subject.HalfYear" />
                <div class="mid">{{ subject.name }}</div>
                <HalfYrGrade class="right" :obj="subject.EndYear" />
            </li>
        </ul>
    </div>
</template>

<script>
import GlobalState from '../globalState';

import HalfYrGrade from '../components/HalfYrGrade';

export default {
    name: 'HalfYr',
    data:()=>{
        return {
            GlobalState,
            subjects:[...Array(10).keys()].map((i)=>({name:"Tantárgy "+(i*1+1), HalfYear:{value:Math.floor(Math.random()*3+3)}, EndYear:null}))
        }
    },
    components:{
        HalfYrGrade
    },
    methods:{
        getAvgHalfyrF(type){
            type;
            let subjects = this.subjects;
            let sum = 0;
            for (let subj of subjects){
                if (subj[type] != null){
                    sum+=subj[type].value;
                }
            }
            return sum == 0 ? "#" : sum/subjects.length;
        }
    }
    
    
}
</script>

<style>
    

</style>
