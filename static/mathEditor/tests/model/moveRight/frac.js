define([ "doh","mathEditor/Model" ], function(doh,Model) {

	doh.register("Model.moveRight frac在分数之间右移光标",[
	    {
	    	name: "mathml模式下，在一个空的分子上右移光标",
  			setUp: function(){
  				this.model = new Model({});
  			},
  			runTest: function(t){
  				var model = this.model;
  				model.toMathMLMode();
  				model.setData({data:"", nodeName:"mfrac"});
  				model.moveRight();
  				
  				t.is("/root/line[1]/math[1]/mfrac[1]/mrow[2]/mn[1]", model.getPath());
				var node = model.getFocusNode();
				
				t.t(node.parentNode.previousSibling != null);
				t.t(node.parentNode.nextSibling == null);
				t.is("mn", node.nodeName);
				t.is("drip_placeholder_box", node.getAttribute("class"));
				t.is(0, model.getOffset());
  			},
  			tearDown: function(){
  				this.model = null;
  			}
	    }
	    
	    // 在分数中输入字母和操作符号等。
	                             
	]);
});