define([ "intern!tdd", 
         "intern/chai!assert", 
         "mathEditor/Model", 
         "mathEditor/lang" ], function(
        		 tdd,
        		 assert, 
        		 Model, 
        		 dripLang) {
	
	with(tdd){
		suite("Model.setData.text 在text中输入文本", function(){
			
			var model = null;
			beforeEach(function () {
				model = new Model({});
			});
			
			/********************text模式下，输入英文字母*******************/
			test("text模式下，在空的model中输入一个英文字母", function(){
				model.setData({data:"a"});
				assert.equal("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal(focusNode.nodeName, "text");
				assert.equal("a", dripLang.getText(focusNode));
				assert.equal(1, model.getOffset());
			});
			
			test("text模式下，在空的model中输入连续输入两个英文字母", function(){
				model.setData({data:"ab"});
				assert.equal("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal(focusNode.nodeName, "text");
				assert.equal("ab", dripLang.getText(focusNode));
				assert.equal(2, model.getOffset());
			});
			
			test("text模式下，在空的model中输入一个字母之后，再输入一个字母", function(){
				model.setData({data:"a"});
				model.setData({data:"b"});
				assert.equal("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal(focusNode.nodeName, "text");
				assert.equal("ab", dripLang.getText(focusNode));
				assert.equal(2, model.getOffset());
			});
			
			test("text模式下，在空的model中输入两个字母，然后在字母中间插入一个字母", function(){
				model.setData({data:"ab"});
				model.anchor.offset--;
				model.setData({data:"c"});
				assert.equal("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal(focusNode.nodeName, "text");
				assert.equal("acb", dripLang.getText(focusNode));
				assert.equal(2, model.getOffset());
			});
			
			test("text模式下，在空的model中输入一个字母，然后在字母的前面插入一个字母", function(){
				model.setData({data:"a"});
				model.anchor.offset--;
				model.setData({data:"b"});
				assert.equal("/root/line[1]/text[1]", model.getPath());
				var focusNode = model.getFocusNode();
				assert.equal(focusNode.nodeName, "text");
				assert.equal("ba", dripLang.getText(focusNode));
				assert.equal(1, model.getOffset());
			});
			
			/****************text模式下输入数字*********************/
			// TODO:增加text模式下输入数字的测试用例
			test("text模式下,输入数字。text模式下，对数字和字母的处理逻辑是一样的。", function(){
				model.setData({data:"1"});
  				var focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/text[1]", model.getPath());
  				assert.equal("text", focusNode.nodeName);
  				assert.equal(1, model.getOffset());
  				assert.equal("1", dripLang.getText(focusNode));
  				
  				model.setData({data:"2"});
  				focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/text[1]", model.getPath());
  				assert.equal("text", focusNode.nodeName);
  				assert.equal(2, model.getOffset());
  				assert.equal("12", dripLang.getText(focusNode));
  				
  				model.anchor.offset--;
  				model.setData({data:"3"});
  				focusNode = model.getFocusNode();
  				assert.equal("/root/line[1]/text[1]", model.getPath());
  				assert.equal("text", focusNode.nodeName);
  				assert.equal(2, model.getOffset());
  				assert.equal("132", dripLang.getText(focusNode));
			});
			
			test("在移出math节点后,math的最后一个节点是token节点，math节点后面没有任何内容时，输入字母", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mn>12</mn>" +
  						"</math>" +
						"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 2;
				model.path = [];model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mn", offset: 1});
				model.moveRight();
				// 移出math节点后，默认切换到text模式
				assert.ok(model.isTextMode());
				model.setData({data:"a"});
				
				var focusNode = model.getFocusNode();
				assert.equal("/root/line[1]/text[2]", model.getPath());
				assert.equal("text", focusNode.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("a", dripLang.getText(focusNode));
			});
			
			test("在移出math节点后,math的最后一个节点是layout节点，math节点后面没有任何内容时，输入字母", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mfrac>" +
		  						"<mrow><mn>2</mn></mrow>" +
		  						"<mrow><mn>1</mn></mrow>" +
	  						"</mfrac>" +
  						"</math>" +
						"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 1;
				model.path = [];model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mfrac", offset: 1});
				model.moveRight();
				// 移出math节点后，默认切换到text模式
				assert.ok(model.isTextMode());
				model.setData({data:"a"});
				
				var focusNode = model.getFocusNode();
				assert.equal("/root/line[1]/text[2]", model.getPath());
				assert.equal("text", focusNode.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("a", dripLang.getText(focusNode));
			});
			
			test("在移出math节点后,math的最后一个节点是mn节点，math节点后面后面有text节点，输入字母", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mn>12</mn>" +
  						"</math>" +
  						"<text>bc</text>" +
						"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 2;
				model.path = [];model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mn", offset: 1});
				model.moveRight();
				// 移出math节点后，默认切换到text模式
				assert.ok(model.isTextMode());
				model.setData({data:"a"});
				
				var focusNode = model.getFocusNode();
				assert.equal("/root/line[1]/text[2]", model.getPath());
				assert.equal("text", focusNode.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("abc", dripLang.getText(focusNode));
			});
			
			test("在移出math节点后,math的最后一个节点是layout节点，math节点后面后面有text节点，输入字母", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mfrac>" +
		  						"<mrow><mn>2</mn></mrow>" +
		  						"<mrow><mn>1</mn></mrow>" +
	  						"</mfrac>" +
  						"</math>" +
  						"<text>bc</text>" +
						"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 1;
				model.path = [];model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mfrac", offset: 1});
				model.moveRight();
				// 移出math节点后，默认切换到text模式
				assert.ok(model.isTextMode());
				model.setData({data:"a"});
				
				var focusNode = model.getFocusNode();
				assert.equal("/root/line[1]/text[2]", model.getPath());
				assert.equal("text", focusNode.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("abc", dripLang.getText(focusNode));
			});
			
			test("左移到math节点前，math中的第一个节点是token节点，math前没有节点，输入字母", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mn>12</mn>" +
  						"</math>" +
						"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mn", offset: 1});
				model.moveLeft();
				// 移出math节点后，默认切换到text模式
				assert.ok(model.isTextMode());
				model.setData({data:"a"});
				
				var focusNode = model.getFocusNode();
				assert.equal("/root/line[1]/text[1]", model.getPath());
				assert.equal("text", focusNode.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("a", dripLang.getText(focusNode));
			});
			
			test("左移到math节点前，math中的第一个节点是layout节点，math前没有节点，输入字母", function(){
				model.loadData("<root><line>" +
  						"<math>" +
	  						"<mfrac>" +
		  						"<mrow><mn>2</mn></mrow>" +
		  						"<mrow><mn>1</mn></mrow>" +
	  						"</mfrac>" +
  						"</math>" +
						"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.firstChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 1});
				model.path.push({nodeName: "mfrac", offset: 1});
				model.moveLeft();
				// 移出math节点后，默认切换到text模式
				assert.ok(model.isTextMode());
				model.setData({data:"a"});
				
				var focusNode = model.getFocusNode();
				assert.equal("/root/line[1]/text[1]", model.getPath());
				assert.equal("text", focusNode.nodeName);
				assert.equal(1, model.getOffset());
				assert.equal("a", dripLang.getText(focusNode));
			});
			
			test("左移到math节点前，math中的第一个子节点是text节点，math前有一个text节点，输入字母", function(){
				model.loadData("<root><line>" +
							"<text>ab</text>" +
  						"<math>" +
	  						"<mn>12</mn>" +
  						"</math>" +
						"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.lastChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 2});
				model.path.push({nodeName: "mn", offset: 1});
				model.moveLeft();
				// 移出math节点后，默认切换到text模式
				assert.ok(model.isTextMode());
				model.setData({data:"c"});
				
				var focusNode = model.getFocusNode();
				assert.equal("/root/line[1]/text[1]", model.getPath());
				assert.equal("text", focusNode.nodeName);
				assert.equal(3, model.getOffset());
				assert.equal("abc", dripLang.getText(focusNode));
			});
			
			test("左移到math节点前，math中的第一个子节点是layout节点，math前有一个text节点，输入字母", function(){
				model.loadData("<root><line>" +
							"<text>ab</text>" +
  						"<math>" +
	  						"<mfrac>" +
		  						"<mrow><mn>2</mn></mrow>" +
		  						"<mrow><mn>1</mn></mrow>" +
	  						"</mfrac>" +
  						"</math>" +
						"</line></root>");
				model.mode = "mathml";
				var line = model.getLineAt(0);
				model.anchor.node = line.lastChild.firstChild;
				model.anchor.offset = 0;
				model.path = [];model.path.push({nodeName: "root"});
				model.path.push({nodeName: "line", offset: 1});
				model.path.push({nodeName: "math", offset: 2});
				model.path.push({nodeName: "mfrac", offset: 1});
				model.moveLeft();
				// 移出math节点后，默认切换到text模式
				assert.ok(model.isTextMode());
				model.setData({data:"c"});
				
				var focusNode = model.getFocusNode();
				assert.equal("/root/line[1]/text[1]", model.getPath());
				assert.equal("text", focusNode.nodeName);
				assert.equal(3, model.getOffset());
				assert.equal("abc", dripLang.getText(focusNode));
			});
		});
	}
	
});