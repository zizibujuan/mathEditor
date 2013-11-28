define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model" ], function(
        		 tdd,
        		 assert,
        		 Model) {

	with(tdd){
		suite("Model.moveLeft.mo 在mo节点中左移光标", function(){
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("mathml模式下，输入一个操作符=，然后左移光标", function(){
				model.toMathMLMode();
  				
  				model.setData({data:"="});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/mo[1]", model.getPath()); 
  				assert.equal(model.getFocusNode().nodeName, "mo");
  				assert.equal(0, model.getOffset());
			});
			
			test("mathml模式下，输入一个unicode操作符 \"&#x2A7E;\"，然后左移光标", function(){
				model.toMathMLMode();
  				// &#x2A7E;的长度为1
  				model.setData({data:"&#x2A7E;", nodeName: "mo"});
  				model.moveLeft();
  				assert.equal("/root/line[1]/math[1]/mo[1]", model.getPath()); 
  				assert.equal(model.getFocusNode().nodeName, "mo");
  				assert.equal(0, model.getOffset());
			});
			
			
		});
	}
});