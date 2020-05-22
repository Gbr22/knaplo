<template>
    <div class="screen">
        <div class="head">
            <h1>Házi feladatok</h1>
        </div>

        <HomeworkList :list="getTomorrow()" title="Holnapra" />
        <HomeworkList :list="getActual()" title="Aktuális" />
        <HomeworkList :list="getExpired()" title="Lejárt határidejű" />
    </div>
</template>

<script>
import GlobalState from '../globalState'

import HomeworkList from '../components/HomeworkList.vue';
import { getHWCompObjFArr } from '../dataHandler';
import { getDateCompareNumber } from '../util';
import { isHomeworkDone } from '../api';


export default {
    name:"Homework",
    data(){
        return {
            GlobalState,
            homeworks:GlobalState.processedData.homeworks,
            homeworksCompleted:GlobalState.processedData.homeworksCompleted,
        }
    },
    methods:{
        isCompleted(hw){
            return hw.IsMegoldva;
            /* return getHWCompObjFArr(hw.Id, this.homeworksCompleted)?.value == true; */
        },
        sortByDone(a,b){
            return this.isCompleted(a.homework) - this.isCompleted(b.homework);
        },
        isExpired(e){
            let g = getDateCompareNumber;
            return g(new Date(e.homework.Hatarido)) < g(new Date());
        },
        isTomorrow(e){
            if (!GlobalState.options["homeworks.separateTomorrow"]){
                return false;
            }
            let g = getDateCompareNumber;
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate()+1);
            let compare = g(new Date(e.homework.Hatarido));
            return compare == g(new Date()) || compare == g(tomorrow);
        },
        getActual(){
            return this.homeworks.filter((e)=>{
                return !this.isExpired(e) && !this.isTomorrow(e);
            }).sort((a,b)=>{
                let g = x => new Date(x.homework.Hatarido);
                return g(a)-g(b);
            }).sort(this.sortByDone)
        },
        getTomorrow(){
            return this.homeworks.filter((e)=>{
                return this.isTomorrow(e);
            }).sort((a,b)=>{
                let g = x => new Date(x.homework.Hatarido);
                return g(a)-g(b);
            }).sort(this.sortByDone)
        },
        getExpired(){
            return this.homeworks.filter((e)=>{
                return this.isExpired(e);
            }).sort((a,b)=>{
                let g = x => new Date(x.homework.Hatarido);
                return g(b)-g(a);
            }).sort(this.sortByDone)
        },
        getFiltered(){
            return this.homeworks;
        },
    },
    components:{
        HomeworkList
    }
}
</script>

<style scoped>
    .head {
        padding: 20px;
        text-align: center;
    }
</style>