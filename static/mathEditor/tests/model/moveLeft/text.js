define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model" ], function(
        		 tdd,
        		 assert,
        		 Model) {

	with(tdd){
		suite("Model.moveLeft.text text节点间左移", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("text模式下输入一个英文字符，然后执行两次左移", function(){
				model.setData({data:"a"});
  				model.moveLeft();
  				assert.equal("/root/line[1]/text[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal("text", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				
  				// 如果已经是行中的第一个节点，且offset为0，
  				// 则再往前移动时，就停留在这个text节点上，不再移动到line上。
  				// 确保如果node为line，offset为0，则line中就没有任何子节点。
  				model.moveLeft();
  				assert.equal("/root/line[1]/text[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal(focusNode.nodeName, "text");
  				assert.equal(0, model.getOffset());
			});
			
			test("text模式下输入两个英文字符，然后执行两次左移", function(){
				model.setData({data:"ab"});
  				model.moveLeft();
  				model.moveLeft();
  				assert.equal("/root/line[1]/text[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal("text", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
			});
			
			test("text模式下输入两个英文字符，然后执行一次左移", function(){
				model.setData({data:"ab"});
  				model.moveLeft();
  				assert.equal("/root/line[1]/text[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal("text", focusNode.nodeName);
  				assert.equal(1, model.getOffset());
			});
			
			
		});
	}
	
});
