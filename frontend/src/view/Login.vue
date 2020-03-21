<template>
  <div id="login_form">
        <div id="login_wrap">
            
            <h1>Bejelentkezés a Krétába</h1>
            <form action="/api/login" enctype="text/plain">
                <div id="school_section">
                    <input aria-label="Intézmény neve" type="text" placeholder="Intézmény keresése" v-model="search">
                    <div id="schools">
                        
                        <div v-for="school in searchSchool(search)" class="school" :key="school.code">
                            
                            <div v-on:click="selected_inst = school.inst">
                                <input type="radio" name="inst" :value="school.inst" :id="school.inst" :checked="selected_inst == school.inst">
                                <span class="checkmark">
                                    
                                </span>
                                <label :for="school.inst"> {{ school.name }}
                                    <i>({{ school.city }})</i>
                                </label>
                            </div>
                            
                            
                        </div>
                        <div v-if="searchSchool(search).length == 0">
                            A keresett intézményre nincs találat
                        </div>
                    </div>
                </div>
                
                <span id="selected_inst">{{ selected_inst }}</span>
                <input aria-label="Felhasználónév" name="username" type="text" placeholder="Felhasználónév" autocomplete="username" required>
                <input aria-label="Jelszó" name="password" type="password" placeholder="Jelszó" autocomplete="current-password" required>
                <input type="submit" value="Bejelentkezés">
                
            </form>
        </div>
        
    </div>
</template>

<script>
export default {
  name: 'Login',
  data: ()=>{
      let data = {
        selected_inst: "",
        inst:window.GlobalState.inst,
        /* filtered:[].concat(window.GlobalState.inst), */
        search:"",
      };
      
      return data;
  },  
  methods: {
      searchSchool(search){
        let filtered = this.inst.filter((i)=>{
            let searchProps = ["code","name","city"];
            for (const [key, value] of Object.entries(i)){
                if (searchProps.includes(key)){
                    if (value.toLowerCase().indexOf(search.toLowerCase()) != -1){    
                        
                        return true;   
                    }
                }
            }
            
            return false;
            
        })
        return filtered;
      }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
