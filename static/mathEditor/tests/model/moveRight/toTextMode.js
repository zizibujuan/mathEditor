define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveRight 右移光标时，从mathml模式移到text模式",[
	    {
	    	name: "右移光标，从math节点移到text节点",
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