define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveRight.root 在根式中右移光标",[
	    {
	    	name: "mathml模式下，在空的根式root中右移光标，将光标从index中移到base中。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mroot"});
  				model.moveRight();
  				
				t.is("/root/line[1]/math[1]/mroot[1]/mrow[1]/mn[1]", model.getPath());
				
				var baseNode = model.getFocusNode();
				t.is("mn", baseNode.nodeName);
				t.is("drip_placeholder_box", baseNode.getAttribute("class"));
				t.is(0, model.getOffset());
				
				var indexNode = baseNode.parentNode.nextSibling.firstChild;
				t.is("mn", indexNode.nodeName);
				t.is("drip_placeholder_box", indexNode.getAttribute("class"));
  			},
  			tearDown: function(){
  				
  			}
	    },{
	    	name: "mathml模式下，在空的根式root中右移光标两次，将光标移到根式之后。",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "mroot"});
  				model.moveRight();
  				model.moveRight();
  				
				t.is("/root/line[1]/math[1]/mroot[1]", model.getPath());
				
				var node = model.getFocusNode();
				t.is("mroot", node.nodeName);
				t.is(1, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
	    // TODO:从根式外面移到根式里面
	                             
	]);
});