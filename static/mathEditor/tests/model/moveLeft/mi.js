define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveLeft.mi 在mi节点中左移光标",[
	    {
	    	name: "mathml模式下，输入一个单字符的变量x，然后左移光标",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				
  				model.setData({data:"x"});
  				model.moveLeft();
  				
  				t.is("/root/line[1]/math[1]/mi[1]", model.getPath()); 
  				t.is(model.getFocusNode().nodeName, "mi");
  				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },
	    /**********多字符变量，如三角函数**********/
	    {
	    	name: "mathml模式下，输入一个多字符的变量sin，然后左移光标一次",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				
  				model.setData({data:"sin", nodeName: "mi"});
  				model.moveLeft();
  				
  				t.is("/root/line[1]/math[1]/mi[1]", model.getPath()); 
  				t.is(model.getFocusNode().nodeName, "mi");
  				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});