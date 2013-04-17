define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveLeft.mo 在mo节点中左移光标",[
	    {
	    	name: "mathml模式下，输入一个操作符=，然后左移光标",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				
  				model.setData({data:"="});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mo[1]", model.getPath()); 
  				t.is(model.getFocusNode().nodeName, "mo");
  				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，输入一个unicode操作符 \"&#x2A7E;\"，然后左移光标",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				// &#x2A7E;的长度为1
  				model.setData({data:"&#x2A7E;", nodeName: "mo"});
  				model.moveLeft();
  				t.is("/root/line[1]/math[1]/mo[1]", model.getPath()); 
  				t.is(model.getFocusNode().nodeName, "mo");
  				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});