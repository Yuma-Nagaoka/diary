import axios from 'axios'

const url = "https://okayu-vue.firebaseio.com/diary";

function zeroPadding(num,length){
    return ('0000000000' + num).slice(-length);
}

export const state = () => ({
    diary: {},
    page: 0,
    json_data: {},
    message: 'init',  
})

export const mutations = {
    set: function(state, data){
        state.message = 'get all data.';
        let keys = Object.keys(data);
        keys.sort(function(a, b){return b - a});
        for(let key of keys) {
            state.diary[key] = data[key];
        }
        // data.sort(function(a,b){
        //     console.log(a);
        //     console.log(b);
        //     if(a < b) return -1;
        //     if(a > b) return 1;
        //     return 0;
        // });
        // state.diary = data;
    },
    insert: function(state, obj){
        var date = new Date();
        var format = date.getFullYear() + '-' + (date.getMonth() + 1)
            + '-' + date.getDate() + '-' + zeroPadding(date.getHours(), 2) + ':'
            + zeroPadding(date.getMinutes(), 2);
        state.diary.unshift({
            id: state.diary.length,
            title: obj.title,
            content: obj.content,
            created: format
        });
    },
    update: function(state, obj){
        var date = new Date();
        for(let i = 0; i < state.diary.length; i++){
            const ob = state.diary[i];
            if(ob.id == obj.id){
                    alert('update it! --' + obj.title);
                    ob.title = obj.title;
                    ob.content = obj.content;
                    return;
                }
        }
    },
    set_page: function(state, p){
        state.page = p;
    },
    remove: function(state, obj){
        var num = 0;
        for(let i = 0; i < state.diary.length; i++){
            const ob = state.diary[i];
            if(ob.title == obj.title && ob.content == obj.content && ob.created == obj.created){
                alert('remove it! --' + obj.title);
                state.diary.splice(i, 1);
                return;
            }
        }
    },
}

export const actions = {
    fetch: function({commit}){
        async function f() {
            const result = await axios.get(url + '.json');
            commit('set', result.data);
        }
        f();
    },
    insert: function(context, item){
        var date = new Date();
        const id = date.getFullYear().toString() + zeroPadding((date.getMonth() + 1), 2).toString() + zeroPadding(date.getDate(), 2).toString() 
            + zeroPadding(date.getHours(), 2).toString() + zeroPadding(date.getMinutes(), 2).toString() + zeroPadding(date.getSeconds(), 2).toString();
        const format = date.getFullYear() + '-' + (date.getMonth() + 1)
            + '-' + date.getDate() + '-' + zeroPadding(date.getHours(), 2) + ':'
            + zeroPadding(date.getMinutes(), 2);
        const add_url = url + '/' + id + '.json';
        item.created = format;
        async function f() {
            await axios.put(add_url, item);
        }
        f();
        // axios.put(add_url, item).then((re)=> {
        //     // this.email = '';
        //     // this.username = '';
        //     // this.age = '';
        //     // this.tel = '';
        //     // this.getData();
        // });
    },
    update: function(context, item){
        const update_url = url + '/' + item.id + '.json';
        async function f() {
            await axios.put(update_url, item);
        }
        f();
    }
}