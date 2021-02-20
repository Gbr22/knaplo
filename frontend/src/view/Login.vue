<template>
  <div id="login_form">
        <div id="login_wrap">
            
            <div class="logo"><img :src="`icons/icon_transparent_vector.svg`" alt="Logo" /></div>
            <h1>Bejelentkezés</h1>
            <form v-on:submit.prevent="onSubmit" enctype="text/plain">
                
                
                <input v-model="form.username" aria-label="Felhasználónév" name="username" type="text" placeholder="Felhasználónév" autocomplete="username" required>
                <input v-model="form.password" aria-label="Jelszó" name="password" type="password" placeholder="Jelszó" autocomplete="current-password" required>
                <p id="selectInst" @click="selectInst">{{ inst.name }}</p>

                <button id="submit">Bejelentkezés</button>
                
            </form>
        </div>
        
    </div>
</template>

<script>

import { afterLogin } from '../dataHandler';
import { login } from '../api';
import { openModal } from '../components/Modal';
import InstModal from '../components/modals/InstModal';
import {pushError } from '../components/MessageDisplay';

export default {
  name: 'Login',
  data: ()=>{
      let data = {
        /* filtered:[].concat(window.GlobalState.inst), */
        inst:{name:"Intézmény kiválasztása"},
        form:{
            inst:"",
            username:"",
            password:""
        }
      };
      
      return data;
  },
    methods:{
        selectInst(){
            openModal("Intézmény választása", InstModal, {
                change:(to)=>{
                    this.inst = to;
                    this.form.inst = to.code;
                }
            });
        },
        onSubmit(){
            login(this.form).then((result)=>{
                window.GlobalState.user = result;
                window.GlobalState.loggedIn = true;
                afterLogin();
                console.log(result);
            }).catch(err=>{
                pushError(err.toString());
            })
        },
      
    }
  
}
</script>


<style scoped>

#selectInst {
    color: var(--text-light-color);
}

.logo {
    display: block;
}
.logo img {
    height: 60px;
    border-radius: 50%;
    background-color: var(--modal-color);
    box-shadow: var(--elem-shadow);
    margin: 10px 0;
}
    
#login_form {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    top: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    overflow: hidden;
    flex-direction: column;
}
#login_error {
    background-color: var(--error-color);
    padding: 5px;
    border-radius: 8px;
    margin-bottom: 20px;
}
#login_wrap {
    background-color: var(--bg-color);
    vertical-align: middle;
    padding: 20px;
    box-sizing: border-box;
    overflow: auto;
    flex: none;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
    width: min(320px,100%);
}
#login_form h1 {
    margin-top: 0;
    margin-bottom: 15px;
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
#login_form input[type="text"], #login_form input[type="password"], #login_form #submit {
    box-sizing: border-box;
    display: block;
    border: 1px solid var(--divider-color);
    padding: 10px 20px;
    box-sizing: border-box;
    width: 100%;
    margin: 10px 0;
    border-radius: 8px;
    outline: none;
    color: var(--text-color);
    background-color: var(--element2-color);
    font-size: 16px;
}
#login_form #submit {
    background-color: #1ca04e;
    border: none;
    /*color: rgb(240, 255, 249);*/
    color:#1d1d1d;
    margin-top: 30px;
}

</style>
