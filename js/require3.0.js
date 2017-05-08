/*
做ls反缓,资源都通xhr请求，所以不跨域
兼容性，ie8及以上，功能减少网络请求
require.css一次加载css样式，并且将样式储存浏览器上，
参数是多个对象组成数组, time时间戳，path路径

require.js 是简单模块加载器，支持异步加载，并将请求模块储存浏览器上 
require.config={
	baseUrl: "js/",//公共路径
    urlArgs : "22", //附加在URL上参数，防止客户端缓存
    paths: {//路径设置
        jquery:'js/jquery.min'
    },
	shim:{//不是正规define事件，配置
		jquery:'$'
	}	
}
已知bug，请求代友解析时间大于100毫秒，会导致无法触发，
作者：带着乌龟去看大海
*/
var define;

var require=function(p,f,a){
	fn=function(){
		return{
			config:{
				baseUrl: "/res/js/",
				urlArgs :(new Date()).getTime(),//附加在URL上参数，防止客户端缓存
				paths: {
					jquery:'/res/js/lib/jquery-1.9.1.min',		
					doT:'/res/js/lib/doT.min'		
				},
				shim:{
					jquery:"$",
					doT:"doT"
				}	
			},
			cache:[],//（依赖路径，回调函数，文件名字）,
			module:{},//解析
			url:{},//已请求列表
			index:0,//加载js文件个数
			main:function(p,f){
				var _this=this;
				this.rf=f;
				this.rp=p;
				
				for(var i in p){
					_this.load(p[i],function(xml){
						_this.eval('script',xml);	
					});		
				}
			},
			eval:function(dom,text){
				var script = document.createElement(dom);
				script.setAttribute('type', 'text/javascript');          
				var code = '!function(){' + text + '\n}();';
				
				//兼容ie8下以
				if (document.documentMode<9){
					script.text=code;	
					document.getElementsByTagName('head')[0].appendChild(script);
				}else{
					script.appendChild(document.createTextNode(code));
					document.head.appendChild(script);
				}	
			},
			load:function(path,f){
				
				var _this=this;
				_this.index+=1;	
				var index=_this.index;
				var p=path;
				var baseUrl=_this.config.baseUrl;
				var urlArgs=_this.config.urlArgs;
				
				
				//判断是否为配置文件
				if(_this.config.paths[path]){
					var p=_this.config.paths[path];
				}
				//补充后缀
				p=p+'.js';
				
				//补充公共url,及时间戳;
				if(!_this.config.paths[path]){
					if(baseUrl){p=baseUrl+p;}
					if(urlArgs){p=p+'?'+urlArgs;}
				}
				
				if(localStorage['urlArgs']==urlArgs){
					localStorage.clear();
				}
				//console.log(localStorage[path]);
		
				//判断浏览器存有反缓，及时间戳;
				if(typeof(Storage)!=="undefined"&&localStorage[path]!==undefined&&localStorage['urlArgs']==urlArgs){	
					//console.log('浏览器加载:'+path);
					_this.path=path;
					_this.url[path]=1;
					f(localStorage[path]);
					//库的加载
					if(_this.config.paths[path]){
						 define([]);
					}	
					return false;
				}
				//console.log('加载'+path);
				//判断否重复加载请求
				if(_this.url[path]){
					_this.asort(path)
					return false;
				}
				_this.url[path]=1;	
				var xmlhttp=new XMLHttpRequest();
				xmlhttp.onreadystatechange=function(){
					if(xmlhttp.readyState==4 && xmlhttp.status==200){
							 //console.log('加载:'+path);
							_this.path=path;
							var code=xmlhttp.response||xmlhttp.responseText;
							//回调函数执行
							f(code);
							//库的加载
							if(_this.config.paths[path]){
								define([]);
							}	
							
							//储存浏览器
							if(typeof(Storage)!=="undefined"){
								localStorage[path]=code;
							}
					}	
				};
				xmlhttp.open("GET",p,true);
				xmlhttp.send();	
			},
			asort:function(path){
				var _this=this;
				setTimeout(function(){
					for(var i=0; i<_this.cache.length;i++){
						if(_this.cache[i]['name']==path){
							_this.cache.push(_this.cache[i]);
							_this.go(_this.cache.length)
							return false;
						}
					}	
				},100);
			},
			define:function(p,f){
				if(typeof(p)== 'function'){
					f=p;
					p=[];
				}
				/*console.log(require.path);
				console.log(require.cache);*/
				//储存模块
				DOM.cache.push({'name':DOM.path,'difine':p,'f':f});
				var index=DOM.cache.length;
				var path=DOM.path;
				setTimeout(function(){DOM.go(index,path)},10);	
				if(p.length>0){
					for(var i in p){
						DOM.load(p[i],function(xml){
							DOM.eval('script',xml);
						});
					}
				}
			},
			go:function(ge,path){
				var _this=this;
				var cache=_this.cache;
				var index=_this.index;
				//console.log('总数：'+index);
				//console.log('加载个数'+ge);
				if(ge==index){
					//倒序执行
					for(var i=cache.length-1;i>=0;i--){
						var name=cache[i]['name'];
						var difine=	cache[i]['difine'];
						var f=	cache[i]['f'];
						switch(difine.length){
							case 0://不传参
								if(f){
									_this.module[name]=f();
								}else{
									var b=eval(this.config.shim[name]);
									_this.module[name]=b;
								}
								break;
							default://多个参数
								var e=[];
								for(var di in difine){		
									var path=difine[di];
									e.push(_this.module[path]);
								}
								_this.module[name]=f.apply(f,e);
						}	
					}		
					//将触发函数的，传参转化对象
					var start=[];
					
					for(var i in _this.rp){
						start.push(_this.module[_this.rp[i]]);
					}
							
					//_this.rf(...start);
					
					//触发事件
					_this.rf.apply(_this.rf,start);
					
					//等待加载
					require.iswait=false;
					//判断所有js加完毕
					require.rge+=1;
					if(require.rge==require.loadge){	
						localStorage['urlArgs']=_this.config.urlArgs;
					}
				}
			}
		}
	}
	
	//全部js加载完，判断处理
	if(a==1){}else{
		require.loadge+=1;
	}
	if(require.iswait){
		var p1=p;
		var f1=f;
		//console.log('请等待...')
		var t=setInterval(function(){
			if(!require.iswait){
				//console.log('取消');
				//console.log(p1);
				require(p1,f1,1);
				clearInterval(t);
			}
		},10);
		return;
	}

	var DOM=new fn();
	if(require.config){
		//console.log('配置合并');
		DOM.config=require.extend(require.config,DOM.config);
	}
	define=DOM.define;
	//没有依赖，直接执行
	if(typeof(p)== 'function'){p();return;};
	//调用string路径
	if(typeof(p)== 'string'){
		 var e=[]
		 var isp=p;
		 e.push(p);
		 p=e; 
		 f=function(){};
	};	
	
	DOM.main(p,f);
	require.iswait=true;
	return DOM;
}
require.iswait=false;
require.rge=0;
require.loadge=0;


