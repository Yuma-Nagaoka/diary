export const state = () => ({
    diary: [],
    page: 0,
})

export const mutations = {
    insert: function(state, obj){
        var date = new Date();
        var format = date.getFullYear() + '-' + (date.getMonth() + 1)
            + '-' + date.getDate() + '-' + date.getHours() + ':'
            + date.getMinutes();
        state.diary.unshift({
            title: obj.title,
            content: obj.content,
            created: format
        });
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