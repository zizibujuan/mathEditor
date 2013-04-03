define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveLeft 在根式中左移光标",[
	    {
	    	name: "mathml模式下，在空的根式root中左移光标，将光标从index中移到根式之前。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mroot"});
  				model.moveLeft();
  				
				t.is("/root/line[1]/math[1]/mroot[1]", model.getPath());
				
				var baseNode = model.getFocusNode();
				t.is("mroot", baseNode.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，在空的根式root中右移光标到base，然后左移光标到index。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mroot"});
  				model.moveRight();
  				model.moveLeft();
  				
				t.is("/root/line[1]/math[1]/mroot[1]/mrow[2]/mn[1]", model.getPath());
				
				var indexNode = model.getFocusNode();
				t.is("drip_placeholder_box", indexNode.getAttribute("class"));
				t.is("mn", indexNode.nodeName);
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});