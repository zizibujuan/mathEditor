// CJK 中日韩统一表意文字（CJK Unified Ideographs）
define([ "intern!tdd", 
         "intern/chai!assert", 
         "mathEditor/Model", 
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert, 
        		 Model, 
        		 dripLang) {

	with(tdd){
		suite("Model.setData.CJK 中日韩文字", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("在空的model中输入一个汉字", function(){
				model.setData({data:"水"});
				assert.equal("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal(focusNode.nodeName, "text");
				assert.equal("水", dripLang.getText(focusNode));
				assert.equal(1, model.getOffset());
			});
			
			test("在空的model中输入连续输入两个汉字", function(){
				model.setData({data:"大海"});
				assert.equal("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal(focusNode.nodeName, "text");
				assert.equal("大海", dripLang.getText(focusNode));
				assert.equal(2, model.getOffset());
			});
			
			test("在空的model中输入一个汉字之后，再输入一个汉字", function(){
				model.setData({data:"大"});
				model.setData({data:"海"});
				assert.equal("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal(focusNode.nodeName, "text");
				assert.equal("大海", dripLang.getText(focusNode));
				assert.equal(2, model.getOffset());
			});
			
			test("在空的model中输入两个汉字，然后在字母中间插入一个汉字", function(){
				model.setData({data:"大海"});
				model.anchor.offset--;
				model.setData({data:"水"});
				assert.equal("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal(focusNode.nodeName, "text");
				assert.equal("大水海", dripLang.getText(focusNode));
				assert.equal(2, model.getOffset());
			});
			
			test("在空的model中输入一个汉字，然后在字母的前面插入一个汉字", function(){
				model.setData({data:"大"});
				model.anchor.offset--;
				model.setData({data:"海"});
				assert.equal("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal(focusNode.nodeName, "text");
				assert.equal("海大", dripLang.getText(focusNode));
				assert.equal(1, model.getOffset());
			});
		});
	}
	
});