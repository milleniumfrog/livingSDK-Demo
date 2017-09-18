<template lang="pug">
div(id='List')
    div(id="button") 
        div(class="flex")
        div(
            id="btn" 
            :style="{backgroundColor: status() === 'anwesend' ? 'rgb(59, 255, 47)' : '#FF4962'}"
            @click="update"
        ) {{status()}}
        div(class="flex")
    div(v-for="entry in pdata" id="list" v-if="entry.name !== ploggedIn && pdata !== undefined" :style="{backgroundColor: entry.anwesend ? 'white' : '#cccccc'}")
        div
            span {{entry.name}}
            div(:style="{backgroundColor: entry.anwesend ? 'rgb(59, 255, 47)' : '#FF4962'}")
</template>
<script>
import io from 'socket.io-client/dist/socket.io.slim.js';
export default {
    props: [
        'pdata',
        'ploggedIn'
    ],

    methods: {
        status() {
            if (this.pdata !== undefined) {
                for (let entry of this.pdata) {
                    if (entry.name === this.ploggedIn) {
                        return entry.anwesend ? 'anwesend' : 'abwesend';
                    }
                }
            }
        },
        update() {
            let socket = io('http://localhost:3000');
            socket.emit('update', localStorage.getItem('userName'), this.status() === 'anwesend' ? false : true);
        }
    },

    data: function () {
        return {}
    },

    mounted: function () {

    }
}
</script>
<style lang="sass">
#List
    > #button    
        display: flex
        background-color: #3c3c3c
        > .flex
            flex: 1 1
        > #btn 
            width: 100px
            height: 100px
            line-height: 100px
            text-align: center
            border-radius: 50%
            margin: 20px
            color: black
            background-color: #FF4962

    > #list
        height: 50px
        padding: 10px
        border-bottom: 1px solid grey
        background-color: #cccccc
        > div 
            display: flex
            > span
                flex: 1 1
                font-size: 30px
                line-height: 30px
            > div
                height: 30px
                width: 30px
                background-color: #FF4962
                border-radius: 50%
</style>
