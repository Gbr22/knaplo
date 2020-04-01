<template>
<div class="itemWrap">
    <div class="gradeLike recent" :data-item-type="item.type" :data-state="item.displayState" v-on:click="item.onclick()">
        <span v-if="(item.icon+'').startsWith('fi')" class="left">
            <svg class="feather">
                <use :xlink:href="'/'+item.icon"/>
            </svg>
        </span>
        <span v-else class="left">
            {{ item.icon }}
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
export default {
    name:"TimelineItem",
    props:["item"],
    methods:{
        getDayOfWeek(date){
            let days = ["Vasárnap","Hétfő","Kedd","Szerda","Csütörtök","Péntek"];
            return days[date.getDay()];
        },
        formatDate(date){
            let p = (n) => n.toString().padStart(2,0);
            return p(date.getMonth()+1)+"/"+p(date.getDate());
        }
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