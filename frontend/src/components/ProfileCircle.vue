<template>
    <div :style="{
        'background-color':getColorForString(name),
        'color':getColorForString(name,true),
    }">
        <span class="text">{{ getInitals() }}</span>
    </div>
</template>

<script>
import seedrandom from 'seedrandom';
import { randomInt } from '../util';


export default {
    name:"ProfileCircle",
    props:["name"],
    methods:{
        getColorForString(str,text){
            let rng = seedrandom(str);
            let hue = randomInt(0,360,rng);
            if (text){
                return `hsla(${hue}, 100%, 10%,0.85)`;
            }
            return `hsla(${hue}, 100%, 70%,0.5)`;
        },
        getInitals(){
            return this.name.split(" ").splice(0,2).map(e=>e[0]).join("");
        }
    }
}
</script>

<style scoped>
div {
    background-color: var(--element2-color);
    border-radius: 50%;
    margin-right: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    
}
.text {
    font-size: 16px;
    font-weight: bold;
}


</style>