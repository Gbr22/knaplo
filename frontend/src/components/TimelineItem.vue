<template>
<div class="itemWrap">
    <div class="gradeLike recent" :data-item-type="item.type" :data-state="item.displayState" v-on:click="item.onclick()">
        
        <span class="left">
            <Icon :src="item.icon" size="28" :color="getItemColor(item)"/>
        </span>
        <span class="right">
            <div class="header">
                {{ item.header }}
            </div>
            <span class="bottom">{{ item.desc }}</span>
        </span>
        <span class="date"><b>{{ getDayOfWeek(new Date(item.date)) }}</b><br><i>{{ formatDate(new Date(item.date)) }}</i></span>
    </div>
</div>
</template>

<script>

import Icon from './Icon.vue';
import { getDayOfWeek } from '../util';
import { getGradeColor } from '../dataHandler';
import { Grade } from '../data/Grade';



export default {
    name:"TimelineItem",
    props:["item"],
    methods:{
        getItemColor(item){
            if (item instanceof Grade){
                return getGradeColor(item);
            }
        },
        getDayOfWeek,
        formatDate(date){
            let p = (n) => n.toString().padStart(2,0);
            return p(date.getMonth()+1)+"/"+p(date.getDate());
        }
    },
    components:{
        Icon
    }
}
</script>

<style>
.itemWrap {
    padding: 0 10px;
    padding-bottom: 8px;
    box-sizing: border-box;
}
</style>