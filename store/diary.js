function zeroPadding(num,length){
    return ('0000000000' + num).slice(-length);
}

export const state = () => ({
    diary: [],
    page: 0,
})

export const mutations = {
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