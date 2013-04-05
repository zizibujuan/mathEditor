define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveLeft 在有下标的符号中左移光标",[
	    {
	    	name: "mathml模式下，在空的有下标的公式中，将光标从subscript移到base中",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data:"", nodeName:"msub"});
  				model.moveLeft();
  				
  				t.is("/root/line[1]/math[1]/msub[1]/mrow[1]/mn[1]", model.getPath());
  				var node = model.getFocusNode();
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
				
				var baseNode = node;
				var subscriptNode = baseNode.parentNode.nextSibling.lastChild;
				t.is("mn", subscriptNode.nodeName);
				t.is("drip_placeholder_box", subscriptNode.getAttribute("class"));
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});