require.extend=function(o,n){
	if(!o){
		o={};
	}
	for (var p in n){
        if(n.hasOwnProperty(p) && (!o.hasOwnProperty(p) )){o[p]=n[p];}
    }
	return o;
}

require.css={
	index:0,
	stylesheet:{},
	json_ie7:function(f){
		//兼容ie7以下json未定义
		if(document.documentMode<=7){	
			var json=document.createElement('script');
			json.setAttribute('src','js/json2.js');
			document.getElementsByTagName('head')[0].appendChild(json);
			json.onreadystatechange=function(){
				if(json.readyState=='loaded'){
					f();
				}
			}
		}else{
			f();
		}
	},
	init:function(b){
		var _this=this;
		_this.b=b;
		_this.json_ie7(function(){
			_this.html=document.getElementsByTagName('html')[0];
			_this.html.style.display='none';
			_this.length=b.length;
			for(var i in b){
				var data=b[i];
				var path=data['path'];
				var time=data['time'];
				
				//不支持处理localStorage
				if (typeof(Storage) == "undefined"){
					_this.next(path,data);
					continue ;
				}
				if(!localStorage[path]){
					_this.next(path,data);
				}else if(localStorage[path]){	
					var ltime=JSON.parse(localStorage[path]).time;
					if(time!==ltime){
						_this.next(path,data);	
					}else{
						var notdata=localStorage[path];
						_this.stylesheet[path]=JSON.parse(notdata);
						_this.listload();
					}	
				}		
			}	
		});		
	},
	next:function(path,data){
		var _this=this;			
		_this.loadXMLDoc(path,data,function(xmlhttp,data){
			var list=xmlhttp.response||xmlhttp.responseText;			
			var notdata=JSON.stringify({'path':path,'time':data.time,'list':list});
			localStorage[data.path]=notdata;
			_this.stylesheet[path]=JSON.parse(notdata);
			_this.listload();

		})
		
	},
	loadXMLDoc:function(path,data,cfunc){
		var xmlhttp;
		if(window.XMLHttpRequest){
		  xmlhttp=new XMLHttpRequest();
		}else{
		  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange=function(){
			if(xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				cfunc(xmlhttp,data);
			}	
		};
		var p=path+'?'+data.time;
		xmlhttp.open("GET",p,true);
		xmlhttp.send();	
	},
	listload:function(){
		var _this=this;
		this.index+=1;
		if(this.index==this.length){
			 for(var i in _this.b){
					var obj=_this.stylesheet[_this.b[i]['path']];
						var dom=document.createElement("style");
						//兼容ie8
						if('styleSheet' in dom){ 
							dom.setAttribute('type','text/css');                  
							dom.styleSheet.cssText = obj.list;               
						 }else{
							dom.innerHTML = obj.list;          
						 }
						document.getElementsByTagName('head')[0].appendChild(dom);	
						console.log('加载成功：'+obj.path);
				}
				_this.html.style.display='block';
			
		}
	}	
}
		

