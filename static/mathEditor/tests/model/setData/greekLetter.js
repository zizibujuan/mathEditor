define([ "intern!tdd", 
         "intern/chai!assert", 
         "mathEditor/Model", 
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert, 
        		 Model, 
        		 dripLang) {

	// 无论是text模式还是mathml模式，都允许输入希腊字母
	with(tdd){
		suite("Model.setData.greekLetter 希腊字母", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			/*
			test("在text模式下输入希腊字母, 暂不支持", function(){
				model.setData({data:"&#x3B1;"});
  				
  				assert.equal("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal(focusNode.nodeName, "text");
				assert.equal("&#x3B1;", dripLang.getText(focusNode));
				assert.equal(1, model.getOffset());
			});
			*/
			
			test("在mathml模式下输入希腊字母", function(){
				model.toMathMLMode();
  				model.setData({data:"&#x3B1;", nodeName:"mi"});
  				
  				assert.equal("/root/line[1]/math[1]/mi[1]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal(focusNode.nodeName, "mi");
				assert.equal("&#x3B1;", dripLang.getText(focusNode));
				assert.equal(1, model.getOffset());
			});
			
		});
	}
	
});