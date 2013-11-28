define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model" ], function(
        		 tdd,
        		 assert,
        		 Model) {

	with(tdd){
		suite("Model.moveRight.text text节点间右移", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("text模式下输入一个英文字符，然后执行右移", function(){
				model.setData({data:"a"});
  				model.moveRight();
  				assert.equal("/root/line[1]/text[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal(focusNode.nodeName, "text");
  				assert.equal(1, model.getOffset());
  				
  				model.moveRight();
  				assert.equal("/root/line[1]/text[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal(focusNode.nodeName, "text");
  				assert.equal(1, model.getOffset());
			});
			
			test("text模式下输入一个英文字符，执行左移，然后执行右移", function(){
				model.setData({data:"a"});
  				model.moveLeft();
  				model.moveRight();
  				assert.equal("/root/line[1]/text[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal(focusNode.nodeName, "text");
  				assert.equal(1, model.getOffset());
			});
			
		});
	}
	
});
