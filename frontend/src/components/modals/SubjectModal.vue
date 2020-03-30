<template>
<div>
    <div id="avg_calc">
        <div class="avg">
            <div class="type"><span class="avgtitle">Jelenlegi átlag</span><span class="num">{{ obj.average.toFixed(2) }}</span></div>
            <div class="type"><span class="avgtitle">Átszámított átlag</span><span class="num">{{ calcNewAvg().toFixed(2) }}</span></div>
        </div>
        <div v-for="(count,index) in avgCalc" v-bind:key="index" class="avg_calc_grade">
            <div class="gradename">{{ getGradeName(index) }}</div>
            

            <button v-on:click="minus(index)">
                <svg class="feather">
                    <use xlink:href="/fi#minus"/>
                </svg>
            </button>
            <div class="gradecount">{{ count }}</div>
            <button @click="plus(index)">
                <svg class="feather">
                    <use xlink:href="/fi#plus"/>
                </svg>
            </button>
            
        </div>
    </div>

      <h2>Jegyek</h2>
      <div>
          <TimelineItem v-for="item in grades" :item="item" v-bind:key="item.key" />
      </div>
</div>
</template>

<script>
import TimelineItem from '../TimelineItem';
import { calcAvg } from '../../dataHandler';

export default {
    name:"SubjectModal",
    props:["obj"],
    data(){
        let grades = JSON.parse(JSON.stringify(this.obj.grades));
        grades.forEach((e)=>{
            e.header = e.desc;
            e.desc = "";
            e.onclick = ()=>{};
        });
        
        let avgCalc = Object.assign({},[null, 0,0,0,0,0]);
        delete avgCalc["0"];
        return {
            grades,
            avgCalc
        }
    },
    methods:{
        calcNewAvg(){
            return calcAvg(this.obj, this.avgCalc);
        },
        minus(index){
            if (this.avgCalc[index] > 0){
                this.avgCalc[index]--;
            }
        },
        plus(index){
            this.avgCalc[index]++;
        },
        getGradeName(grade){
            let obj = {
                "1":"Elégtelen",
                "2":"Elégséges",
                "3":"Közepes",
                "4":"Jó",
                "5":"Jeles"
            }
            return obj[grade];
        },
    },
    components:{
        TimelineItem
    }
}
</script>

<style scoped>
    h2 {
        text-align: center;
        padding: 10px 20px;
    }
</style>