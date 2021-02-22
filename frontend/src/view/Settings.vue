<template>
    <div id="info_page">
        
        <div id="profile_circle_container">
            <span id="profile_circle">
                <Icon src="fi/user" />
            </span>
            <h1 id="fullname">{{ GlobalState.studentInfo ? GlobalState.studentInfo.Nev : "#### ####" }}</h1>
        </div>

        <div class="settingsArea">
            <section id="more" class="grid">
                <div class="header">Továbbiak</div>
                <div class="content">
                    <div class="item btn" @click="navigate('more/finals')">
                        <span class="icon">
                            <Icon src="fi/list" />
                        </span>
                        <p>
                            Lezárások
                        </p>
                    </div>
                    <div class="item btn" @click="openDKT()">
                        <span class="icon">
                            <Icon src="fi/external-link" />
                        </span>
                        <p>
                            DKT
                        </p>
                    </div>
                    <div class="item btn" @click="openConfirm('Biztosan Kilép?',logout)">
                        <span class="icon">
                            <Icon src="fi/log-out" />
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
                            <Icon src="fi/moon" />
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
                    <div class="item" v-for="[key, e] in Object.entries(options.options)" :key="key">
                        <span class="icon">
                            <Icon :src="'fi/'+e.icon" />
                        </span>
                        <p>
                            {{ e.text }}
                        </p>
                        <span class="action">
                            <label class="switch">
                                <input type="checkbox" :checked="GlobalState.options[key]" @click="options.set(key,!GlobalState.options[key])">
                                <span class="slider"></span>
                            </label>
                        </span>
                    </div>
                </div>
            </section>
            <div id="credits">
                <div><img src="icons/icon_vector.svg" /></div>
                <h2>K napló</h2>
                <p>{{ branch }}/{{ version }}</p>
                <p><a class="link" href="https://github.com/Gbr22/knaplo"  target="_blank">Forráskód</a></p>
            </div>
        </div>
        <div class="pagePadding"></div>
    </div>
</template>

<script>
import GlobalState from '../globalState';
import ThemeHandler from '../themeHandler';
import Cookies from 'js-cookie';
import { navigate, formatURLsHTML } from '../util';
import ConfirmModal, { openConfirm } from '../components/modals/ConfirmModal.vue';
import storage from '../storage';
import options from '../options';
import { httpRequest } from '../http';
import { openModal } from '../components/Modal.vue';
import Icon from '../components/Icon.vue';


export default {
    name: 'Settings',
    components: {
        Icon
    },
    data:()=>{
        return {
            GlobalState,
            ThemeHandler,
            cacheCount:0,
            options,
            version:VERSION,
            branch:BRANCH,
        };
    },
    methods:{
        openConfirm,
        navigate,
        openDKT(){
            let url = `https://dkttanulo.e-kreta.hu/sso?accessToken=${GlobalState.user.access_token}`;
            var win = window.open(url, '_blank');
            win.focus();
        },
        logout(){
            GlobalState.loggedIn = false;
            GlobalState.user = null;
            Cookies.remove("loginInfo");
            storage.removeItem("loginInfo");
        },
        privacy(){
            httpRequest({
                url:"/privacy.txt"
            }).then((resp)=>{
                openModal("Adatkezelés",formatURLsHTML(resp.body));
            })
        }
    }
    
}
</script>

<style scoped>
#settings .header {
    margin-bottom: 5px;
}
.settingsArea {
    max-width: max(500px, 60%);
    margin: 0 auto;
}
section {
    margin-bottom: 20px;
}
section .header {
    text-align: left;
    margin: 0 20px;
    padding: 5px 10px;
    font-size: 18px;
}
section .content {
    margin: 0 20px;
}

section.grid .content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 0 15px;
    
}
section.grid .item {
    flex: 1 1 0;
    min-width: 100px;
    height: 60px;
    flex-direction: column;
    justify-content: center;
    background-color: var(--element-color);
    margin: 5px 5px;
}
section.grid .item p {
    flex: 0;
}
section .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: var(--element-color);
    box-shadow: var(--elem-shadow);
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
    vertical-align: middle;
}

.pagePadding {
    height: 20px;
    width: 100%;
}
#info_page {
    box-sizing: border-box;
}


#profile_circle_container {
    padding: 60px 0;
    text-align: center;
}
#profile_circle .icon /deep/ svg {
    width: 30px;
    height: 30px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    display: inline-block;
    stroke: var(--text-light-color);
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
    stroke: var(--text-light-color);
    
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
    /* box-shadow: 0 0 1px #2196F3; */
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
    background-color: var(--card-color);
    box-shadow: var(--elem-shadow);
    margin: 0 20px;
    margin-top: 60px;
    padding: 20px;
    border-radius: 15px;
    text-align: center;
}
#credits h2 {
    margin-bottom: 13px;
}
#credits img {
    height: 45px;
    border-radius: 50%;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.25);
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