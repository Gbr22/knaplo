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
                    <div class="itemWrap">
                        <div class="gradeLike recent">
                            <span v-if="(item.icon+'').startsWith('fi')" class="left">
                                <svg class="feather">
                                    <use :xlink:href="'/'+item.icon"/>
                                </svg>
                            </span>
                            <span v-else class="left" :data-grade="item.icon">
                                {{ item.icon }}
                            </span>
                            <span class="right">
                                <div class="header">
                                    {{ item.header }}
                                </div>
                                <span class="bottom">{{ item.desc }}</span>
                            </span>
                            <span class="date"><b>{{ getDayOfWeek(new Date(item.date)) }}</b><br><i>{{ formatDate(new Date(item.createDate)) }}</i></span>
                        </div>
                    </div>
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


export default {
    name:"Timeline",
    data:()=>({
        GlobalState,
    }),
    methods:{
        getItemsList(){
            let arrays = [this.GlobalState.processedData.grades,this.GlobalState.processedData.notes]
            
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
.itemWrap {
    padding: 0 10px;
    padding-bottom: 8px;
    box-sizing: border-box;
}

</style>