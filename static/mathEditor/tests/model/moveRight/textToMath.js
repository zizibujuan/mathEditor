define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveRight 右移光标时，从text模式移到mathml模式",[
	    {
	    	name: "右移光标，从text节点移到math节点",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.loadData("<root><line><text>ab</text><math><mn>1</mn></math></line></root>");
  				
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