// require js config
require.config({
    baseUrl:"js",
    
    paths:{
    	"vue":"lib/vue.min",
    	"jquery":"lib/jquery-3.4.0.min",
    }
});

require(["index"]);