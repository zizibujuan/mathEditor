define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model" ], function(
        		 tdd,
        		 assert,
        		 Model) {

	with(tdd){
		suite("Model.loadData 加载xml文件", function(){
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("加载空内容", function(){
  				model.loadData();
  				assert.ok(model.isEmpty());
  				
  				model.clear();
  				model.loadData("");
  				assert.ok(model.isEmpty());
			});
			
			test("加载xml字符串", function(){
  				model.loadData("<root><line><text>a</text></line></root>");
  				assert.equal(1, model.getLineCount());
			});
		});
	}
	
});