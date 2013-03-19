define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveLeft frac在分数之间左移光标",[
	    {
	    	name: "mathml模式下，在空的分数上先右移光标，然后再左移",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data:"", nodeName:"mfrac"});
  				model.moveRight();
  				model.moveLeft();
  				
  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[1]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				t.t(node.parentNode.previousSibling == null);
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});