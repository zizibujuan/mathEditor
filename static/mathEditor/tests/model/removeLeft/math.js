define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model", 
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert,
        		 Model, 
        		 dripLang) {
	
	with(tdd){
		suite("Model.removeLeft.math", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
//			test("text模式下，输入一个换行符，然后执行一次左移", function(){
//				model.setData({data:"\n"});
//				model.moveLeft();
//				
//				assert.equal("/root/line[1]", model.getPath());
//				assert.equal(model.getFocusNode(), model.getLineAt(0));
//				assert.equal(0, model.getOffset());
//			});
		});
	}
	
});