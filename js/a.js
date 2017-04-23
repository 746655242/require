define(['b','c','jquery'],function(B,C,$){
	return{
		init:function(){
			console.log($(window));
			console.log('a加载')
			$('#top').append('<p>a加载</p>');
			
			B.init();
			C.init();
			
		}
	}
});
