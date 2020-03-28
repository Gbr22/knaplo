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
                        <span class="left" id="recentModeSelector">
                            Idővonal
                        </span>
                        <span class="right">
                            <svg class="feather">
                                <use :xlink:href="'fi#'+'box'"/>
                            </svg>
                        </span>
                        
                        
                    </h1>
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

export default {
    name:"Timeline",
    data:()=>({
        GlobalState,
    }),
    methods:{
        getItemsList(){
            let arrays = [
                this.GlobalState.processedData.grades,
                this.GlobalState.processedData.notes,
                this.GlobalState.processedData.absentDays,
                this.GlobalState.processedData.delays,
            ]
            
            let arr = arrays.flat();
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