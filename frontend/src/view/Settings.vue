<template>
    <div id="info_page">
        
        <div id="profile_circle_container">
            <span id="profile_circle">
                <svg class="feather">
                    <use xlink:href="fi#user"/>
                </svg>
            </span>
            <h1 id="fullname">{{ GlobalState.data ? GlobalState.data.Name : "#### ####" }}</h1>
        </div>

        <section id="more">
            <div class="header">Továbbiak</div>
            <div class="content">
                <div class="item" @click="navigate('more/halfyr')">
                    <span class="icon">
                        <svg class="feather">
                            <use xlink:href="fi#list"/>
                        </svg>
                    </span>
                    <p>
                        Lezárások
                    </p>
                </div>
                <div class="item" @click="openConfirm('Biztosan Kilép?',logout)">
                    <span class="icon">
                        <svg class="feather">
                            <use xlink:href="fi#log-out"/>
                        </svg>
                    </span>
                    <p>
                        Kijelentkezés
                    </p>
                </div>
            </div>
        </section>
        <section id="settings">
            <div class="header">Beállítások</div>
            <div class="content">
                <div class="item">
                    <span class="icon">
                        <svg class="feather">
                            <use xlink:href="fi#moon"/>
                        </svg>
                    </span>
                    <p>
                        Sötét téma
                    </p>
                    <span class="action">
                        <label class="switch">
                            <input type="checkbox" :checked="ThemeHandler.isDark()" @click="ThemeHandler.toggleDarkMode()">
                            <span class="slider"></span>
                        </label>
                    </span>
                </div>
            </div>
        </section>
        <div id="credits">
            <div><img src="icons/icon_vector.svg" /></div>
            <h2>K napló</h2>
            <p>Webappot készítette <a class="link" href="https://www.instagram.com/gaborkrisko/" target="_blank">Kriskó Gábor</a></p>
            <p>Forráskód <a class="link" href="https://github.com/Gbr22/knaplo"  target="_blank">itt</a> található</p>
        </div>
    </div>
</template>

<script>
import GlobalState from '../globalState';
import ThemeHandler from '../themeHandler';
import Cookies from 'js-cookie';
import { navigate } from '../util';
import ConfirmModal, { openConfirm } from '../components/modals/ConfirmModal.vue';


export default {
    name: 'Settings',
    components: {
        
    },
    data:()=>{
        return {
            GlobalState,
            ThemeHandler,
            cacheCount:0
        }
    },
    methods:{
        openConfirm,
        navigate,
        logout(){
            GlobalState.loggedIn = false;
            GlobalState.user = null;
            Cookies.remove("loginInfo");
        }
    }
    
}
</script>

<style>
section {
    margin-bottom: 20px;
}
section .header {
    text-align: left;
    margin: 0 20px;
    padding: 5px 10px;
    font-size: 18px;
}
section .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: var(--element-color);
    box-shadow: var(--elem-shadow);
    margin: 0 20px;
    padding: 10px 10px;
    border-radius: 15px;
    margin-bottom: 8px;
}
.item .icon {
    display: block;
    width: 40px;
    flex: none;
    display: flex;
    justify-content: center;
    align-items: center;
}
.item p {
    margin: 0;
    flex: 1;
    text-align: left;
    padding: 0 5px;
}

#profile_circle_container {
    margin: 60px 0;
    text-align: center;
}
#profile_circle svg {
    width: 30px;
    height: 30px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    display: inline-block;
    stroke: var(--text-smol);
}
#profile_circle {
    display: inline-block;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: var(--element2-color);
    position: relative;
}
#info_action .simplebtn {
    border: 0;
    background: transparent;
}
#info_action .simplebtn svg {
    stroke: var(--text-smol);
    
}




.switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 26px;
}

.switch input { 
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--element2-color);
    -webkit-transition: .4s;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
}

input:checked + .slider {
    background-color: #00cc99;
}

input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
    transform: translateX(24px);
}

/* Rounded sliders */
.slider {
    border-radius: 26px;
}

.slider:before {
border-radius: 50%;
}

#credits {
    background-color: var(--modal-color);
    box-shadow: var(--modal-shadow);
    margin: 0 20px;
    margin-top: 60px;
    padding: 20px;
    border-radius: 15px;
    margin-bottom: 20px;
    text-align: center;
}
#credits h2 {
    margin-bottom: 13px;
}
#credits img {
    height: 45px;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.10);
}

#credits h2 img, #credits h2 span {
    display: inline-block;
    vertical-align: middle;
}
#credits p {
    margin: 0;
    margin-top: 2px;
}
</style>
