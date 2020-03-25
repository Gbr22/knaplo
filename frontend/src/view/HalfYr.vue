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
            subjects:GlobalState.processedData.subjects
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
    
.halfyr_item {
    position: relative;
    font-size: 18px;
    padding: 15px 0px;
}
.halfyr_item .mid {
    margin: 0 45px;
    text-align: center;
}
.halfyr_item .left, .halfyr_item .right {
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
.halfyr_item .D {
    font-size: 13px;
    vertical-align: top;
    position: absolute;
}
.halfyr_item .grade {

}
.halfyr_item .left {
    left: 0;
}
.halfyr_item .right {
    right: 0;
}
#halfyr h1 h2 {
    font-size: 25px;
}
#halfyr h1 h2, #halfyr h1 p {
    margin: 0;
    padding: 0;
}
#halfyr h1 p {
    font-size: 18px;
    color: var(--text-smol);
}
#halfyr h1 span {
    display: inline-block;
    width: 50%;
    vertical-align: middle;
    box-sizing: border-box;
    padding: 20px 20px;
    padding-bottom: 0;
    text-align: center;
}
#halfyr h1 .right {
    position: absolute;
}

</style>
