<template>
  <div id="login_form">
        <div id="login_wrap">
            
            <h1>Bejelentkezés a Krétába</h1>
            <form v-on:submit.prevent="onSubmit" enctype="text/plain">
                <div id="school_section">
                    <input aria-label="Intézmény neve" type="text" placeholder="Intézmény keresése" v-on:input="setSearch($event.target.value)">
                    <div id="schools">
                        <DynamicScroller
                            :items="filtered"
                            :min-item-size="30"
                            key-field="code"
                            class="scroller"
                            :buffer="300"
                        >
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
                                <div v-on:click="form.inst = item.code" class="school">
                                    <input type="radio" name="inst" :value="item.inst" :id="item.inst" :checked="form.inst == item.code" :data-test="item.code">
                                    <span class="checkmark">
                                        
                                    </span>
                                    <label :for="item.inst"> {{ item.name }}
                                        <i>({{ item.city }})</i>
                                    </label>
                                </div>
                            </DynamicScrollerItem>
                            </template>
                        </DynamicScroller>
                        
                        <div v-if="filtered.length == 0">
                            A keresett intézményre nincs találat
                        </div>
                    </div>
                </div>
                
                <input v-model="form.username" aria-label="Felhasználónév" name="username" type="text" placeholder="Felhasználónév" autocomplete="username" required>
                <input v-model="form.password" aria-label="Jelszó" name="password" type="password" placeholder="Jelszó" autocomplete="current-password" required>
                <input type="submit" value="Bejelentkezés">
                
            </form>
        </div>
        
    </div>
</template>

<script>

import { login } from '../dataHandler';



export default {
  name: 'Login',
  data: ()=>{
      let data = {
        inst:window.GlobalState.inst,
        /* filtered:[].concat(window.GlobalState.inst), */
        search:"",
        form:{
            inst:"",
            username:"",
            password:""
        }
      };
      
      return data;
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
      onSubmit(){
          login(this.form).then((result)=>{
              if(result.success){
                  window.GlobalState.loggedIn = true;
                  
              }
              console.log(result);
          })
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .scroller {
        height: 150px;
        overflow-y: auto;
    }
</style>
