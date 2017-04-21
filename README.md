# 简介
require.js 是简单模块加载器，支持异步加载，并将请求模块反缓浏览器（localStorage）上，达到减少请求。 
require.css加载css样式，并且将样式储存浏览器（localStorage）上，参数是多个对象组成数组, time时间戳，path路径

# 使用       
```html


<script src="js/require.min.js" id="require" ></script>
<script>
require.config={
	baseUrl: "js/",//公共路径
	urlArgs : "20170421", //附加在URL上参数，防止客户端缓存， 测试模式用(new Date()).getTime()
	paths: {//路径缩写
		jquery:'js/jquery.min'
	},
	shim:{//不是正规define事件，配置
		jquery:'$'
	}	
}

//加载样式
var b=[
	{time:'170337',path:'js/base.css'},
	{time:'170337',path:'js/chat.css'}
];
require.css.init(b);

//加载js
require(['a','d','jquery'],function(A,D,$){
	console.log('开始');
	A.init();
	D.init();
	$('#top').html('加载器成功运行');
	console.log('jquery加载')
});
</script>



```

# 注意事项 

第一次加载做ls反缓,资源都通xhr请求，所以会跨域，资源在同一下域名
兼容性，ie9及以上，功能减少网络请求


切记：一定域名下才能运行，不然会跨域。。。后期还会优化
（如：http://hemaj.com/works/demo.html）
