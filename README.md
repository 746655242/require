#���
	require.js �Ǽ�ģ���������֧���첽���أ���������ģ�鷴���������localStorage���ϣ��ﵽ�������� 
        require.css����css��ʽ�����ҽ���ʽ�����������localStorage���ϣ������Ƕ�������������, timeʱ�����path·��

#ʹ��       
```html


<script src="js/require.min.js" id="require" ></script>
<script>
require.config={
	baseUrl: "js/",//����·��
	urlArgs : "20170421", //������URL�ϲ�������ֹ�ͻ��˻��棬 ����ģʽ��(new Date()).getTime()
	paths: {//·����д
		jquery:'js/jquery.min'
	},
	shim:{//��������define�¼�������
		jquery:'$'
	}	
}

//������ʽ
var b=[
	{time:'170337',path:'js/base.css'},
	{time:'170337',path:'js/chat.css'}
];
require.css.init(b);

//����js
require(['a','d','jquery'],function(A,D,$){
	console.log('��ʼ');
	A.init();
	D.init();
	$('#top').html('�������ɹ�����');
	console.log('jquery����')
});
</script>



```

#ע������ 

��һ�μ��� Ĭ��500���뿪ʼ�ص��������100����ص�
��ls����,��Դ��ͨxhr�������Ի������Դ��ͬһ������
�����ԣ�ie9�����ϣ����ܼ�����������


�мǣ��������²�������
���磺http://localhost:80/demo.html��
