define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveLeft.root 在根式中左移光标",[
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
	    },{
	    	name: "mathml模式下，在base为1，index为2的根式root中左移光标到index。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mroot"});
  				model.setData({data: "2"});
  				model.moveRight();
  				model.setData({data: "1"});
  				model.moveLeft();
  				model.moveLeft();
  				
				t.is("/root/line[1]/math[1]/mroot[1]/mrow[2]/mn[1]", model.getPath());
				
				var indexNode = model.getFocusNode();
				t.isNot("drip_placeholder_box", indexNode.getAttribute("class"));
				t.is("mn", indexNode.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
	    // TODO:从根式外面移到根式里面
	                             
	]);
});