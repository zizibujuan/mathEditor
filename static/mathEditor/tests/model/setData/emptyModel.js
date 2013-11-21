define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model" ], function(
        		 tdd,
        		 assert,
        		 Model) {
	
	with(tdd){
		suite("Model.setData.emptyModel", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("测试空的model", function(){
				assert.ok(model.isEmpty()); // model中没有内容
				assert.equal("/root/line[1]", model.getPath()); 
				assert.equal(model.getFocusNode().nodeName, "line");// 默认是第一行获取焦点
				assert.equal(0, model.getOffset()); // 因为没有内容，所以偏移量为0
			});
		});
	}
	
});