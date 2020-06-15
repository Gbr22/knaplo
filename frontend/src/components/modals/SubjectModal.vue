<template>
<div>
    <TabMenu :titles="['Átlag','Kerekítés','Grafikon']">
        <template>
            <div id="avg_calc" v-if="!isNaN(obj.average)">
                <div class="avg">
                    <div class="type"><span class="avgtitle">Jelenlegi átlag</span><span class="num">{{ obj.average.toFixed(2) }}</span></div>
                    <div class="type"><span class="avgtitle">Átszámított átlag</span><span class="num">{{ calcNewAvg().toFixed(2) }}</span></div>
                </div>
                <div v-for="(count,index) in avgCalc" v-bind:key="index" class="avg_calc_grade">
                    <div class="gradename">{{ getGradeName(index) }}</div>
                    

                    <button v-on:click="minus(index)">
                        <Icon src="fi/minus" />
                    </button>
                    <div class="gradecount">{{ count }}</div>
                    <button @click="plus(index)">
                        <Icon src="fi/plus" />
                    </button>
                    
                </div>
            </div>
            <div id="rounding">
                <h2>Kerekítés ennyitől</h2>
                <div class="cont">
                    <div id="num">
                        <span>{{ Math.floor(obj.average) }}.</span>
                        <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" @input="setRound($event.target.value)" v-model="round">
                    </div>
                </div>
            </div>
            <div>
                2
            </div>
        </template>
    
    </TabMenu>

    

      <h2>Jegyek</h2>
      <div>
          <TimelineItem v-for="item in grades" :item="item" v-bind:key="item.key" />
      </div>
</div>
</template>

<script>


import TimelineItem from '../TimelineItem';
import { calcAvg, setSubjectRounding, getSubjectRounding } from '../../dataHandler';
import TabMenu from '../TabMenu.vue';

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
            avgCalc,
            round:getSubjectRounding(this.obj.name)
        }
    },
    methods:{
        setRound(v){
            let val = v.padEnd(2,"0");
            val = parseInt(val);
            if (isNaN(val)){
                return;
            }
            console.log("set",{val});
            setSubjectRounding(this.obj.name, val);
        },
        getSubjectRounding,
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
        TimelineItem,
        TabMenu
    }
}
</script>

<style scoped>
    h2 {
        text-align: center;
        padding: 10px 20px;
    }
    #rounding .cont {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 150px;
    }
    #rounding #num {
        flex: 1;
        text-align: center;
    }
    #rounding input {
        border: none;
        /* background: var(--element-color); */
        background: none;
        outline: none;
        text-align: left;
        width: 2ch;
    }
    #rounding input::before {
        position: absolute;
        content: '00';
        top: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
    }
    #rounding #num > * {
        font-size: 30px;
    }
</style>