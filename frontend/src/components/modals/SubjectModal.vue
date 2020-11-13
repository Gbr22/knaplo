<template>
<div>
    <TabMenu :titles="['Átlag','Kerekítés','Grafikon']" v-if="!isNaN(obj.average)">
        <template>
            <div class="tab">
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
            </div>
            <div class="tab">
                <div id="rounding">
                    <h2>Kerekítés ennyitől</h2>
                    <div class="cont">
                        <div id="num">
                            <span>{{ obj.average == 5 ? 4 : Math.floor(obj.average) }}.</span>
                            <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" @input="setRound($event.target.value)" v-model="round">
                        </div>
                    </div>
                    <div class="preview roundPrev">
                        <span>{{ format(obj.average) || "#" }}</span>
                        <Icon src="fi/chevrons-right" v-bind:class="{ up: isRoundedUp(obj) }"/>
                        <!-- <i class="material-icons" v-bind:class="{ up: isRoundedUp(subject) }">
                            arrow_right_alt
                        </i> -->
                        <span>{{ roundSubject(obj) || "#" }}</span>
                    </div>
                </div>
            </div>
            <div class="tab">
                <LineChart :chart-data="getChartData()" :options="chartOptions" class="chart"/>
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
import { calcAvg, setSubjectRounding, getSubjectRounding, roundSubject } from '../../dataHandler';
import TabMenu from '../TabMenu.vue';
import LineChart from '../charts/LineChart.vue';
import { getCSSVariable } from '../../util';

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
            round:getSubjectRounding(this.obj.id),
            chartOptions:{
                tooltips:{
                    callbacks:{
                        label(el){
                            return parseFloat(parseFloat(el.value).toFixed(2)).toString();
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0
                    }
                },
                responsive: true,
                maintainAspectRatio:false,
                legend: {
                    labels:{
                        fontColor: getCSSVariable("--text-color")
                    }
                },
                layout: {
                    padding: {
                        left: 10,
                        right: 15,
                        top: 0,
                        bottom: 10
                    }
                },
                scales: {
                    xAxes: [{
                        display:false
                    }],
                    yAxes: [{
                        gridLines: {
                            color: getCSSVariable("--text-smol"),
                        },
                        ticks:{
                            fontColor: getCSSVariable("--text-color"),
                            suggestedMax: 5,
                            stepSize:0.5
                        }
                    }]
                }
            }
        }
    },
    mounted () {
    },
    methods:{
        getChartData () {
            let grades = this.obj.grades.map(e=>e.value).filter(e=>!isNaN(e)).reverse();
            let averages = [];
            let sum = 0;
            
            for (let i =0; i< grades.length; i++){
                let g = grades[i];
                let count = i+1;
                sum += g;
                averages.push(
                    sum/count
                )
            }
            console.log(grades);
            let gradeColor = /* getCSSVariable("--theme-5") */"#0074D9";
            return {
                labels: grades.map(e=>`(${e}) értékelés`),
                datasets: [
                    {
                        label: 'Átlag',
                        borderColor: getCSSVariable("--theme-color"),
                        pointBackgroundColor: getCSSVariable("--theme-color"),
                        data: averages,
                        fill:false
                    },
                    {
                        label: 'Jegy',
                        borderColor: gradeColor,
                        pointBackgroundColor: gradeColor,
                        data: grades,
                        fill:false,
                        showLine:false,
                    }
                ]
            }
        },
        roundSubject,
        format(num){
            return parseFloat(num.toFixed(2));
        },
        isRoundedUp(subject){
            return roundSubject(subject) >= subject.average;
        },
        setRound(v){
            let val = v.padEnd(2,"0");
            val = parseInt(val);
            if (isNaN(val)){
                return;
            }
            console.log("set",{val});
            setSubjectRounding(this.obj.id, val);
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
        TabMenu,
        LineChart
    }
}
</script>

<style scoped>
    h2 {
        text-align: center;
        padding: 10px 20px;
        margin: 0;
        padding: 0;
    }
    #rounding .cont {
        display: flex;
        margin: 12px auto;
        justify-content: center;
        align-items: center;
    }
    #rounding #num {
        flex: none;
        text-align: center;
        background-color: var(--element-color);
        box-shadow: var(--elem-shadow);
        padding: 8px 12px;
        border-radius: 8px;
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
    .preview {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: 25px;
    }
    /deep/ .preview svg {
        width: 28px;
        height: 28px;
    }
    .tab {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    /deep/ .swiper-slide {
        justify-content: center;
        align-items: center;
        height: 250px;
    }
    /deep/ .swiper-slide > div {
        height: 100%;
    }
    /deep/ .swiper-slide .tab {
        height: 100%;
    }
    .chart {
        width: 100%;
        height: 100%;
    }
</style>