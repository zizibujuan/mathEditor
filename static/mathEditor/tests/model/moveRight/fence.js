define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// summary:
	//		在括号上右移光标（目前只支持一个mrow子节点）
	//		右移进括号，
	//		1. 括号前没有任何节点，括号内第一个节点是token节点
	//		2. 括号前没有任何节点，括号内第一个节点是layout节点
	//		3. 括号前有一个token节点，从token后右移进括号内的第一个节点，第一个节点是token节点
	//		4. 括号前有一个token节点，从token后右移进括号内的第一个节点，第一个节点是layout节点
	//		5. 括号前有一个layout节点，从layout后右移进括号内第一个节点，第一个节点是token节点
	//		6. 括号前有一个layout节点，从layout后右移进括号内的第一个节点，第一个节点是layout节点
	//		右移出括号
	//		1. 括号内最后一个节点是token节点
	//		2. 括号内最后一个节点是layout节点
	doh.register("Model.moveRight.fence",[
	    {
	    	name: "测试空的model",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
//  				var model = this.model;
//  				t.t(model.isEmpty()); // model中没有内容
//  				t.is("/root/line[1]", model.getPath()); 
//  				t.is(model.getFocusNode().nodeName, "line");// 默认是第一行获取焦点
//  				t.is(0, model.getOffset()); // 因为没有内容，所以偏移量为0
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});