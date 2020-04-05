<template>
    <div class="screen">
        <div class="head">
            <h1>Házi feladatok</h1>
        </div>

        <HomeworkList :list="getActual()" title="Aktuális" />
        <HomeworkList :list="getExpired()" title="Lejárt határidejű" />
    </div>
</template>

<script>
import GlobalState from '../globalState'

import HomeworkList from '../components/HomeworkList.vue';


export default {
    name:"Homework",
    data(){
        return {
            GlobalState,
            homeworks:GlobalState.processedData.homeworks
        }
    },
    methods:{
        getActual(){
            return this.homeworks.filter((e)=>{
                return new Date(e.homework.Hatarido) > new Date();
            }).sort((a,b)=>{
                let g = x => new Date(x.homework.Hatarido);
                return g(a)-g(b);
            })
        },
        getExpired(){
            return this.homeworks.filter((e)=>{
                return new Date(e.homework.Hatarido) <= new Date();
            }).sort((a,b)=>{
                let g = x => new Date(x.homework.Hatarido);
                return g(b)-g(a);
            })
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
    }
</style>