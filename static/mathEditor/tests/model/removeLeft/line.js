define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// summry:
	//		光标在第一行的起始位置：
	//		1.第一行没有任何节点，执行左删除时，什么也不做
	//		2.第一行的第一个节点是text节点，执行左删除时，什么也不做
	//		3.第一行的第一个节点是mathml节点，执行左删除时，什么也不做
	//		光标在第二行的起始位置：
	//		1.第二行为空行，执行左删除时，删除第二行，光标停留在第一行的结尾，第一行最后一个节点是text节点
	//		2.第二行为空行，执行左删除时，删除第二行，光标停留在第一行的结尾，第一行最后一个节点是math节点
	//		3.第二行不为空行，第一个节点是text节点，第一行的最后一个节点是text节点，则删除第二行，并将第二个text合并到第一行中的text后
	//		4.第二行不为空行，第一个节点是text节点，第一行的最后一个节点是math节点，则删除第二行，并将math节点放在第一行的text节点后面
	//		5.第二行不为空行，第一个节点是math节点，第一行的最后一个节点是text节点，则删除第二行，并将第二行的text放在第一行的math节点后面
	//		6.第二行不为空行，第一个节点是math节点，第一行的最后一个节点是math节点，则删除第二行，并将第二行的math放在第一行的math节点后面
	doh.register("Model.removeLeft.line 左删除行",[
	    {
	    	name: "测试空的model",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				t.t(model.isEmpty()); // model中没有内容
  				t.is("/root/line[1]", model.getPath()); 
  				t.is(model.getFocusNode().nodeName, "line");// 默认是第一行获取焦点
  				t.is(0, model.getOffset()); // 因为没有内容，所以偏移量为0
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});