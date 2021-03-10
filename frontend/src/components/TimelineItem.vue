<template>
<div class="itemWrap">
    <div class="item recent" :data-item-type="item.type" :data-state="item.displayState" v-on:click="item.onclick()">
        
        <span class="left">
            <Icon :src="item.icon" size="28" :color="getItemColor(item)"/>
        </span>
        <span class="right">
            <div class="header">
                {{ item.header }}
            </div>
            <span class="bottom" v-if="item.desc != null">{{ item.desc }}</span>
        </span>
        <span class="date"><b>{{ getDayOfWeek(new Date(item.date)) }}</b><br><i>{{ formatDate(new Date(item.date)) }}</i></span>
    </div>
</div>
</template>

<script>

import Icon from './Icon.vue';
import { formatDate, getDayOfWeek } from '../util';
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
        formatDate,        
    },
    components:{
        Icon
    }
}
</script>

<style scoped>
.item .left, .item .right{
    display: inline-block;
    vertical-align: middle;
    white-space: initial;
}
.item .right {
    width: 80%;
    width: calc(calc(100% - 43px) - 80px);
}
.item .left {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 5px 10px;
    font-size: 28px;
    font-weight: bold;

}

.item .header {
    font-weight: bold;
    margin-bottom: 3px;
}
.item .date {
    position: absolute;
    right: 10px;
    width: 80px;
    top: 0;
    bottom: 0;
    height: min-content;
    vertical-align: middle;
    margin: auto;
    text-align: right;
    
}



.item .date .relative {
    position: relative;
    display: inline-block;
    width: 100%;
}

.item .right .bottom, .absence p {
    color: var(--text-light-color);
}

.itemWrap {
    padding: 0 10px;
    padding-bottom: 8px;
    box-sizing: border-box;
}
</style>

<style>
.item .date b, .tinyDate b {
    font-weight: normal;
}
.item .date i, .tinyDate i {
    font-style: normal;
    font-size: 15px;
}
</style>