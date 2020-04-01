<template>
    <div class="timeline" id="recent">
        
        <div class="container">
            <DynamicScroller
                :items="getItemsList()"
                :min-item-size="30"
                key-field="key"
                class="scroller"
                :buffer="500"
            >
                <template #before>
                    <h1 id="header">
                        <span class="left" id="recentModeSelector" @click="selectMode()">
                            {{ getShowName() }}
                        </span>
                        <span class="right">
                            <svg class="feather">
                                <use :xlink:href="'/'+getShowIcon()"/>
                            </svg>
                        </span>
                        
                        
                    </h1>
                    <div v-if="show == 'absences'" id="absenceCount">
                        <p>Késések összesen: <b>{{ getDelayMinutes() }} perc</b></p>
                        <p>Igazolatlan: <b>{{ getAbsenceCount(false) }} óra</b></p>
                        <p>Igazolt: <b>{{ getAbsenceCount(true) }} óra</b></p>
                    </div>
                </template>
                <template v-slot="{ item, index, active }">
                <DynamicScrollerItem
                    :item="item"
                    :active="active"
                    :size-dependencies="[
                        item.desc,
                        item.header,
                    ]"
                    :data-index="index"
                    :data-active="active"
                >
                    <TimelineItem :item="item" />
                </DynamicScrollerItem>
                </template>
                <template #after>
                    <div id="bottomPadding"></div>
                </template>
            </DynamicScroller>
        </div>
    </div>
</template>

<script>
import GlobalState from '../globalState';
import TimelineItem from '../components/TimelineItem';
import { openModal } from '../components/Modal';
import SelectModal from '../components/modals/SelectModal';

let modes = {
    all:["Minden", "fi#box"],
    grades:["Jegyek", "fi#book"],
    notes:["Feljegyzések", "fi#clipboard"],
    absences:["Mulasztások","fi#watch"]
};

export default {
    name:"Timeline",
    data:()=>{
        let stored = localStorage.getItem("timelineMode");

        let show = "all";

        if(Object.keys(modes).includes(stored)){
            show = stored;
        }


        return {
            GlobalState,
            show,
        }
    },
    methods:{
        getAbsenceCount(justified){
            let sum = 0;
            for (let e of this.GlobalState.processedData.absences){
                if (e.justified == justified){
                    sum++;
                }
            }
            return sum;
        },
        getDelayMinutes(){
            let sum = 0;
            for (let e of this.GlobalState.processedData.delays){
                sum += e.delayMinutes;
            }
            return sum;
        },
        selectMode(){
            let options = Object.keys(modes).map((mode)=>{
                return {
                    value:mode,
                    display:modes[mode][0],
                    icon:modes[mode][1]
                }
            })

            openModal("Idővonal",SelectModal, {
                options,
                currentValue:this.show,
                callback: (value)=>{
                    this.show = value;
                    localStorage.setItem("timelineMode",value);
                }
            })
        },
        getShowName(){
            let map = modes;
            return map[this.show][0];
        },
        getShowIcon(){
            let map = modes;
            return map[this.show][1];
        },
        getItemsList(){
            let map = {
                grades:this.GlobalState.processedData.grades,
                notes:this.GlobalState.processedData.notes,
                absences:[this.GlobalState.processedData.absentDays,
                this.GlobalState.processedData.delays]
            };

            let arrays = [];

            if (this.show == "all"){
                arrays = Object.values(map);
            } else {
                arrays = map[this.show] || [];
            }
            
            let arr = arrays.flat().flat();
            arr.sort((a,b)=>{
                return new Date(b.createDate) - new Date(a.createDate);
            });

            /* let r = arr.splice(0,10);
            setTimeout(()=>{
                r.push(...arr);
            },1000)
            
            return r; */
            return arr;
        },
    },
    components:{
        TimelineItem
    }
}
</script>

<style scoped>
#bottomPadding {
    height: 10px;
}
.timeline {
    position: relative;
    height: 100%;
    width: 100%;
}
.scroller {
    
    height: 100%;
    width: 100%;
    
    overflow-y: auto;
}
.container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
}
#header {
    padding: 10px;
    box-sizing: border-box;
}

</style>