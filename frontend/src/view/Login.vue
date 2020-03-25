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

import { login, afterLogin } from '../dataHandler';



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
                  window.GlobalState.user = result.data;
                  window.GlobalState.loggedIn = true;
                  afterLogin();
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


<style scoped>

.scroller {
    height: 150px;
    overflow-y: auto;
}

    
#login_form {
    text-align: center;
    display: table;
    
    position: relative;
    top: 0;
    bottom: 0;
    left: 0;
    height: 100vh;
    height: var(--vh-100);
    width: 100%;
}
#login_error {
    background-color: var(--error-color);
    padding: 5px;
    border-radius: 8px;
    margin-bottom: 20px;
}
#login_wrap {
    background-color: var(--bg-color);
    display: table-cell;
    vertical-align: middle;
    padding: 0 20px;
}
#login_form h1 {
    margin-top: 0;
}
button, input {
    font-family: Helvetica, sans-serif;
}
input:-webkit-autofill,
input:-webkit-autofill:hover, 
input:-webkit-autofill:focus, 
input:-webkit-autofill:active  {
    font-size: 16px;
    -webkit-text-fill-color: var(--text-color);
    transition: "color 9999s ease-out, background-color 9999s ease-out";
    transition-delay: 9999s;
}
#login_form input[type="text"], #login_form input[type="password"], #login_form input[type="submit"] {
    box-sizing: border-box;
    width: 100%;
    display: block;
    border: 1px solid var(--divider-color);
    padding: 10px 20px;
    margin: 10px auto;
    border-radius: 8px;
    outline: none;
    color: var(--text-color);
    background-color: var(--element2-color);
    font-size: 16px;
}
#login_form input[type="submit"] {
    background-color: #199649;
    border: none;
    /*color: rgb(240, 255, 249);*/
    color:white;
}

#school_section {
    background-color: #2E2D2E;
    padding: 5px 20px;
    border-radius: 15px;
}
#school_section input[type="text"]{
    background-color: rgb(59, 59, 59);
    color: rgb(228, 228, 228);
    border: none;
}
#schools {
    width: 100%;
    margin: auto;
    height: 150px;
    overflow: auto;

    color: rgb(228, 228, 228);
}

.school {
    box-sizing: border-box;
    padding: 8px 15px;
    text-align: left;
}
.school i {
    color: #949494;
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
    background-color: #b3b3b3;
    display: inline-block;
    vertical-align: middle;
    transition: opacity .3s ease-out;
    color: green;
}
.school .checkmark i {
    color: inherit;
}
.school input:checked ~ .checkmark {
    background-color: #1CAA53;
}

</style>
