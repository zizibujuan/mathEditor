define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveLeft.mn 在mn节点中左移",[
	    {
	    	name: "mathml模式下，输入一个数字，左移光标一次",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "1"});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath()); 
  				t.is(model.getFocusNode().nodeName, "mn");
  				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，输入两个数字，左移光标两次",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "1"});
  				model.setData({data: "2"});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath()); 
  				t.is(model.getFocusNode().nodeName, "mn");
  				t.is(1, model.getOffset());
  				
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mn[1]", model.getPath()); 
  				t.is(model.getFocusNode().nodeName, "mn");
  				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});