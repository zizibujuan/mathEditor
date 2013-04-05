define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveRight 在有上标的符号中右移光标",[
	    {
	    	name: "mathml模式下，在空的有上标的公式中，将光标从base中移到supscript中",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data: "", nodeName: "msup"});
  				model.moveLeft();
  				model.moveRight();
  				
  				t.is("/root/line[1]/math[1]/msup[1]/mrow[2]/mn[1]", model.getPath());
  				var node = model.getFocusNode();
	  			t.is("mn", node.nodeName);
	  			t.is("drip_placeholder_box", node.getAttribute("class"));
	  			t.is(0, model.getOffset());
	  			
	  			var baseNode = node;
	  			var superscriptNode = baseNode.parentNode.previousSibling.firstChild;
	  			t.is("mn", superscriptNode.nodeName);
	  			t.is("drip_placeholder_box", superscriptNode.getAttribute("class"));
  			},
  			tearDown: function(){
  				
  			}
	    }
	                             
	]);
});