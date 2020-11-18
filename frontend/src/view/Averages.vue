<template>
<div id="home" class="screen">
    <div id="avg_screen">
        <div class="inner">
            <div id="circle_container">
                <ProgressRing id="avg_circle_bg" stroke-color="#DCE0D9" :radius="120/2" :progress="100" :stroke="6"></ProgressRing>
                <ProgressRing id="avg_circle" stroke-color="#DCE0D9" :radius="120/2" :progress="avgPercent()" :stroke="6"></ProgressRing>
                <span id="total_avg"><span id="total_avg_text">{{ GlobalState.studentInfo ? nameAbbriv(GlobalState.studentInfo.Nev) : "##" }}</span></span>
            </div>
            <div id="avg_detail_cont">
                <span class="section avg">
                    
                    <Icon src="fi/bar-chart-2" />
                    <span class="right">
                        <span class="big">
                            {{ format(getAverage()) }}
                        </span>
                        <span class="small">Átlag</span>
                    </span>
                    
                </span>

                <span class="divider"></span>

                <span class="section rank">
                    
                    <Icon src="fi/award" />
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
        <li v-for="(subject) in GlobalState.processedData.subjects" class="subject lItem" v-bind:key="subject.name" @click="openSubject(subject)">
            <div class="subject_header">
                <span class="left">{{ subject.name }}</span>
                <span class="right roundPrev" v-if="!isNaN(subject.average)">
                    <span>{{ format(subject.average) || "#" }}</span>
                    <Icon src="fi/chevrons-right" v-bind:class="{ up: isRoundedUp(subject) }"/>
                    <span>{{ roundSubject(subject) || "#" }}</span>
                </span>
                
            </div>
            <div class="subject_grades">
                {{ subject.grades.map((e)=>(e.value || e.textValue).toString()).join(" ") }}
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
#subjects {
    border-radius: 15px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}
.divider {
    width: 0;
    height: 30px;
    display: inline-block;
    border: 0.5px solid var(--divider-color);
    content: '';
    vertical-align: middle;
    margin: 0 10px;
}

#avg_detail_cont .section {
    
    vertical-align: middle;
    display: inline-block;
    width: 40%;

}
#avg_detail_cont .left {
    padding-top: 3px;
}
#avg_detail_cont .right, #avg_detail_cont .left {
    display: inline-block;
    vertical-align: middle;
}

#avg_detail_cont .big, #avg_detail_cont .small {
    display: block;
    width: max-content;
    margin: 0;
}
#avg_detail_cont .big {
    font-size: 18px;
    font-weight: bold;
    color: var(--text-color);
    
}
#avg_detail_cont .small {
    font-size: 13px;
    color: var(--text-smol);
}


#circle_container circle {
    transition: stroke-dashoffset 0.35s, stroke 0.35s;
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    /*stroke: #00cc66;*/
    stroke: var(--theme-color);
    opacity: 0.70;
    border-radius: 50%;
}
#avg_circle_bg circle {
    stroke: var(--text-smol);
    opacity: 0.1;
}
#circle_container {
    
    
    width: 120px;
    height: 120px;
    position: relative;
    display: inline-block;
}
#circle_container #total_avg, #circle_container #avg_circle {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
}
#total_avg_text {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    text-align: center;
    height: max-content;
    font-size: 31px;
    color: var(--text-color);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: bold;
}

#ranks_container, #roundView_cont {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: auto;
    vertical-align: middle;
    text-align: center;
    display: flex;
    align-items: center;
}
#roundView h2 {
    text-align: center;
}
#roundView input[type="number"] {
    font-size: inherit;
    margin: 0;
    border: none;
    padding: 3px;
    padding-bottom: 0;
    outline: none;
    background-color: transparent;
    border-bottom: 1px solid var(--text-color);
}
#roundView input[type="number"]:invalid {
    color: rgb(190, 0, 0);
}
#roundView .example {
    font-size: 30px;
    text-align: center;
}

#roundView {
    width: 100%;
    box-sizing: border-box;
    margin: 30px;
    padding: 20px;
    height: max-content;
    text-align: left;
    display: inline-block;
    border-radius: 15px;
    background-color: var(--modal-color);
    box-shadow: var(--modal-shadow);
    position: relative;
}
#ranks .rank {

}
#ranks .left {
    border-right: 1px solid var(--divider-color);
}

#ranks .left span, #ranks .right span {
    display: block;
    padding: 1.5px 0;
}
#ranks .left, #ranks .right {
    display: inline-block;
    width: 50%;
    box-sizing: border-box;
    padding: 0 8px;
}
#ranks .left {
    text-align: right;
}
#ranks .right {
    text-align: left;
}

#ranks h2 {
    text-align: center;
    margin: 5px 0;
}
#ranks .close, #roundView .close {
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px;
}

#home {
    /*background-color: var(--color-dark);*/
    /* background: var(--theme-gradient); */
}


#avg_screen {
    padding: 30px 0;

    width: 100%;
    height: 220px;
    box-sizing: border-box;
    
    display: flex;
    justify-content: center;
    align-items: center;
    /*background-color: rgba(232, 238, 243, 0.418);*/
    background: transparent;
    text-align: center;

    color: whitesmoke;

}
#avg_screen .inner {
    display: block;
    width: 100%;
}
#avg_detail_cont {
    vertical-align: middle;
}
#avg_detail_cont .icon {
    vertical-align: middle;
}
#avg_detail_cont i {
    vertical-align: bottom;
}
.section.avg svg {
    stroke: var(--theme-color);
}
.section.rank svg {
    stroke: #ffcc00;
}
.section.rank i {
    color: #F2DC5D;
}
.section.avg {
    text-align: right;
}
.section.rank {
    text-align: left;
}
.section.rank a {
    color: inherit;
    text-decoration: none;
}

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

.roundPrev svg {
    stroke: rgb(218, 134, 95);    
}

.roundPrev .up svg {
    stroke: #1CAA53;    
}
</style>