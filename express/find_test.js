var arr = [{name:'hui'},{name:'ha'}];
var item = arr.find(function (item) {
    if(item.name=='ha'){
        return item;
    }
});
console.log(item);