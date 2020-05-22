<template>
    <span v-html="getIcon(src)">

    </span>
</template>

<script>
import feather from 'feather-icons';

export default {
    props:["src"],
    methods:{
        getIcon(icon){
            let parts = icon.split("/");
            let type = parts[0];
            let name = parts[1];

            let i = feather.icons[name];
            if (i){
                return i.toSvg();
            }
        }
    }
}
</script>

<style>

</style>