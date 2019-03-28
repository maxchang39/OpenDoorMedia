// require js config
require.config({
    baseUrl:"js",
    
    paths:{
    	"vue":"lib/vue.min",
    	"jquery":"lib/jquery-3.2.1.min"
    }
});

require(["index"]);