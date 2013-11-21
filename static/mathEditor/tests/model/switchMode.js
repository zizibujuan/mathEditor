define(["intern!tdd", 
        "intern/chai!assert", 
         "mathEditor/Model", 
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert, 
        		 Model, 
        		 dripLang) {

	with(tdd){
		suite("Model.switchMode", function(){
			// summary:
			//		在mathml和text两个模式之间切换。
			//		从text模式切换到mathml模式：
			//		1.line中没有任何内容，则在line中插入一个math节点
			//		2.光标在text的前面，offset==0，则在text前面插入math节点
			//		3.光标在text的后面，offset==contentLength，则在text后面插入math节点
			//		4.光标在text的中间，0 < offset < contentLength，则将text拆分为两个text，并在其间插入math节点
			//		从mathml模式切换到text模式：
			//		1.如果math中没有内容，则删除math节点，line中只有一个math节点
			//		2.如果math中没有内容，则删除math节点，math前没有节点,后面有一个text节点
			//		3.如果math中没有内容，则删除math节点，math前没有节点,后面有一个layout节点
			//		4.如果math中没有内容，则删除math节点，math前是一个text节点
			//		5.如果math中没有内容，则删除math节点，math前是一个math节点
			//		6.如果math中有内容，则将光标放在math之后，即offset=1
			//		右移进math节点
			//		1.
			//		右移出math节点
			//		左移进math节点
			//		左移出math节点
			var layoutOffset = {before:0, after:1, select:2 /*当前节点处于选中状态*/};
			var model = null;
			
			beforeEach(function () {
				model = new Model({});
			});
			
			test("从text模式切换到mathml模式，line中没有任何内容，则在line中插入一个math节点。", function(){
  				model.loadData("<root><line></line></root>");
  				model.mode = "text";
  				var line = model.getLineAt(0);
  				model.anchor.node = line;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				
  				model.switchMode();
  				var focusNode = model.getFocusNode();
  				assert.ok(model.isMathMLMode());
  				assert.equal("math", focusNode.nodeName);
  				assert.equal(layoutOffset.select, model.getOffset());
  				assert.equal("/root/line[1]/math[1]", model.getPath());
  				assert.equal(1, line.childNodes.length);
			});
			
			
			test("从text模式切换到mathml模式，光标在text的前面，offset==0，则在text前面插入math节点。", function(){
  				model.loadData("<root><line><text>abc</text></line></root>");
  				model.mode = "text";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 0;
  				model.path = [];
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"text", offset:1});
  				
  				model.switchMode();
  				var focusNode = model.getFocusNode();
  				assert.ok(model.isMathMLMode());
  				assert.equal("math", focusNode.nodeName);
  				assert.equal(layoutOffset.select, model.getOffset());
  				assert.equal("/root/line[1]/math[1]", model.getPath());
  				assert.equal(2, line.childNodes.length);
			});
			
			test("从text模式切换到mathml模式，光标在text的后面，offset==contentLength，则在text后面插入math节点。", function(){
  				model.loadData("<root><line><text>abc</text></line></root>");
  				model.mode = "text";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 3;
  				model.path = [];
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"text", offset:1});
  				
  				model.switchMode();
  				var focusNode = model.getFocusNode();
  				assert.ok(model.isMathMLMode());
  				assert.equal("math", focusNode.nodeName);
  				assert.equal(layoutOffset.select, model.getOffset());
  				assert.equal("/root/line[1]/math[2]", model.getPath());
  				assert.equal(2, line.childNodes.length);
			});
			
			test("从text模式切换到mathml模式，光标在text的中间，0 < offset < contentLength，则将text拆分为两个text，并在其间插入math节点。", function(){
				model.loadData("<root><line><text>abc</text></line></root>");
  				model.mode = "text";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = 1;
  				model.path = [];
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"text", offset:1});
  				
  				model.switchMode();
  				var focusNode = model.getFocusNode();
  				assert.ok(model.isMathMLMode());
  				assert.equal("math", focusNode.nodeName);
  				assert.equal(layoutOffset.select, model.getOffset());
  				assert.equal("/root/line[1]/math[2]", model.getPath());
  				assert.equal(3, line.childNodes.length);
  				assert.equal("text", line.childNodes[0].nodeName);
  				assert.equal("math", line.childNodes[1].nodeName);
  				assert.equal("text", line.childNodes[2].nodeName);
			});
			
			test("从mathml模式切换到text模式，如果math中没有内容，则删除math节点，line中只有一个math节点。", function(){
				model.loadData("<root><line><math></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = layoutOffset.select;
  				model.path = [];
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				
  				model.switchMode();
  				var focusNode = model.getFocusNode();
  				assert.ok(model.isTextMode());
  				assert.equal("line", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal("/root/line[1]", model.getPath());
  				assert.equal(0, line.childNodes.length);
			});
			
			test("从mathml模式切换到text模式，如果math中没有内容，则删除math节点，math前没有节点,后面有一个text节点。", function(){
				model.loadData("<root><line><math></math><text>abc</text></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = layoutOffset.select; // 不管有没有选中
  				model.path = [];
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				
  				model.switchMode();
  				var focusNode = model.getFocusNode();
  				assert.ok(model.isTextMode());
  				assert.equal("text", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal("/root/line[1]/text[1]", model.getPath());
  				assert.equal(1, line.childNodes.length);
			});
			
			test("从mathml模式切换到text模式，如果math中没有内容，则删除math节点，math前没有节点,后面有一个layout节点。", function(){
				model.loadData("<root><line><math></math><math><msqrt><mrow><mn>1</mn></mrow></msqrt></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild;
  				model.anchor.offset = layoutOffset.select; // 不管有没有选中
  				model.path = [];
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				
  				model.switchMode();
  				var focusNode = model.getFocusNode();
  				assert.ok(model.isTextMode());
  				assert.equal("math", focusNode.nodeName);
  				assert.equal(0, model.getOffset());
  				assert.equal("/root/line[1]/math[1]", model.getPath());
  				assert.equal(1, line.childNodes.length);
			});
			
			test("从mathml模式切换到text模式，如果math中没有内容，则删除math节点，math前是一个text节点。", function(){
				model.loadData("<root><line><text>abc</text><math></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.lastChild;
  				model.anchor.offset = layoutOffset.select; // 不管有没有选中
  				model.path = [];
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:2});
  				
  				model.switchMode();
  				var focusNode = model.getFocusNode();
  				assert.ok(model.isTextMode());
  				assert.equal("text", focusNode.nodeName);
  				assert.equal(3, model.getOffset());
  				assert.equal("abc", dripLang.getText(focusNode));
  				assert.equal("/root/line[1]/text[1]", model.getPath());
  				assert.equal(1, line.childNodes.length);
			});
			
			test("从mathml模式切换到text模式，如果math中有内容，则将光标放在math之后，即offset=1。", function(){
				model.loadData("<root><line><math><mn>123</mn></math></line></root>");
  				model.mode = "mathml";
  				var line = model.getLineAt(0);
  				model.anchor.node = line.firstChild.firstChild;
  				model.anchor.offset = 2;
  				model.path = [];
  				model.path.push({nodeName:"root"});
  				model.path.push({nodeName:"line", offset:1});
  				model.path.push({nodeName:"math", offset:1});
  				model.path.push({nodeName:"mn", offset:1});
  				
  				model.switchMode();
  				var focusNode = model.getFocusNode();
  				assert.ok(model.isTextMode());
  				assert.equal("math", focusNode.nodeName);
  				assert.equal(layoutOffset.after, model.getOffset());
  				assert.equal("/root/line[1]/math[1]", model.getPath());
  				assert.equal(1, line.childNodes.length);
			});
			
		});
	}
	
});