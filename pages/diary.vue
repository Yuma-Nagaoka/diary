<template>
    <div class="container">
        <h1>Diary</h1>
        {{this.$store.state.diary.message}}
        <table>
            <tr>
                <th>Title</th>
                <td><input type="text" name="title" class="title" size="40" v-model="title">
                <transition name="button_group1">
                    <v-btn v-if="sel_flg == false" @click="find">find</v-btn>
                </transition>
                </td>
            </tr>
            <tr>
                <th>Content</th>
                <td><v-textarea name="content" class="content" cols="50" rows="5" v-model="content"></v-textarea></td>
            </tr>
            <tr>
                <th></th>
                <td><v-btn v-if="sel_flg == false" @click="insert">save</v-btn>
                <transition name="button_group1">
                    <span v-if="sel_flg != false">
                        <v-btn @click="update">update</v-btn> 
                        <v-btn @click="remove">delete </v-btn>
                        <v-btn class="right" @click="set_flg">return </v-btn>
                    </span>
                </transition>
                </td>
            </tr>
        </table>
        <!-- <hr> -->
        <br>
        <v-card>
            <v-list list v-if="sel_flg == false">
                <v-list-item
                    v-for="(item, key) in page_items"
                    :key="key"
                    @click="select(item, key)"
                >
                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }} ({{ item.created }})</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card>
        <!-- <hr> -->
        <div class="nav"><span @click="prev">&lt;prev</span> | <span @click="next">next&gt;</span></div>
    </div>
</template>

<script>


export default {
    data: function(){
        return {
            id: '',
            title: '',
            content: '',
            created: '',
            num_per_page: 7,
            find_flg: false,
            sel_flg: false,
            message: ''
        };
    },
    computed: {
        diary: function(){ return this.$store.state.diary.diary; },
        page_items: function(){
            if(this.find_flg){
                var arr = [];
                var data = this.$store.state.diary.diary;
                data.forEach(element => {
                    if(element.title.toLowerCase().indexOf(this.title.toLowerCase()) >= 0){
                        arr.push(element);
                    }
                });
                return arr;
            }else if(this.sel_flg != false){
                return [this.sel_flg];
            }else {
                return this.$store.state.diary.diary;//.slice(this.num_per_page * this.$store.state.diary.page, this.num_per_page * (this.$store.state.diary.page + 1));
            }
        },
        page: {
            get: function(){
                return this.$store.state.diary.page;
            },
            set: function(p){
                var pg = p > (this.$store.state.diary.diary.length - 1) / this.num_per_page ? Math.ceil((this.$store.state.diary.diary.length -1) / this.num_per_page) - 1 : p;
                pg = pg < 0 ? 0 : pg;
                this.$store.commit('diary/set_page', pg);
            }
        },
    },
    methods: {
        set_flg: function(){
            if(this.find_flg || this.sel_flg != false){
                this.find_flg = false;
                this.sel_flg = false;
                this.title = '';
                this.content = '';
                this.created = '';
            }
        },
        insert: function(){
            this.$store.dispatch('diary/insert', {title:this.title, content:this.content});
            // function sleep (time) {
            //     return new Promise((resolve) => {
            //         setTimeout(resolve, time)
            //     })
            // }
            const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            async function f(){
                await _sleep(2000);
            }
            f();
            this.$store.dispatch('diary/fetch');
            this.id = '';
            this.title = '';
            this.content= '';
        },
        update: function(){
            if(this.sel_flg == false){
                return;
            }else {
                this.$store.commit('diary/update', {id:this.sel_flg.id, title:this.title, content:this.content, created:this.created});
                this.title = '';
                this.content = '';
                this.created = '';
                this.set_flg();
            }
        },
        select: function(item, key){
            this.find_flg = false;
            this.sel_flg = item;
            this.id = key;
            this.title = item.title;
            this.content = item.content;
            this.created = item.created;
        },
        // getData: function() {
        //     axios.get(url + '.json').then((res) => {
        //         this.message = 'get all data.';
        //         this.json_data = res.data;
        //     }).catch((error) => {
        //         this.message = 'ERROR!';
        //         this.json_data = {};
        //     });
        // },
        remove: function(){
            if(this.sel_flg == false){
                return;
            }else {
                this.$store.commit('diary/remove', this.sel_flg);
                this.set_flg();
            }
        },
        find: function(){
            this.sel_flg = false;
            this.find_flg = true;
        },
        next: function(){
            this.page++;
        },
        prev: function(){
            this.page--;
        },
    },
    created: function(){
        this.$store.commit('diary/set_page', 0);
        this.$store.dispatch('diary/fetch');
    },
}
</script>

<style>
.container {
    padding: 5px 10px;
}
h1 {
    font-size: 60pt;
    color: #345980;
}
p {
    padding-top: 5px;
    font-size: 20pt;
}
div {
    font-size: 14pt;
}
pre {
    padding: 10px;
    font-size: 18pt;
    background-color: #efefef;
}
table {
    width:585px;
}
.title {
    background-color: white;
}
input {
    font-size: 14pt;
    margin: 5px;
}
textarea {
    font-size: 14pt;
    margin: 5px;
    background-color: white;
}
/* button {
  color:rgba(43, 32, 32, 0.76) ;
  font-size: 18px;
  cursor: pointer;
  padding: 5px 25px;
  background-color: white;
  border: 1px solid #D7DBDD;
  border-radius: 0;
  outline: 0;
} */
.right {
    float: right;
}
hr {
    border-style: none;
    border-top: solid;
    border-width: 5px;
    border-color: #def;
    margin: 20px 0px 10px 0px;
}
li {
    font-size: 14pt;
    height: 32px;
}
th {
    background-color: #345980;
    color: white;
}
td {
    background-color: aliceblue;
    color: #345980;
    padding: 5px;
}
.nav {
    padding: 0px 10px;
    cursor : pointer;
}
.list {
    cursor : pointer;
}
.button_group1-enter-active, .button_group1-leave-active {
    transition: opacity .5s;
}
.button_group1-enter, .button_group1-leave-to {
    opacity: 0;
}
</style>

                    