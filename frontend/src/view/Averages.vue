<template>
<div id="home" class="screen">
    <div id="avg_screen">
        <div class="inner" v-show="GlobalState.data">
            <div id="circle_container">
                <ProgressRing id="avg_circle" stroke-color="#DCE0D9" :radius="120/2" :progress="avgPercent()" :stroke="6"></ProgressRing>
                <span id="total_avg"><span id="total_avg_text">{{ GlobalState.data ? nameAbbriv(GlobalState.data.Name) : "##" }}</span></span>
            </div>
            <div id="avg_detail_cont">
                <span class="section avg">
                    
                    <svg class="feather">
                        <use xlink:href="/fi#bar-chart-2"/>
                    </svg>
                    <!-- <i class="material-icons left">equalizer</i> -->
                    <span class="right">
                        <span class="big">
                            {{ format(getAverage()) }}
                        </span>
                        <span class="small">Átlag</span>
                    </span>
                    
                </span>

                <span class="divider"></span>

                <span class="section rank">
                    
                    <svg class="feather">
                        <use xlink:href="/fi#award"/>
                    </svg>
                    <!-- <i class="material-icons left">stars</i> -->
                    <span class="right">
                        <span class="big">
                            <a @click="openRanksMenu()">{{ rank().name }}</a>
                        </span>
                        <span class="small">Rang</span>
                    </span>
                    
                </span>
            </div>
        </div>
    </div>
    <ul id="subjects" class="list">
        <li v-for="(subject) in GlobalState.processedData.subjects" class="subject lItem" v-on:click="openSubject(subject)" v-bind:key="subject.name" @click="openSubject(subject)">
            <div class="subject_header">
                <span class="left">{{ subject.name }}</span>
                <span class="right">
                    <span>{{ format(subject.average) }}</span>
                    <svg class="feather" v-bind:class="{ up: isRoundedUp(subject) }">
                        <use xlink:href="/fi#chevrons-right"/>
                    </svg>
                    <!-- <i class="material-icons" v-bind:class="{ up: isRoundedUp(subject) }">
                        arrow_right_alt
                    </i> -->
                    <span>{{ roundSubject(subject) }}</span>
                </span>
                
            </div>
            <div class="subject_grades">
                {{ subject.grades.map((e)=>e.value).join(" ") }}
            </div>
        </li>
    </ul>
    
    
    
</div>
</template>

<script>
import GlobalState from '../globalState';
import { openModal } from '../components/Modal';
import { roundSubject, getAverage, openSubject } from '../dataHandler';



import ProgressRing from '../components/ProgressRing';

var ranks = [
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

export default {
    name:"Averages",
    data:()=>{
        return {
            GlobalState,
        }
    },
    components:{
        ProgressRing
    },
    methods:{
        openSubject,
        nameAbbriv(name){
            return name.split(" ").map((e)=>e[0]).join("");
        },
        getAverage,
        format(num){
            return parseFloat(num.toFixed(2));
        },
        rank(){
            let highest = ranks[ranks.length-1];

            for (let rank of ranks){
                
                if (this.getAverage() >= rank.min && rank.min > highest.min){
                    highest = rank;
                }
                
            }

            return highest;
        },
        openRanksMenu(){
            openModal("Rangok",/*html*/`
                <div id="ranks">
                    ${ranks.map((e)=>/*html*/`
                        <span class="left">
                            <span>${ e.min }</span>
                        </span><span class="right">
                            <span>${e.name}</span>
                        </span>
                    `).join("")}
                </div>
            `);
        },
        isRoundedUp(subject){
            return roundSubject(subject) >= subject.average;
        },
        avgPercent(){
            return this.getAverage() / 5 * 100;
        },
        roundSubject
    }
}
</script>

<style>

#subject_grades {
    text-align: initial;
}

#subject_details h1 {
    margin-top: 80px;
    
}
#subj_detail_section {
    width: 100%;
    white-space: nowrap;
    display: block;
    overflow-x: scroll;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    padding: 10px 0;
}
#avg_graph .chart-container {
    width: 100%;
    height: 100%;
    position: relative;
    
}
#avg_graph .chart-container canvas {
    display: inline-block;
    vertical-align: middle;
}
#avg_graph, #avg_calc {
    width: 80%;
    display: inline-block;
    margin-left: 10%;
    scroll-snap-align: center;
    vertical-align: middle;
}
#avg_graph {
    margin-right: 10%;
    height: 200px;
}
#avg_calc .type {
    display: flex;
}
#avg_calc .type .avgtitle {
    vertical-align: middle;
    display: inline-block;
    width: 60%;
    text-align: left;
    flex: 1;
}
#avg_calc .type .num {
    display: inline-block;
    width: 40px;
    text-align: left;
    flex-shrink: 0;
}

#avg_calc .avg {
    font-size: 19px;
    margin-bottom: 25px;
}

.avg_calc_grade {
    padding: 3px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
}

.avg_calc_grade .gradename {
    display: inline-block;
    text-align: left;
    width: 50%;
    font-size: 19px;
    flex: 1;
}
.avg_calc_grade .gradename, .avg_calc_grade .gradecount {
    vertical-align: middle;
}
.avg_calc_grade .gradecount {
    width: 40px;
    text-align: center;
    display: inline-block;
    font-size: 19px;
}
.avg_calc_grade button {
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 50%;
    outline: none;
    background-color: var(--element-color);
    
    position: relative;
    vertical-align: middle;
}
.avg_calc_grade button svg {
    stroke: rgb(184, 189, 181);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 22px;
    height: 22px;
}
</style>