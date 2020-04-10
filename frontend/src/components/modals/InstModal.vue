<template>
<div id="school_section">
    <div id="searchCont">
        <input aria-label="Intézmény neve" type="text" placeholder="Intézmény keresése" v-on:input="setSearch($event.target.value)">
    </div>
    <div id="schools">
        <DynamicScroller
            :items="filtered"
            :min-item-size="30"
            key-field="code"
            class="scroller"
            :buffer="300"
        >
            <template #before>
                <div v-if="filtered.length == 0" id="noresults">
                    A keresett intézményre nincs találat
                </div>
            </template>
            <template v-slot="{ item, index, active }">
            <DynamicScrollerItem
                :item="item"
                :active="active"
                :size-dependencies="[
                    item.inst,
                    item.city,
                ]"
                :data-index="index"
                :data-active="active"
                class="instItem"
            >
                <div v-on:click="select(item)" class="school">
                    <input type="radio" name="inst" :value="item.inst" :id="item.inst" :data-test="item.code">
                    <span class="checkmark">
                        
                    </span>
                    <label :for="item.inst"> {{ item.name }}
                        <i>({{ item.city }})</i>
                    </label>
                </div>
            </DynamicScrollerItem>
            </template>
        </DynamicScroller>
    </div>
</div>
</template>

<script>
import { getInst } from '../../dataHandler'
export default {
    name:"InstModal",
    props:["obj","close"],
    data(){
        return {
            search:"",
            inst:getInst()
        }
    },
    computed:{
        filtered: function(){
            let filtered = this.inst.filter((i)=>{
                return this.isShowInSearch(i);
            })
            return filtered;
        }
    },
    methods:{
        select(item){
            this.obj.change(item);
            this.close();
        },
        setSearch(s){
          this.$nextTick(()=>{
              this.search = s;
          });
          
      },
      isShowInSearch(i){
            let searchProps = ["code","name","city"];
            for (const [key, value] of Object.entries(i)){
                if (searchProps.includes(key)){
                if (value.toLowerCase().indexOf(this.search.trim().toLowerCase()) != -1){    
                        
                        return true;   
                    }
                }
            }
            return false;
      }
    }
}
</script>

<style scoped>
.content {
    margin-top: 0 !important;
}
.scroller {
    height: 150px;
    overflow-y: auto;
}
#noresults {
    padding: 0 10px;
    text-align: center;
}
#searchCont {
    padding: 0 10px;
    box-sizing: border-box;
}
#school_section input[type="text"]{
    background-color: var(--element2-color);
    color: var(--text-color);
    border: none;

    width: 100%;
    font-size: 16px;
    padding: 10px 20px;
    box-sizing: border-box;
    margin: 10px 0;
    border-radius: 8px;
    outline: none;
}
#school_section input[type="text"]::placeholder {
    color: var(--text-smol);
}
#schools {
    width: 100%;
    margin: auto;
    height: 150px;
    overflow: auto;
    color: var(--text-color);
    /* border-top: 1px solid var(--divider-color); */
}

.school {
    box-sizing: border-box;
    padding: 8px 15px;
    text-align: left;
}
.school i {
    color: var(--text-smol);
    font-style: normal;
}
.school input {
    display: none;
}
.school label {
    vertical-align: middle;
}
.school .checkmark {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: var(--text-color);
    opacity: 0.3;
    display: inline-block;
    vertical-align: middle;
    color: green;
}
.school .checkmark i {
    color: inherit;
}
.school input:checked ~ .checkmark {
    background-color: #1CAA53;
    opacity: 1;
}

</style>