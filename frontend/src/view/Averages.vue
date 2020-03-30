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
                <span class="tinygrade" v-for="grade in subject.grades" v-bind:key="grade.key">{{ grade.value }}</span>
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
            console.log(name);
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

</style>