define([], function () {
    var common = {};
    
    common.a = 12345;
    common.test = function(){
    	console.log("this is a test");
    }
    
    return common;
})