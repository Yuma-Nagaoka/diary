import axios from 'axios'

const url = "https://okayu-vue.firebaseio.com/diary_private";

function zeroPadding(num,length){
    return ('0000000000' + num).slice(-length);
}

export const state = () => ({
    diary: [],
    page: 0,
    json_data: {},
    message: 'init',  
})

export const mutations = {
    set: function(state, data){
        state.message = 'get all data!';
        let keys = Object.keys(data);
        keys.sort(function(a, b){return b - a});
        for(let key of keys) {
            state.diary.push(data[key]);
        }
        // state.diary = data;
        console.log('done mutations:set');
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
    // update: function(state, obj){
    //     var date = new Date();
    //     for(let i = 0; i < state.diary.length; i++){
    //         const ob = state.diary[i];
    //         if(ob.id == obj.id){
    //                 alert('update it! --' + obj.title);
    //                 ob.title = obj.title;
    //                 ob.content = obj.content;
    //                 return;
    //             }
    //     }
    // },
    set_page: function(state, p){
        state.page = p;
    },
    // remove: function(state, obj){
    //     var num = 0;
    //     for(let i = 0; i < state.diary.length; i++){
    //         const ob = state.diary[i];
    //         if(ob.title == obj.title && ob.content == obj.content && ob.created == obj.created){
    //             alert('remove it! --' + obj.title);
    //             state.diary.splice(i, 1);
    //             return;
    //         }
    //     }
    // },
}

export const actions = {
    fetch: function({commit}){
        axios.get(url + '.json').then((res) => {
            commit('set', res.data);
            console.log('Executed fetch_action')
        }).catch((error) => {
            commit('set', []);
            console.log('Error occurred at fetch_action', error)
        });
    },
    insert: function(context, item){
        var date = new Date();
        const id = date.getFullYear().toString() + zeroPadding((date.getMonth() + 1), 2).toString() + zeroPadding(date.getDate(), 2).toString() 
            + zeroPadding(date.getHours(), 2).toString() + zeroPadding(date.getMinutes(), 2).toString() + zeroPadding(date.getSeconds(), 2).toString();
        const format = formatDate(id);
        function formatDate(strDate){
            return strDate.slice(0,4) + '/' + strDate.slice(4,6) + '/' + strDate.slice(6,8) + ' ' + strDate.slice(8,10) + ':' + strDate.slice(10,12);
        }
            // date.getFullYear() + '-' + (date.getMonth() + 1)
            // + '-' + date.getDate() + '-' + zeroPadding(date.getHours(), 2) + ':'
            // + zeroPadding(date.getMinutes(), 2);
        const add_url = url + '/' + id + '.json';
        item.id = id;
        item.created = format;
        async function f() {
            await axios.put(add_url, item);
        }
        f();
        console.log('Executed insert_action')
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
        console.log(item, update_url);
        alert('update it! --' + item.title);
        async function f() {
            await axios.put(update_url, item);
        }
        f();
    },
    remove: function(context, item){
        const remove_url = url + '/' + item.id + '.json';
        alert('remove it! --' + item.title);
        async function f() {
            await axios.delete(remove_url);
        }
        f();
    }
}