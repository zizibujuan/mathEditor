define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveRight 在有上标的符号中左移光标",[
	    {
	    	name: "mathml模式下，在空的有上标的公式中，将光标从supscript中移到base中",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				
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