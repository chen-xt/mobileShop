
window.onload=function(){
	//处理浏览器兼容性
	if(!document.getElementByClassName){
		document.getElementByClassName=function(cls){//传入一个class值
			var ret=[];
			var els=document.getElementsByTagName('*');
			for(var i=0,len=els.length;i<len;i++){
				if(els[i].className===cls||
					els[i].className.indexOf(cls+' ')>=0||
					els[i].className.indexOf(' '+cls+' ')>=0||
					els[i].className.indexOf(' '+cls)>=0){
					ret.push(els[i]);
				}
			}
			return ret;
		}
	}

	var cartTable=document.getElementById('cartTable');//表格
	//.rows :表格元素特有的属性，存放结点所有tr元素.这里获取 cartTable tbody（children[1]）里所有的tr元素
	var tr=cartTable.children[1].rows;
	var checkInputs=document.getElementByClassName('check');//获取所有的复选框(包括全选框)
	var checkAllInputs=document.getElementByClassName('check-all');//获取2个全选框
	var selectedTotal=document.getElementById('selectedTotal');//已选商品的总件数
	var priceTotal=document.getElementById('priceTotal');//合计的价格
	var selected=document.getElementById('selected');//已选商品
	var foot=document.getElementById('foot');
	var selectedViewList=document.getElementById('selectedViewList');
	var deleteAll=document.getElementById('deleteAll');

	//计算的函数
	function getTotal(){
		var selected=0;
		var price=0;
		var HTMLstr='';
		for(var i=0,len=tr.length;i<len;i++){
			if(tr[i].getElementsByTagName('input')[0].checked){//每个tr的第1个input如果被选中
				tr[i].className='on';
				selected +=parseInt(tr[i].getElementsByTagName('input')[1].value);//将每个tr的第2个input的值相加
				price += parseFloat(tr[i].cells[4].innerHTML);//tr.cells是表格的特有属性，表示的是所有的td元素
				HTMLstr += '<div><img src="' + tr[i].getElementsByTagName('img')[0].src + '"><span class="del" index="' + i + '">取消选择</span></div>';//加入第一张图片
			}else{
				tr[i].className='';
			}
		}
		 selectedTotal.innerHTML=selected;
		 priceTotal.innerHTML=price.toFixed(2);//.toFixed(2)保留2位小数
		 selectedViewList.innerHTML=HTMLstr;

		 if(selected==0){//如果没有选中，则将浮层隐藏
		 	foot.className='foot';
		 }
	}

	//小计价格的函数
	function getSubTotal(tr){
		var tds=tr.cells;
		var price=parseFloat(tds[2].innerHTML);
		var count=parseInt(tr.getElementsByTagName('input')[1].value);
		var SubTotal=parseFloat(price*count);
		tds[4].innerHTML=SubTotal.toFixed(2);
	}


	for(var i=0,len=checkInputs.length;i<len;i++){
		checkInputs[i].onclick=function(){
			if(this.className==='check-all check'){//判断是否是全选框
				for(var j=0;j<checkInputs.length;j++){
					checkInputs[j].checked=this.checked;//将所有的复选框的状态改成与当前全选框的状态一致
				   }
			   }
			if(this.checked==false){
				//只要购物车有一个复选框未选，则全选框的状态改为未选
				for(var k=0;k<checkAllInputs.length;k++){
					checkAllInputs[k].checked=false;
				  }
			   }
			getTotal();//每选中一次复选框调用函数一次
		  }
	}

	selected.onclick=function(){//已有商品的点击事件
		 	if(foot.className=='foot'){
		 		if(selectedTotal.innerHTML!=0){//if判断，如果没有一个选中，点击已有商品也不会出现浮层
		 		foot.className='foot show';//把class的名字加上show
		 		}
		 	}else{
		 		foot.className='foot';
		 	}
		 }
	 
	//取消选择域事件代理
	selectedViewList.onclick=function(e){
		/* if(e){//处理浏览器兼容性
		 	e=e;
		 }else{
		 	e=window.event;
		}*/
		e=e||window.event;//同上面注释的代码效果一致
		var el=e.srcElement;//在这里如果点击的是图片，则值为img；如果点击取消选择，则值为span
		if(el.className=='del'){
			var index=el.getAttribute('index');//getAttribute获取自定义的属性
			var input=tr[index].getElementsByTagName('input')[0];
			input.checked=false;//取消选择后，复选框的打钩去掉
			input.onclick();//触发onclick事件，再做一次计算，取消选择同时把浮层的照片删除
		}
	}

	//增减商品数量
	for(var i=0;i<tr.length;i++){
		tr[i].onclick=function(e){
			e=e||window.event;
			var el=e.srcElement;
			var cls=el.className;
			var input=this.getElementsByTagName('input')[1];
			var val=parseInt(input.value);
			var reduce=this.getElementsByTagName('span')[1];
			switch(cls){
				case 'add':
					input.value=val+1;
					reduce.innerHTML='-';
					getSubTotal(this);
					break;
				case 'reduce':
					if(val>1){
						input.value=val-1;
					}
					if(input.value<=1){
						reduce.innerHTML='';
					}
					getSubTotal(this);
					break;
				case 'delete'://单行删除
					var conf=confirm('确定要删除吗？');//返回一个布尔值
					if(conf){
						this.parentNode.removeChild(this);//获取tr的父节点tbody再删除它的子节点(tr)
					}
					break;
				default:
					break;
			}
			getTotal();
		}
		//手动输入的数量，计算价格
		tr[i].getElementsByTagName('input')[1].onkeyup=function(){//onkeyup键盘弹起事件
			var val=parseInt(this.value);
			var tr=this.parentNode.parentNode;//this指‘input’,它的父节点是td，td的父节点是tr
			var reduce=tr.getElementsByTagName('span')[1];
			if(isNaN(val)||val<1){//输入非数字或者负数，显示1
				val=1;
			}
			this.value=val;
			if(val<=1){//隐藏减号
				reduce.innerHTML='';
			}else{
				reduce.innerHTML='-';
			}
			getSubTotal(tr);
			getTotal();
		}
	}

	//删除选中的多个行
	deleteAll.onclick=function(){
		if(selectedTotal.innerHTML!='0'){//没有选的话不做任何操作
		var conf=confirm('确定删除吗？');
			if(conf){
				for(var i=0;i<tr.length;i++){
					var input=tr[i].getElementsByTagName('input')[0];
					if(input.checked){
						tr[i].parentNode.removeChild(tr[i]);
						i--;//不加否则没办法全删除
					}
				}	
			}
		}
	}

}