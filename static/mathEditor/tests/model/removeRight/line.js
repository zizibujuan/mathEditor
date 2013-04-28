define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// summry:
	//		光标在最后一行的结束位置：
	//		1.最后一行没有任何节点，执行右删除时，什么也不做
	//		2.最后一行的最后一个节点是text节点，执行右删除时，什么也不做
	//		3.最后一行的最后一个节点是mathml节点，执行右删除时，什么也不做
	//		光标在倒数第二行的最后位置：
	//		1.倒数第二行为空行，执行右删除时，删除倒数第二行，光标停留在最后一行的起始位置，最后一行的第一个节点是text节点
	//		2.倒数第二行为空行，执行右删除时，删除倒数第二行，光标停留在最后一行的起始位置，最后一行的第一个节点是math节点
	//		3.倒数第二行不为空行，第一个节点是text节点，最后一行的第一个节点是text节点，则删除倒数第二行，并将最后一行的text合并到倒数第二行中的text后
	//		4.倒数第二行不为空行，第一个节点是text节点，最后一行的第一个节点是math节点，则删除倒数第二行，并将最后一行的math节点放在倒数第二行中的text节点后面
	//		5.倒数第二行不为空行，第一个节点是math节点，最后一行的第一个节点是text节点，则删除倒数第二行，并将最后一行的text放在倒数第二行中的math节点后面
	//		6.倒数第二行不为空行，第一个节点是math节点，最后一行的第一个节点是math节点，则删除倒数第二行，并将最后一行的math放在倒数第二行中的math节点后面
	doh.register("Model.removeRight.line 右删除行",[
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