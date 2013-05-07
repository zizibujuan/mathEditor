define([ "doh","mathEditor/Model" ], function(doh,Model) {

	// summary:
	//		math节点
	//		1.如果math中没有内容，offset=0，则右移后offset=1
	//		2.如果math中有内容，offset=0，则右移后，光标在math第一个子节点之前
	//		3.如果math处于选中状态，offset=0，则右移后offset=1
	doh.register("Model.moveRight.layout 在布局标签上右移",[
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