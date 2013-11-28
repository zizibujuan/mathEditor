define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model" ], function(
        		 tdd,
        		 assert,
        		 Model) {

	// summary:
	//		在有上标的公式中右移光标
	//		右移进入带有下标公式的区域
	//		1. 
	with(tdd){
		suite("Model.moveRight.sub 在有下标的符号中右移光标", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("mathml模式下，在空的有下标的公式中，将光标从base中移到subscript中", function(){
				model.toMathMLMode();
  				model.setData({data: "", nodeName: "msub"});
  				model.moveLeft();
  				model.moveRight();
  				
  				assert.equal("/root/line[1]/math[1]/msub[1]/mrow[2]/mn[1]", model.getPath());
  				var node = model.getFocusNode();
	  			assert.equal("mn", node.nodeName);
	  			assert.equal("drip_placeholder_box", node.getAttribute("class"));
	  			assert.equal(0, model.getOffset());
	  			
	  			var baseNode = node;
	  			var subscriptNode = baseNode.parentNode.previousSibling.firstChild;
	  			assert.equal("mn", subscriptNode.nodeName);
	  			assert.equal("drip_placeholder_box", subscriptNode.getAttribute("class"));
			});
			
		});
	}
	
});