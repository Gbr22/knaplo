<template>
    <div id="finals">
        <h1>
            <span class="left">
                <h2>Félév</h2>
                <p>{{ getAvgSemester("halfYear") }}</p>
            </span>
            <span class="right">
                <h2>Év vége</h2>
                <p>{{ getAvgSemester("endYear") }}</p>
            </span>
        </h1>
        <ul class="list">
            <li v-for="(subject) in subjects" class="lItem finals_item" :key="subject.name">
                <FinalGrade class="left" :obj="getSemester(subject,'halfYear')" />
                <div class="mid">{{ subject.name }}</div>
                <FinalGrade class="right" :obj="getSemester(subject, 'endYear')" />
            </li>
        </ul>
    </div>
</template>

<script>
import GlobalState from '../globalState';

import FinalGrade from '../components/FinalGrade';

export default {
    name: 'Finals',
    data:()=>{
        return {
            GlobalState,
            subjects:GlobalState.processedData.subjects
        }
    },
    components:{
        FinalGrade
    },
    methods:{
        getSemester(subject,id){
            return subject.grades.filter(e=>e.isType(id))[0];
        },
        getAvgSemester(type){
            type;
            let subjects = this.subjects;
            let sum = 0;
            let count = 0;
            for (let subj of subjects){
                let g = this.getSemester(subj,type);
                if (g != null && g.value != null){
                    sum+=g.value;
                    count++;
                }
            }
            return sum == 0 ? "#" : (sum/count).toFixed(2);
        }
    }
    
    
}
</script>

<style scoped>
    
#finals h1 h2 {
    font-size: 25px;
}
#finals h1 h2, #finals h1 p {
    margin: 0;
    padding: 0;
}
#finals h1 p {
    font-size: 18px;
    color: var(--text-light-color);
}
#finals h1 span {
    display: inline-block;
    width: 50%;
    vertical-align: middle;
    box-sizing: border-box;
    padding: 20px 20px;
    padding-bottom: 0;
    text-align: center;
}
#finals h1 .right {
    position: absolute;
}

</style>
<style>
.finals_item {
    position: relative;
    font-size: 18px !important;
    padding: 15px 0px !important;
}
.finals_item .mid {
    margin: 0 45px;
    text-align: center;
}
.finals_item .left, .finals_item .right {
    font-weight: bold;
    font-size: 28px;
    position: absolute;
    margin: auto 18px;
    top: 0;
    bottom: 0;
    height: 30px;
    display: inline-block;
    vertical-align: middle;
}
.finals_item .D {
    font-size: 13px;
    vertical-align: top;
    position: absolute;
    right: -3px;
}
.finals_item .left {
    left: 0;
}
.finals_item .right {
    right: 0;
}
</style>