
  // 获取class值
  function getByClass(sClass){
      var aResult=[];
      var aEle=document.getElementsByTagName('*');
      for(var i=0;i<aEle.length;i++){
         /*当className相等时添加到数组中*/
         if(aEle[i].className==sClass){
              aResult.push(aEle[i]);
          }
      }
      return aResult;
  };

  // 实现所有商品模糊查询 
  function searchCommodity(){
      var showProject = getByClass("showProject");
      var input = document.getElementById("cartInput"); //获取搜索内容
      var filter = input.value.toUpperCase();
      var length = showProject.length;
      for(i = 0; i<length; i++){
        var name = showProject[i].innerText;
        if(name){
           //indexOf()方法可返回某个指定的字符串值在字符串中首次出现的位置
           if(name.toUpperCase().indexOf(filter) > -1){
              showProject[i].style.display = "";
           }
           else{
              showProject[i].style.display = "none";
           }
        }     
      }
  }

  // 实现购物车模糊查询 
  function searchCart() { 
    // 声明变量 
    var input, filter, table, tr, td, i; 
    input = document.getElementById("cartInput"); 
    filter = input.value.toUpperCase(); 
    table = document.getElementById("cartTable"); 
    tr = table.getElementsByTagName("tr"); 
    // 循环表格每一行，查找匹配项 
    for (i = 0; i < tr.length; i++) { 
      td = tr[i].getElementsByTagName("td")[1]; 
      if (td) { 
        if (td.innerText.toUpperCase().indexOf(filter) > -1) { 
          tr[i].style.display = ""; 
        } else { 
          tr[i].style.display = "none"; 
        } 
      } 
    } 
  }