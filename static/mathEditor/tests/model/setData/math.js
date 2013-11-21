define([ "intern!tdd", 
         "intern/chai!assert",
         "mathEditor/Model",
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert,
        		 Model,
        		 dripLang) {

	with(tdd){
		suite("Model.setData.math", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			test("在空的math前插入字母", function(){
				model.loadData("<root><line><math></math></line></root>");
  				model.mode = "text";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 0;// 在math前
  				model.path = [];model.path.push({nodeName: "root"});
  				model.path.push({nodeName: "line", offset: 1});
  				model.path.push({nodeName: "math", offset: 1});
  				model.setData({data: "a"});
  				assert.equal("/root/line[1]/text[1]", model.getPath());
  				var focusNode = model.getFocusNode();
  				assert.equal("text", focusNode.nodeName);
  				assert.equal(1, model.getOffset());// 表示已经移到math之后
  				assert.ok(model.isTextMode());
  				assert.equal("a", dripLang.getText(focusNode));
  				assert.equal(2, dripLang.getChildLength(focusNode.parentNode));
			});
		});
	}
	
});