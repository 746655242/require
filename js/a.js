define(['jquery','b','c'],function($,B,C){
	return{
		init:function(){
			console.log($(window));
			console.log('a加载')
			B.init();
			C.init();
			
		}
	}
});
